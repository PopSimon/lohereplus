"use strict";

var StaticHTMLTagToken = exports.StaticHTMLTagToken;
var Token = exports.Token;
var StaticHTMLTagTokenConstructor = exports.StaticHTMLTagTokenConstructor;

function BBTokenConstructor( HTMLtag, attributes ) {
    return StaticHTMLTagTokenConstructor( ( !!HTMLtag ? HTMLtag : 'span' ), attributes );
}





/**
 * Replaces .
 * @param BBCodes : Object - BBCode tag type descriptors.
 * Properties of a descriptor: 
 *    @property HTMLtag : (optional) string - the type of the HTML DOM element, 
 *    wherewith the BBCode tag will be replaced. Default: span.
 *    @property class : (optional) string - name of the css class which will be
 *    added to the HTML element. Default: none.
 * @param maxNestingDepth : (optional) int - the max depth of
 * evaluating nested BBCode tags. Deeper nestings will be evaluated
 * incorrectly/won't be evaluated at all. Default: 5
 *
 * @return BBCodeEngine
 * 
 * Properties:
 *     @property maxNestingDepth : int - see @param maxNestingDepth
 *     @property tags : Object - map of BBCode tags. Generated automatically
 *     from @param BBCodes.
 *     Properties of a tag object:
 *         @property before : string - a literal wherewith the BBCode opening tag will
 *         be replaced
 *         @property after : string - a literal wherewith the BBCode closing tag will
 *         be replaced
 *     @property regExp : regular expression used during parsing. Generated
 *     automatically from @param BBCodes
 *
 * Methods:
 *     @method process - processes the given string
 *         @param text : string - string to be processed
 *         @return string - processed result
 *     @method replace - returns a string wherewith the matched sequence needs to be replaced.
 *         @param match : string - the matched sequence (eg. '[b]text[/b]')
 *         @param BBCode : string - the matched BBCode tagname (eg. 'b')
 *         @param content : string - the matched textual content (eg. 'text')
 *         @return string - a string with the matched sequence needs to be replaced
 *         (eg. '<strong>text</strong>')
 */
exports.BBCodeEngine = function BBCodeEngine( BBCodes, maxNestingDepth ) {
    this.maxNestingDepth = typeof maxNestingDepth !== 'undefined' 
        && maxNestingDepth !== null ? maxNestingDepth : 5;
        
    this.needsReplacing = true;
    
    // 
    this.tags = {};

    var regExpBase = "";
    
    for ( var tagName in BBCodes ) {
        var tag = BBCodes[ tagName ];
        this.tags[ tagName ] = new BBTokenConstructor( tag.HTMLtag, tag.attributes );
        regExpBase += ( regExpBase !== "" ? "|" : "" ) + tagName;
    }
    
    //
    this.regExp = new RegExp( '\\[(' + regExpBase + ')\\]([\\s\\S]*)\\[\\/\\1\\]', 'gi' );
}

exports.BBCodeEngine.prototype = {
    process: function processBBCodes( token ) {
        token.process( this.regExp, this );
        return token;
    },
    processMatch: function ( match, subMatches ) {
        var BBCode = subMatches[ 0 ];
        var content = subMatches[ 1 ];
        if ( BBCode in this.tags ) {
            var token = new this.tags[ BBCode ]( content );
            // we reset the actual lastIndex of the RegExp
            var lastIndex = this.regExp.lastIndex;
            this.regExp.lastIndex = 0;
            token.process( this.regExp, this );
            // we restore the actual lastIndex of the RegExp
            this.regExp.lastIndex = lastIndex;
            return token;
        } else {
            return null;
        }
    }
}