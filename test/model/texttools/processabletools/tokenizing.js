"use strict";

var ProcessableTools = require('../../../../src/model/texttools/processabletools');
var Tokens = ProcessableTools.Tokens;
var Interval = Tokens.Interval;
var Tokenizer = ProcessableTools.Processing.Tokenizer;
var ProcessableText = ProcessableTools.ProcessableText;

exports.tokenizeLeaf = {
    Empty: function ( test ) {
        var runcount = 0;
        
        var constructor = function () {
            ++runcount
        };
        var tokenizer = new Tokenizer( constructor, new Interval(0,1), {} );
        
        var token = new Tokens.Empty( );
        token.tokenize(tokenizer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    // There is no testcase for Leaf not in the tokenizer's interval, since that check is the owner token's responsibility
    emptyLeaf: function ( test ) {
        var runcount = 0;
        
        var constructor = function () {
            ++runcount
        };
        var tokenizer = new Tokenizer( constructor, new Interval(0,0), {} );
        
        var token = new Tokens.Leaf( '' );
        token.tokenize(tokenizer);
        
        test.equals( runcount, 1 );
        
        test.done();
    },
    noBorderGap: function ( test ) {
        var runcount = 0;
        var placeholder = {};
        
        var constructor = function ( content, interval ) {
            test.equals( content, 'a', "bad content" );
            test.ok( interval.equals( new Interval(0,1) ), "bad interval" );
            ++runcount;
            return placeholder;
        };
        var tokenizer = new Tokenizer( constructor, new Interval(0,1), {} );
        
        var token = new Tokens.Leaf( 'a' );
        var result = token.tokenize(tokenizer);
        
        test.equals( result.content.length, 1, "too many child tokens created during split" );
        test.equals( result.content[0], placeholder, "bad new token" );
        
        test.equals( runcount, 1 );
        
        test.done();
    },
    onlyOpeningBorderGap: function ( test ) {
        var runcount = 0;
        var placeholder = {};
        
        var constructor = function ( content, interval ) {
            test.equals( content, 'b', "bad content" );
            test.ok( interval.equals( new Interval(1,2) ), "bad interval" );
            ++runcount;
            return placeholder;
        };
        var tokenizer = new Tokenizer( constructor, new Interval(1,2), {} );
        
        var token = new Tokens.Leaf( 'ab' );
        var result = token.tokenize(tokenizer);
        
        test.equals( result.content.length, 2 );
        test.equals( result.content[0].content, 'a', "bad new token" );
        test.equals( result.content[1], placeholder, "bad new token" );
        
        test.equals( runcount, 1 );
        
        test.done();
    },
    onlyClosingBorderGap: function ( test ) {
        var runcount = 0;
        var placeholder = {};
        
        var constructor = function ( content, interval ) {
            test.equals( content, 'a', "bad content" );
            test.ok( interval.equals( new Interval(0,1) ), "bad interval" );
            ++runcount;
            return placeholder;
        };
        var tokenizer = new Tokenizer( constructor, new Interval(0,1), {} );
        
        var token = new Tokens.Leaf( 'ab' );
        var result = token.tokenize(tokenizer);
        
        test.equals( result.content.length, 2 );
        test.equals( result.content[0], placeholder, "bad new token" );
        test.equals( result.content[1].content, 'b', "bad new token" );
        
        test.equals( runcount, 1 );
        
        test.done();
    },
    OpeningAndClosingBorderGap: function ( test ) {
        var runcount = 0;
        var placeholder = {};
        
        var constructor = function ( content, interval ) {
            test.equals( content, 'b', "bad content" );
            test.ok( interval.equals( new Interval(1,2) ), "bad interval" );
            ++runcount;
            return placeholder;
        };
        var tokenizer = new Tokenizer( constructor, new Interval(1,2), {} );
        
        var token = new Tokens.Leaf( 'abc' );
        var result = token.tokenize(tokenizer);
        
        test.equals( result.content.length, 3 );
        test.equals( result.content[0].content, 'a', "bad new token" );
        test.equals( result.content[1], placeholder, "bad new token" );
        test.equals( result.content[2].content, 'c', "bad new token" );
        
        test.equals( runcount, 1 );
        
        test.done();
    },
};

exports.tokenizeFork = {
    emptyFork: function ( test ) {
        var runcount = 0;
        
        var constructor = function () {
            ++runcount
        };
        var tokenizer = new Tokenizer( constructor, new Interval(0,0), {} );
        
        var token = new Tokens.Fork( );
        token.tokenize(tokenizer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    forkWithEmptyLeaf: function ( test ) {
        var runcount = 0;
        
        var constructor = function () {
            ++runcount
        };
        var tokenizer = new Tokenizer( constructor, new Interval(0,0), {} );
        
        var token = new Tokens.Fork( [new Tokens.Leaf( '' )] );
        token.tokenize(tokenizer);
        
        test.equals( runcount, 1 );
        
        test.done();
    },
    forkWithMoreLeafReplace: function ( test ) {
        var leafs = [new Tokens.Leaf( 'aaa', new Interval(0,3) ), new Tokens.Leaf( 'bbb', new Interval(3,6) ), new Tokens.Leaf( 'ccc', new Interval(6,9) )];
        var runcount = 0;
        
        var placeholder = {
            toString: function () { return this.render(); },
            render: function () { return 'x'; }
        };
        
        var constructor = function ( content, interval ) {
            test.equals( content, 'bbb', "bad content" );
            test.ok( interval.equals( new Interval(3,6) ), "bad interval" );
            ++runcount;
            return placeholder;
        };
        
        var tokenizer = new Tokenizer( constructor, new Interval(3,6), {} );
        
        var token = new Tokens.Fork( leafs );
        var result = token.tokenize(tokenizer);
        
        test.equals( token, result );
        
        test.equals( result.content.length, 3 );
        test.equals( result.content[1], placeholder, "bad new token" );
        
        test.equals( result.toString(), 'aaaxccc' );
        
        test.equals( runcount, 1 );
        
        test.done();
    },
    forkWithMoreLeafSplit: function ( test ) {
        var leafs = [new Tokens.Leaf( 'abc', new Interval(0,3) ), new Tokens.Leaf( 'def', new Interval(3,6) ), new Tokens.Leaf( 'ghi', new Interval(6,9) )];
        var runcount = 0;
        
        var placeholder = {
            toString: function () { return this.render(); },
            render: function () { return 'x'; }
        };
        
        var constructor = function ( content, interval ) {
            test.equals( content, 'e', "bad content" );
            test.ok( interval.equals( new Interval(4,5) ), "bad interval" );
            ++runcount;
            return placeholder;
        };
        
        var tokenizer = new Tokenizer( constructor, new Interval(4,5), {} );
        
        var token = new Tokens.Fork( leafs );
        var result = token.tokenize(tokenizer);
        
        test.equals( token, result );
        
        test.equals( result.content.length, 3 );
        test.equals( result.content[1], leafs[1] );
        test.equals( result.content[1].content.length, 3 );
        test.equals( result.content[1].content[1], placeholder );
        
        test.equals( runcount, 1 );
        test.equals( result.toString(), 'abcdxfghi' );
        
        test.done();
    }
}