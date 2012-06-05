var EmptyToken = exports.EmptyToken;

var LineBreakToken = new EmptyToken( '<br />\n' );

exports.LineBreakEngine = {
    regExp: /\n\r?/g,
    startingWhitespaceRemover: {
        regExp: /^(?:\n\r?)+/,
        replaceMatch: function () {
            return "";
        }
    },
    trailingWhitespaceRemover: {
        regExp: /(?:\n\r?)+$/,
        replaceMatch: function () {
            return "";
        }
    },
    process: function ( token ) {
        return token.replaceOnStart( this.startingWhitespaceRemover.regExp, this.startingWhitespaceRemover )
            .replaceOnEnd( this.trailingWhitespaceRemover.regExp, this.trailingWhitespaceRemover )
            .process( this.regExp, this );
    },
    processMatch: function () {
        return LineBreakToken;
    }
}