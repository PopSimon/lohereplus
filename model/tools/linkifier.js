var HTMLTagToken = exports.HTMLTagToken;
var Token = exports.Token;

function BannedUrlError( url ) {
    this.url = url;
}

function LinkToken( url, attributes ) {
    var attr = {
        href: encodeURI( url )
    };
    for ( var i in attributes ) {
        attr[ i ] = attributes[ i ];
    }
    HTMLTagToken.call( this, url, 'a', attr );
}
LinkToken.prototype = HTMLTagToken.prototype;

/**
 *
 *
 */
exports.LinkifierEngine = function LinkifierEngine( validDomains, bannedDomains, dontAnonymize ) {
    this.linkAttributes = {};
    if ( !dontAnonymize ) {
        this.linkAttributes.rel = "noreferrer";
    }
    
    if ( bannedDomains && bannedDomains.length > 0 ) {
        var bannedDomainsExpBase = "";
        for ( var i in bannedDomains ) {
            bannedDomainsExpBase += ( bannedDomainsExpBase !== "" ? "|" : "" ) + bannedDomains[ i ];
        }
        this.bannedDomainsExp = new RegExp( bannedDomainsExpBase );
    }
    
    var validDomainsExpBase = "";
    for ( var i in validDomains ) {
        validDomainsExpBase += ( validDomainsExpBase !== "" ? "|" : "" ) + validDomains[ i ];
    }
    if ( validDomainsExpBase !== "" ) {
        var validDomainsExpBase = '|(?:' + validDomainsExpBase + ')';
    }
    var regExpPrefixBase = "\\b(?:(?:(?:ht|f)tps?\\:\\/\\/)|(?:www.)";
    var regExpPostfixBase = "[-\\(\\)_\\.\\!~\*'\";\\/\\?\\:@%&\\=\\+\\$,A-Za-z0-9]*";
    this.regExp = new RegExp( regExpPrefixBase + validDomainsExpBase + ')' + regExpPostfixBase, 'g' );
}
exports.LinkifierEngine.prototype = {
    process: function ( token ) {
        return token.process( this.regExp, this );
    },
    processMatch: function ( match ) {
        if ( !!this.bannedDomainsExp && this.bannedDomainsExp.test( match ) ) {
            throw new BannedUrlError( match );
        } else {
            return new LinkToken( match );
        }
    }
}