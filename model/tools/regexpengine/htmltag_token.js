"use strict";

var Token = exports.Token;

function HTMLTagToken( content, HTMLtag, attributes ) {
    Token.call( this, content );
    this.HTMLtag = HTMLtag;
    this.attributes = !!attributes ? attributes : {};
}

HTMLTagToken.prototype = Object.create( Token.prototype, {
    prefix: {
        get: function () {
            var result = '<' + this.HTMLtag;            
            for ( var name in this.attributes ) {
                result += ' ' + name + '="' + this.attributes[name] + '"';
            }
            result += '>';
            return result;
        }
    },
    postfix: {
        get: function () {
            return '</' + this.HTMLtag + '>';
        }
    }
});

function StaticHTMLTagToken( content, HTMLtag, attributes ) {
    HTMLTagToken.call( this, content, HTMLtag, attributes );
    Object.defineProperties( this, {
        prefix: { value: this.prefix },
        postfix: { value: this.postfix }
    });
};
StaticHTMLTagToken.prototype = HTMLTagToken.prototype;

function StaticHTMLTagTokenConstructor( HTMLtag, attributes ) {
    var proto = new StaticHTMLTagToken( "", HTMLtag, attributes );
    
    var constructor = function ( content ) {
        Token.call( this, content );
    }
    constructor.prototype = proto;
    
    return constructor;
}

exports.HTMLTagToken = HTMLTagToken;
exports.StaticHTMLTagToken = StaticHTMLTagToken;
exports.StaticHTMLTagTokenConstructor = StaticHTMLTagTokenConstructor;