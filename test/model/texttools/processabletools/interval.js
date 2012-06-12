"use strict";

var Interval = require('../../../../src/model/texttools/processabletools').Tokens.Interval;

/**
 * Testing Interval
 *
 */
exports.interval = {
    equalTrueTest: function ( test ) {
        var a = new Interval( 0, 1 );
        var b = new Interval( 0, 1 );
        test.ok( b.equals(a) );
    
        test.done();
    },
    equalTrueTestZeroLength: function ( test ) {
        var a = new Interval( 0, 0 );
        var b = new Interval( 0, 0 );
        test.ok( b.equals(a) );
    
        test.done();
    },
    equalFalseTest: function ( test ) {
        var a = new Interval( 0, 1 );
        var b = new Interval( 1, 2 );
        test.ok( !b.equals(a) );
        
        test.done();
    },
    isIntersectingTest1: function ( test ) {
        var a = new Interval( 0, 1 );
        var b = new Interval( 2, 3 );
        test.ok( !b.isIntersecting(a) );
        
        test.done();
    },
    isIntersectingTest2: function ( test ) {
        var a = new Interval( 0, 1 );
        var b = new Interval( 1, 3 ); 
        test.ok( !b.isIntersecting(a) );
        
        test.done();
    },
    isIntersectingTest3: function ( test ) {
        var a = new Interval( 0, 2 );
        var b = new Interval( 1, 3 ); 
        test.ok( b.isIntersecting(a) );
        
        test.done();
    },
    isIntersectingTest4: function ( test ) {
        var a = new Interval( 1, 2 );
        var b = new Interval( 1, 3 ); 
        test.ok( b.isIntersecting(a) );
        
        test.done();
    },
    isIntersectingTest5: function ( test ) {
        var a = new Interval( 1, 3 );
        var b = new Interval( 1, 3 ); 
        test.ok( b.isIntersecting(a) );
        
        test.done();
    },
    isIntersectingTest6: function ( test ) {
        var a = new Interval( 1, 4 );
        var b = new Interval( 1, 3 );
        test.ok( b.isIntersecting(a) );
        
        test.done();
    },
    isIntersectingTest7: function ( test ) {
        var a = new Interval( 2, 4 );
        var b = new Interval( 1, 3 ); 
        test.ok( b.isIntersecting(a) );
        
        test.done();
    },
    isIntersectingTest8: function ( test ) {
        var a = new Interval( 3, 4 );
        var b = new Interval( 1, 3 ); 
        test.ok( !b.isIntersecting(a) );
        
        test.done();
    },
    isIntersectingTest9: function ( test ) {
        var a = new Interval( 4, 5 );
        var b = new Interval( 1, 3 );
        test.ok( !b.isIntersecting(a) );
        
        test.done();
    },
    relationTest1: function ( test ) {
        var a = new Interval( 0, 1 );
        var b = new Interval( 2, 3 );
        test.equal( b.relationTo(a), -2 );
        
        test.done();
    },
    relationTest2: function ( test ) {
        var a = new Interval( 0, 1 );
        var b = new Interval( 1, 3 ); 
        test.equal( b.relationTo(a), -2 );
        
        test.done();
    },
    relationTest3: function ( test ) {
        var a = new Interval( 0, 2 );
        var b = new Interval( 1, 3 ); 
        test.equal( b.relationTo(a), -1 );
        
        test.done();
    },
    relationTest4: function ( test ) {
        var a = new Interval( 1, 2 );
        var b = new Interval( 1, 3 ); 
        test.equal( b.relationTo(a), 0 );
        
        test.done();
    },
    relationTest5: function ( test ) {
        var a = new Interval( 1, 3 );
        var b = new Interval( 1, 3 ); 
        test.equal( b.relationTo(a), 4 );
        
        test.done();
    },
    relationTest6: function ( test ) {
        var a = new Interval( 1, 4 );
        var b = new Interval( 1, 3 );
        test.equal( b.relationTo(a), 3 );
        
        test.done();
    },
    relationTest7: function ( test ) {
        var a = new Interval( 2, 4 );
        var b = new Interval( 1, 3 ); 
        test.equal( b.relationTo(a), 1 );
        
        test.done();
    },
    relationTest8: function ( test ) {
        var a = new Interval( 3, 4 );
        var b = new Interval( 1, 3 ); 
        test.equal( b.relationTo(a), 2 );
        
        test.done();
    },
    relationTest9: function ( test ) {
        var a = new Interval( 4, 5 );
        var b = new Interval( 1, 3 );
        test.equal( b.relationTo(a), 2 );
        
        test.done();
    }
};