function Token( string ) {
    this.content = string;
}
Token.prototype = {
    prefix: "",
    postfix: "",
    /**
     * Concats the child tokens / string content to a string, and adds the predefined prefix / postfix to it.
     * @return string
     */
    render: function () {
        var result = this.prefix;
        if ( typeof this.content === 'string' ) {
            result += this.content; 
        } else {
            // content is an array of child tokens
            for ( var i in this.content ) {
                var token = this.content[ i ];
                result += token.render();
            }
        }
        return result + this.postfix;
    },
    /**
     * Runs processMatch for every match of the content(s)
     * @param regExp : RegExp - regular expression the match is based on. Must be global!!!
     * @param processer
     *     @method processMatch : function - a function which is run on matches.
     *         @param match : string - the matched sequence
     *         @param subMatched : array of strings - the parenthesized substring matches, if any
     *         @return : Token - a new Token created from the match.
     */
    processIfString: function ( regExp, processer ) {
        // If content is a string, we tokenize it with processMatch
        
        var matchArray;
        var tokenizedToIndex = 0;
        var createdTokens = [];
        
        while ( ( matchArray = regExp.exec( this.content ) ) != null ) {
        
            var newToken = processer.processMatch( matchArray[ 0 ], matchArray.slice( 1 ) );
            
            // If there was a returned token, we add it to the createdTokens array
            // else we don't do anything
            if ( newToken !== null ) {
                // If there is an untokenized string sequence between the match and the last token,
                // we tokenize it as a simple string token
                if ( tokenizedToIndex !== matchArray.index ) {
                    createdTokens.push( new Token( this.content.substring( tokenizedToIndex, matchArray.index ) ) );
                }
                // We add the new token to the array.
                createdTokens.push( newToken );
                // the content is tokenized to its actual position
                tokenizedToIndex = regExp.lastIndex;
            }
            
        }
        
        // If there were matches and processMatch returned new tokens.
        if ( createdTokens.length !== 0 ) {
            // There is still an untokenized part of the content
            if ( tokenizedToIndex !== this.content.length - 1 ) {
                createdTokens.push( new Token( this.content.substring( tokenizedToIndex ) ) );
            }
            this.content = createdTokens;
        }
    },
    process: function ( regExp, processer ) {
        if ( typeof this.content === 'string' ) {
            this.processIfString( regExp, processer );
        } else {
            // We delegate the process call to the child tokens
            for ( var i in this.content ) {
                this.content.process( regExp, processer );
            }
        }
        return this;
    },
    processOnStart: function ( regExp, processer ) {
        if ( typeof this.content === 'string' ) {
            this.processIfString( regExp, processer );
        } else {
            this.content[ 0 ].processOnStart( regExp, processer );
        }
        return this;
    },
    processOnEnd: function ( regExp, processer ) {
        if ( typeof this.content === 'string' ) {
            this.processIfString( regExp, processer );
        } else {
            this.content[ this.content.length-1 ].processOnEnd( regExp, processer );
        }
        return this;
    },
    /**
     * Replaces the matched sequences based on replaceMatch.
     * @param regExp : RegExp - regular expression the match is based on. Must be global!!!
     * @param replacer
     *     @method replaceMatch : function - a function which is run on matches. The matched sequence
     *     will be replaced by it's return value. For it's parameters see string.replace in the javascript
     *     documentation.
     */
    replaceIfString: function ( regExp, replacer ) {
        this.content = this.content.replace( regExp, replacer.replaceMatch.bind( replacer ) );
    },
    replace: function ( regExp, replacer ) {
        if ( typeof this.content === 'string' ) {
            this.replaceIfString( regExp, replacer );
        } else {
            // We delegate the replace call to the child tokens
            for ( var i in this.content ) {
                var token = this.content[ i ];
                token.replace( regExp, replacer );
            }
        }
        return this;
    },
    replaceOnStart: function ( regExp, replacer ) {
        if ( typeof this.content === 'string' ) {
            this.replaceIfString( regExp, replacer );
        } else {
            this.content[ 0 ].replaceOnStart( regExp, replacer );
        }
        return this;
    },
    replaceOnEnd: function ( regExp, replacer ) {
        if ( typeof this.content === 'string' ) {
            this.replaceIfString( regExp, replacer );
        } else {
            this.content[ this.content.length-1 ].replaceOnEnd( regExp, replacer );
        }
        return this;
    },
    /**
     * Returns the first match (even if the regular expression is global) in the Token.
     * @param regExp : RegExp - regular expression the match is based on.
     * @return : string - the matched sequence.
     */
    match: function ( regExp ) {
        if ( typeof this.content === 'string' ) {
            this.content.replace( regExp, replaceMatch );
        } else {
            // We delegate the replace call to the child tokens
            for ( var i in this.content ) {
                var token = this.content[ i ];
                token.replace( regExp, replaceMatch );
            }
        }
    }
}

exports.Token = Token;

function EmptyToken( string ) {
   Token.call( this, string );
}
EmptyToken.prototype = {
    render: function () {
        return this.content;
    },
    replace: function () {},
    process: function () {},
    match: function () {}
}

exports.EmptyToken = Token;