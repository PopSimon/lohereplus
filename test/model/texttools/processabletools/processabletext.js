"use strict";

var ProcessableText = require('../../../../src/model/texttools/processabletools').ProcessableText;

exports.processableText = {
    badCreate: function ( test ) {
        test.throws( function () {
            var text = new ProcessableText({});
        });
        
        test.done();
    },
    createEmpty: function ( test ) {
        test.doesNotThrow( function () {
            var text = new ProcessableText();
        });
        
        test.done();
    },
    createOk: function ( test ) {
        test.doesNotThrow( function () {
            var text = new ProcessableText( "aaa" );
        });
        
        test.done();
    },
    emptyLength: function ( test ) {
        var text = new ProcessableText();
        test.equal( text.length, 0 );
        
        test.done();
    },
    notEmptyLength: function ( test ) {
        var text = new ProcessableText( "aaa" );
        test.equal( text.length, 3 );
        
        test.done();
    },    
    emptyRender: function ( test ) {
        var text = new ProcessableText();
        test.equal( '' + text, '' );
        
        test.done();
    },
    notEmptyRender: function ( test ) {
        var text = new ProcessableText( "aaa" );
        test.equal( '' + text, 'aaa' );
        
        test.done();
    },
};