"use strict";

var Tokens = require('../../../../src/model/texttools/processabletools').Tokens;
var Interval = Tokens.Interval;

exports.leafToken = {
    badCreate: function ( test ) {
        test.throws( function () {
            var token = new Tokens.Leaf();
        });
        test.throws( function () {
            var token = new Tokens.Leaf({});
        });
        
        test.done();
    },
    defaultInterval: function ( test ) {
        var token = new Tokens.Leaf( 'aaa' );
        test.ok( token.interval.equals( new Interval( 0, 3 ) ) );
        
        test.done();
    },
    length: function ( test ) {
        var token = new Tokens.Leaf( 'aaa' );
        test.equal( token.length, 3 );
        
        test.done();
    },
    render: function ( test ) {
        var token = new Tokens.Leaf( 'aaa' );
        test.equal( '' + token, 'aaa' );
        
        test.done();
    }
};

exports.emptyToken = {
    defaultInterval: function ( test ) {
        var token = new Tokens.Empty( );
        test.ok( token.interval.equals( new Interval( 0, 0 ) ) );
        
        test.done();
    },
    length: function ( test ) {
        var token = new Tokens.Empty( 'aaa' );
        test.equal( token.length, 0 );
        
        test.done();
    },
    render: function ( test ) {
        var token = new Tokens.Empty( 'aaa' );
        test.equal( '' + token, '' );
        
        test.done();
    }
};

exports.forkToken = {
    createEmpty: function ( test ) {
        test.doesNotThrow( function () {
            var token = new Tokens.Fork();
        });
        
        test.done();
    },
    createNotempty: function ( test ) {
        test.doesNotThrow( function () {
            var token = new Tokens.Fork( new Tokens.Leaf( '' ) );
        });
        
        test.done();
    },
    defaultEmptyInterval: function ( test ) {
        var token = new Tokens.Fork(  );
        test.ok( token.interval.equals( new Interval( 0, 0 ) ) );
        
        test.done();
    },
    emptyLength: function ( test ) {
        var token = new Tokens.Fork( );
        test.equal( token.length, 0 );
        
        test.done();
    },
    oneChildLength: function ( test ) {
        var token = new Tokens.Fork( [new Tokens.Leaf( 'aaa' )] );
        test.equal( token.length, 3 );
        
        test.done();
    },
    moreChildLength: function ( test ) {
        var token = new Tokens.Fork( [ new Tokens.Leaf( 'aaa' ), new Tokens.Leaf( 'aaa' ) ] );
        test.equal( token.length, 6 );
        
        test.done();
    },
    emptyRender: function ( test ) {
        var token = new Tokens.Fork( );
        test.equal( '' + token, '' );
        
        test.done();
    },
    oneChildRender: function ( test ) {
        var token = new Tokens.Fork( [new Tokens.Leaf( 'aaa' )] );
        test.equal( '' + token, 'aaa' );
        
        test.done();
    },
    moreChildRender: function ( test ) {
        var token = new Tokens.Fork( [ new Tokens.Leaf( 'aaa' ), new Tokens.Leaf( 'aaa' ) ] );
        test.equal( '' + token, 'aaaaaa' );
        
        test.done();
    },
};