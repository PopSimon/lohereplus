"use strict";

var ProcessableTools = require('../../../../src/model/texttools/processabletools');
var Tokens = ProcessableTools.Tokens;
var Interval = Tokens.Interval;
var Processing = ProcessableTools.Processing;
var ProcessableText = ProcessableTools.ProcessableText;
var Processer = Processing.Processer;

exports.processLeaf = {
    Empty: function ( test ) {
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var runcount = 0;
        
        processer.onMatch = function () {
            ++runcount; 
        }
        
        var token = new Tokens.Empty( );
        token.process(processer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    noContentLeaf: function ( test ) {
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var runcount = 0;
        
        processer.onMatch = function () {
            ++runcount; 
        }
        
        var token = new Tokens.Leaf( '' );
        token.process(processer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    noMatchLeaf: function ( test ) {
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var runcount = 0;
        
        processer.onMatch = function () {
            ++runcount; 
        }
        
        var token = new Tokens.Leaf( 'aaa' );
        token.process(processer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    singleMatchLeaf: function ( test ) {
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var runcount = 0;
        
        processer.onMatch = function ( index, match, submatcharray ) {
            test.equals( index, 1 );
            test.equals( match, 'b' );
            test.equals( submatcharray.length, 0 );
            ++runcount; 
        }
        
        var token = new Tokens.Leaf( 'aba' );
        token.process(processer);
        
        test.equals( runcount, 1 );
        
        test.done();
    },
    multipleMatchesLeaf: function ( test ) {
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var runcount = 0;
        
        processer.matchIndexes = [0,1,2];
        processer.onMatch = function ( index, match, submatcharray ) {
            test.equals( index, this.matchIndexes[ runcount ] );
            test.equals( match, 'b' );
            test.equals( submatcharray.length, 0 );
            ++runcount; 
        }
        
        var token = new Tokens.Leaf( 'bbb' );
        token.process(processer);
        
        test.equals( runcount, 3 );
        
        test.done();
    },
    subMatchLeaf: function ( test ) {
        var processer = new Processer();
        processer.regExp = /b([\s\S])/g;
        
        var runcount = 0;
        
        processer.onMatch = function ( index, match, submatcharray ) {
            test.equals( index, 1 );
            test.equals( match, 'ba' );
            test.equals( submatcharray.length, 1 );
            test.equals( submatcharray[ 0 ], 'a' );
            ++runcount; 
        }
        
        var token = new Tokens.Leaf( 'aba' );
        token.process(processer);
        
        test.equals( runcount, 1 );
        
        test.done();
    }
};

exports.processForkToken = {
    empty: function ( test ) {
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var runcount = 0;
        
        processer.onMatch = function () {
            ++runcount; 
        }
        
        var token = new Tokens.Fork( );
        token.process(processer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    oneEmptyChild: function ( test ) {
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var runcount = 0;
        
        processer.onMatch = function () {
            ++runcount; 
        }
        
        var token = new Tokens.Fork( [new Tokens.Leaf( "" )] );
        token.process(processer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    oneChildNoMatch: function ( test ) {
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var runcount = 0;
        
        processer.onMatch = function () {
            ++runcount; 
        }
        
        var token = new Tokens.Fork( [new Tokens.Leaf( "aaa" )] );
        token.process(processer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    oneChildSingleMatch: function ( test ) {
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var runcount = 0;
        
        processer.onMatch = function ( index, match, submatcharray ) {
            test.equals( index, 1 );
            test.equals( match, 'b' );
            test.equals( submatcharray.length, 0 );
            ++runcount; 
        }
        
        var token = new Tokens.Fork( [new Tokens.Leaf( "aba" )] );
        token.process(processer);
        
        test.equals( runcount, 1 );
        
        test.done();
    },
    multipleChildrenNoMatch: function ( test ) {
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var runcount = 0;
        
        processer.onMatch = function ( ) {
            ++runcount; 
        }
        
        var token = new Tokens.Fork( [new Tokens.Leaf( "aaa", new Interval( 0, 3 ) ), new Tokens.Leaf( "aaa", new Interval( 3, 6 ) )] );
        token.process(processer);
        
        test.equals( runcount, 0 );
        
        test.done();
    },
    multipleChildrenSingleMatch: function ( test ) {
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var runcount = 0;
        
        processer.onMatch = function ( index, match, submatcharray ) {
            test.equals( index, 4, "bad index" );
            test.equals( match, 'b', "bad match" );
            test.equals( submatcharray.length, 0, "submatches found" );
            ++runcount; 
        }
        
        var token = new Tokens.Fork( [new Tokens.Leaf( "aaa", new Interval( 0, 3 )  ), new Tokens.Leaf( "aba", new Interval( 3, 6 ) )] );
        token.process(processer);
        
        test.equals( runcount, 1, "bad runcount" );
        
        test.done();
    },
    multipleChildrenMultipleMatches: function ( test ) {
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var runcount = 0;
        
        processer.matchIndexes = [0,1,2,3,4,5];
        processer.onMatch = function ( index, match, submatcharray ) {
            test.equals( index, this.matchIndexes[ runcount ] );
            test.equals( match, 'b', "bad match" );
            test.equals( submatcharray.length, 0, "submatches found" );
            ++runcount; 
        }
        
        var token = new Tokens.Fork( [new Tokens.Leaf( "bbb", new Interval( 0, 3 )  ), new Tokens.Leaf( "bbb", new Interval( 3, 6 ) )] );
        token.process(processer);
        
        test.equals( runcount, 6, "bad runcount" );
        
        test.done();
    },
};

exports.processText = {
    processEmpty: function ( test ) {
        var ptext = new ProcessableText();
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var runcount = 0;
        
        processer.onMatch = function () {
            ++runcount; 
        }
        
        ptext.process(processer);
        
        test.equals( runcount, 0 );
        test.equals( processer.root, ptext.root );
        
        test.done();
    },
    processNoMatch: function ( test ) {
        var ptext = new ProcessableText( "aaa" );
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var runcount = 0;
        
        processer.onMatch = function () {
            ++runcount; 
        }
        
        ptext.process(processer);
        
        test.equals( runcount, 0 );
        test.equals( processer.root, ptext.root );
        
        test.done();
    },
    processSingleMatch: function ( test ) {
        var ptext = new ProcessableText( "aba" );
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var runcount = 0;
        
        processer.onMatch = function ( index, match, submatcharray ) {
            test.equals( index, 1 );
            test.equals( match, 'b' );
            test.equals( submatcharray.length, 0 );
            ++runcount; 
        }
        
        ptext.process(processer);
        
        test.equals( runcount, 1 );
        test.equals( processer.root, ptext.root );
        
        test.done();
    },
    testCallbackOrder: function ( test ) {
        var ptext = new ProcessableText( "aba" );
        var processer = new Processer();
        processer.regExp = /b/g;
        
        var state = 0;
        
        processer.onStart = function () {
            test.equals( state, 0 );
            state = 1;
        }
        
        processer.onMatch = function () {
            test.equals( state, 1 );
            state = 2;
        }
        
        processer.onEnd = function () {
            test.equals( state, 2 );
            state = 3;
        }
        
        
        
        ptext.process(processer);
        test.equals( state, 3 );
        
        test.done();
    },
}