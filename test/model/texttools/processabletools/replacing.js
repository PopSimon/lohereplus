"use strict";

var ProcessableTools = require('../../../../src/model/texttools/processabletools');
var Tokens = ProcessableTools.Tokens;
var Interval = Tokens.Interval;
var ProcessableText = ProcessableTools.ProcessableText;
var Replacer = ProcessableTools.Processing.Replacer;

exports.replaceLeaf = {
    Empty: function ( test ) {
        var replacer = new Replacer();
        replacer.regExp = /b/g;
        
        var runcount = 0;
        
        replacer.replace = function () {
            ++runcount; 
        }
        
        var token = new Tokens.Empty( );
        token.replace(replacer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    noContentLeaf: function ( test ) {
        var replacer = new Replacer();
        replacer.regExp = /b/g;
        
        var runcount = 0;
        
        replacer.replace = function () {
            ++runcount; 
        }
        
        var token = new Tokens.Leaf( '' );
        token.replace(replacer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    noMatchLeaf: function ( test ) {
        var replacer = new Replacer();
        replacer.regExp = /b/g;
        
        var runcount = 0;
        
        replacer.replace = function () {
            ++runcount; 
        }
        
        var token = new Tokens.Leaf( 'aaa' );
        token.replace(replacer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    singleMatchLeaf: function ( test ) {
        var replacer = new Replacer();
        replacer.regExp = /b/g;
        
        var runcount = 0;
        
        replacer.replace = function ( match ) {
            test.equals( match, 'b' );
            ++runcount;
            return 'c';
        }
        
        var token = new Tokens.Leaf( 'aba' );
        token.replace(replacer);
        
        test.equals( runcount, 1 );
        test.equals( token.toString(), 'aca' );
        
        test.done();
    },
    multipleMatchesLeaf: function ( test ) {
        var replacer = new Replacer();
        replacer.regExp = /b/g;
        
        var runcount = 0;
        
        replacer.replace = function ( match ) {
            test.equals( match, 'b' );
            ++runcount; 
            return 'c';
        }
        
        var token = new Tokens.Leaf( 'bbb' );
        token.replace(replacer);
        
        test.equals( runcount, 3 );
        test.equals( token.toString(), 'ccc' );
        
        test.done();
    }
};

exports.replaceForkToken = {
    empty: function ( test ) {
        var replacer = new Replacer();
        replacer.regExp = /b/g;
        
        var runcount = 0;
        
        replacer.replace = function () {
            ++runcount; 
        }
        
        var token = new Tokens.Fork( );
        token.replace(replacer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    oneEmptyChild: function ( test ) {
        var replacer = new Replacer();
        replacer.regExp = /b/g;
        
        var runcount = 0;
        
        replacer.replace = function () {
            ++runcount; 
        }
        
        var token = new Tokens.Fork( [new Tokens.Leaf( "" )] );
        token.replace(replacer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    oneChildNoMatch: function ( test ) {
        var replacer = new Replacer();
        replacer.regExp = /b/g;
        
        var runcount = 0;
        
        replacer.replace = function () {
            ++runcount; 
        }
        
        var token = new Tokens.Fork( [new Tokens.Leaf( "aaa" )] );
        token.replace(replacer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    oneChildSingleMatch: function ( test ) {
        var replacer = new Replacer();
        replacer.regExp = /b/g;
        
        var runcount = 0;
        
        replacer.replace = function ( match ) {
            test.equals( match, 'b' );
            ++runcount;
            return 'c';
        }
        
        var token = new Tokens.Fork( [new Tokens.Leaf( "aba" )] );
        token.replace(replacer);
        
        test.equals( runcount, 1 );
        test.equals( token.toString(), 'aca' );
        
        test.done();
    },
    multipleChildrenNoMatch: function ( test ) {
        var replacer = new Replacer();
        replacer.regExp = /b/g;
        
        var runcount = 0;
        
        replacer.replace = function ( ) {
            ++runcount; 
        }
        
        var token = new Tokens.Fork( [new Tokens.Leaf( "aaa", new Interval( 0, 3 ) ), new Tokens.Leaf( "aaa", new Interval( 3, 6 ) )] );
        token.replace(replacer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    multipleChildrenSingleMatch: function ( test ) {
        var replacer = new Replacer();
        replacer.regExp = /b/g;
        
        var runcount = 0;
        
        replacer.replace = function ( match ) {
            test.equals( match, 'b' );
            ++runcount;
            return 'c';
        }
        
        var token = new Tokens.Fork( [new Tokens.Leaf( "aaa", new Interval( 0, 3 )  ), new Tokens.Leaf( "aba", new Interval( 3, 6 ) )] );
        token.replace(replacer);
        
        test.equals( runcount, 1, "bad runcount" );
        test.equals( token.toString(), 'aaaaca' );
        
        test.done();
    },
    multipleChildrenMultipleMatches: function ( test ) {
        var replacer = new Replacer();
        replacer.regExp = /b/g;
        
        var runcount = 0;
        
        replacer.replace = function ( match ) {
            test.equals( match, 'b' );
            ++runcount;
            return 'c';
        }
        
        var token = new Tokens.Fork( [new Tokens.Leaf( "bbb", new Interval( 0, 3 )  ), new Tokens.Leaf( "bbb", new Interval( 3, 6 ) )] );
        token.replace(replacer);
        
        test.equals( runcount, 6, "bad runcount" );
        test.equals( token.toString(), 'cccccc' );
        
        test.done();
    },
};

exports.replaceText = {
    replaceEmpty: function ( test ) {
        var ptext = new ProcessableText();
        var replacer = new Replacer();
        replacer.regExp = /b/g;
        
        var runcount = 0;
        
        replacer.replace = function () {
            ++runcount; 
        }
        
        ptext.replace(replacer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    replaceNoMatch: function ( test ) {
        var ptext = new ProcessableText( "aaa" );
        var replacer = new Replacer();
        replacer.regExp = /b/g;
        
        var runcount = 0;
        
        replacer.replace = function () {
            ++runcount; 
        }
        
        ptext.replace(replacer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    replaceSingleMatch: function ( test ) {
        var ptext = new ProcessableText( "aba" );
        var replacer = new Replacer();
        replacer.regExp = /b/g;
        
        var runcount = 0;
        
        replacer.replace = function ( match ) {
            test.equals( match, 'b' );
            ++runcount;
            return 'c';
        }
        
        ptext.replace(replacer);
        
        test.equals( runcount, 1 );
        test.equals( ptext.toString(), 'aca' );
        
        test.done();
    }
}