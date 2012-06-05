function SimpleReplacer( map ) {
    this.map = map;
}
SimpleReplacer.prototype = {
    replaceMatch: function ( match ) {
        return this.map[ match ];
    }
}

exports.EscapeEngine = function EscapeEngine( escapeSeqDescs ) {

    var escapeMap = {};
    var deescapeMap = {};
    
    var charEscapeBase = "";
    var escapeBase = "";
    var charDeescapeBase = "";
    var deescapeBase = "";

    for ( var i in escapeSeqDescs ) {
        var e = escapeSeqDescs[ i ];
        var pattern = 'pattern' in e ? e.pattern : i;
        var replace = e.replace;
        
        escapeMap[ i ] = replace;
        
        if ( i.length === 1 ) {
            charEscapeBase += pattern;
        } else {
            escapeBase += ( escapeBase !== "" ? '|' : '' ) + pattern;
        }
        
        if ( 'reversible' in e ) {
            var reversePattern = 'reversePattern' in e ? e.reversePattern : replace;
            deescapeMap[ replace ] = i;
            
            if ( replace.length === 1 ) {
                charDeescapeBase +=  pattern;
            } else {
                deescapeBase += ( deescapeBase !== "" ? '|' : '' ) + reversePattern;
            }
        }
    }
    
    var eBase = ( charEscapeBase !== "" ? '[' + charEscapeBase + ']' : '' ) + ( escapeBase !== "" ? escapeBase : "" );
    this.escapeExp = eBase !== "" ? new RegExp( eBase, 'g' ) : null;
    
    var dBase = ( charDeescapeBase !== "" ? '[' + charDeescapeBase + ']' : '' ) + ( deescapeBase !== "" ? deescapeBase : "" );
    this.deescapeExp = dBase !== "" ? new RegExp( dBase, 'g' ) : null;
    
    
    this.escaper = new SimpleReplacer( escapeMap );
    this.deescaper = new SimpleReplacer( deescapeMap );
}
exports.EscapeEngine.prototype = {
    escape: function ( token ) {
        return !!this.escapeExp ? token.replace( this.escapeExp, this.escaper ) : token;
    },
    deescape: function ( token ) {
        return !!this.deescapeExp ? token.replace( this.deescapeExp, this.deescaper ) : token;
    }
};

exports.HTMLEscapeEngine = function HTMLEscapeEngine( escapeSeqDescs ) {
    var escapeRules = {
        '>': {
            replace: '&gt;'
        },  
        '<': {
            replace: '&lt;'
        },  
        '&': {
            replace: '&amp;'
        }
    };
    
    for ( var i in escapeSeqDescs ) {
        escapeRules[ i ] = escapeSeqDescs[ i ];
    }
    
    exports.EscapeEngine.call( this, escapeRules );
}
exports.HTMLEscapeEngine.prototype = Object.create( exports.EscapeEngine.prototype, {});