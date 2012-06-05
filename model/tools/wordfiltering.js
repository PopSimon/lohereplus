/**
 *
 *
 */
function WordCatcher( pattern ) {
    this.regExpBase = pattern;
    this.regExp = new RegExp( pattern, 'gi' );
}
WordCatcher.prototype = Object.create( Object.prototype, {
    replace: {
        value: function ( match ) {
            return match;
        },
        enumerable: true
    }
});

/**
 *
 *
 */
function WordFilter( pattern, replace ) {
    WordCatcher.call( this, pattern );
    this.content = replace;
}
WordFilter.prototype = Object.create( WordCatcher.prototype, {
    replace: {
        value: function ( match ) {
            return this.content;
        },
        enumerable: true
    }
});

/**
 *
 *
 */
function WordMarker( pattern ) {
    WordCatcher.call( this, pattern );
    this.regExp = new RegExp( pattern );
}
WordMarker.prototype = Object.create( WordCatcher.prototype, {
    before: {
        get: function () {
            return "";
        },
        enumerable: true
    },
    after: {
        get: function () {
            return "";
        },
        enumerable: true
    },
    replace: {
        value: function ( match ) {
            return this.before + match + this.after;
        },
        enumerable: true
    }
});

/**
 *
 *
 */
function StyledWordMarker( pattern, style ) {
    WordMarker.call( this, pattern );
    this.openingTag = '<' 
        + ('HTMLtag' in style ? style.HTMLtag : 'span')
        + ('class' in style ? ' class="' + style.class + '"': '')
        + '>';
    this.closingTag = '</' 
        + ('HTMLtag' in style ? style.HTMLtag : 'span') 
        + '>';
}
StyledWordMarker.prototype = Object.create( WordMarker.prototype, {
    before: {
        get: function () {
            return this.openingTag;
        },
        enumerable: true
    },
    after: {
        get: function () {
            return this.closingTag;
        },
        enumerable: true
    },
});

/**
 *
 *
 */
function RandomColorStyledWordMarker( pattern, style ) {
    StyledWordMarker.call( this, pattern, style );
    delete this.openingTag;
    this.openingTagStart = '<'
        + ('HTMLtag' in style ? style.HTMLtag : 'span')
        + ('class' in style ? ' class="' + style.class + '"': '')
        + ' style="';
    this.openingTagEnd = '">';
}
RandomColorStyledWordMarker.prototype = Object.create( StyledWordMarker.prototype, {
    customStyle: {
        get :function () {
            return 'background-color: rgb(' 
                + Math.round( Math.random()*255 )
                + ',' + Math.round( Math.random()*255 )
                + ',' + Math.round( Math.random()*255 )
                + '); color: rgb('
                + Math.round( Math.random()*255 )
                + ',' + Math.round( Math.random()*255 )
                + ',' + Math.round( Math.random()*255 )
                + ');';
        },
        enumerable: true
    },
    before: {
        get: function () {
            return this.openingTagStart + this.customStyle + this.openingTagEnd;
        },
        enumerable: true
    }
});

var WordFilterFactory = {
    create: function ( name, filterDesc ) {
        var pattern = 'pattern' in filterDesc ? filterDesc.pattern : name;
        
        if ( 'replace' in filterDesc ) {
            var replace = filterDesc.replace;
            return new WordFilter( pattern, replace );
        } else if ( 'mark' in filterDesc ) {
            var style = filterDesc.mark;
            
            if ( 'randomColor' in style ) {
                return new RandomColorStyledWordMarker( pattern, style );
            } else {
                return new StyledWordMarker( pattern, style );
            }
        }
    }
}

/**
 *
 *
 */
exports.WordFilterEngine = function WordFilterEngine( wordFilters ) {

    var regExpBase = "";
    this.filters = {};
    this.patternedFilters = {};
    
    for ( var i in wordFilters ) {
    
        var filterDesc = wordFilters[ i ];
        var filter = WordFilterFactory.create( i, filterDesc );
        
        this.filters[ i ] = filter;
        if ( 'pattern' in filterDesc ) {
            this.patternedFilters[ i ] = filter;
        }
        regExpBase += ( regExpBase !== "" ? "|" : "" ) + filter.regExpBase;
    }
    
    this.regExp = new RegExp( regExpBase, 'gi' );
        
    this.replace = (function ( match ) {
        if ( match in this.filters ) {
            return this.filters[ match ].replace( match );
        } else {
            for ( var i in this.patternedFilters ) {
                var filter = this.patternedFilters[ i ];
                if ( match.search( filter.regExp ) >= 0 ) {
                    return filter.replace( match );
                }
            }
            return match;
        }
    }).bind( this );
    
    this.process = function ( text ) {
        return text.replace( this.regExp, this.replace );
    };
}