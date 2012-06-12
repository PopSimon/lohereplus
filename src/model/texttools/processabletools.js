"use strict";

/** 
 * @module model/texttools/processabletools
 * @projectDescription Text processing base library
 * @author Pop Simon popsimon@lajt.hu
 * @version 0.5
 */


/////////////////////////////////////////////////////////////////////////////
/**
 * Namespace for token types
 * @namespace
 */
exports.Tokens = {};
/////////////////////////////////////////////////////////////////////////////

/**
 * Create a new instance of Interval.
 * @param {number} start   The starting endpoint of the interval
 * @param {number} end     The ending endpoint of the interval
 * @class Represents an open interval.<br />
 * <em>Since the interval's open, it's endpoints are excluded from it!
 * Therefore interval ( 0, 1 ) and ( 1, 2 ) doesn't intersect!</em>
 */
exports.Tokens.Interval = function Interval( start, end ) {
    /**
     * The starting endpoint of the interval
     * @type number
     */
    this.start = start;
    /**
     * The ending endpoint of the interval
     * @type number
     */
    this.end = end;
}
exports.Tokens.Interval.prototype = {
    constructor: exports.Tokens.Interval,
    /**
     * Checks the equality of the owner and the given interval.
     * @param {number} interval   The interval that needs to be compared to the owner.
     * @return {boolean}          True if the two intervals endpoints are the same.
     */
    equals: function ( interval ) {
        return this.start === interval.start && this.end === interval.end;
    },
    /**
     * Deep copy of the owner.
     * @return {module:model/texttools/processabletools.Tokens.Interval}   The copy of the owner instance.
     */
    clone: function () {
        return new exports.Tokens.Interval( this.start, this.end );
    },
    /**
     * Checks the intersection of the owner and the given interval.
     * @param {number} interval   The interval that needs to be compared to the owner.
     * @return {boolean}          True if the two intervals intersection isn't empty.
     */
    isIntersecting: function ( interval ) {
        return this.start < interval.end && this.end > interval.start;
    },
    /**
     * Gives a numerical representation of the relation of the two interval objects.
     * @param {number} interval   The interval that needs to be compared to the owner.
     * @return {number}           A numerical representation of the relation.
     * <ul><li> -2: the given interval is before the owner </li>
     *     <li> -1: the given interval intersects the starting endpoint of the owner </li>
     *     <li>  0: the given interval is inside the owner </li>
     *     <li>  1: the given interval intersects ending endpoint of the owner </li>
     *     <li>  2: the given interval is after the owner </li>
     *     <li>  3: the owner is inside of the given interval </li>
     *     <li>  4: the two intervals are the same </li></ul>
     */
    relationTo: function ( interval ) {
        // 3
        if ( interval.start <= this.start && this.end <= interval.end ) {
            return this.equals( interval ) ? 4 : 3;
        } else if ( interval.start < this.start ) { // -1 or -2
            return this.start < interval.end ? -1 : -2;
        } else if ( this.end < interval.end ) { // 1 or 2
            return interval.start < this.end ? 1 : 2;
        } else {
            return 0;
        }
    }
}


/**
 * Create a new instance of Token.
 * @param {array} content     Array of tokens which represents the content of the token that needs to be created
 * @param {module:model/texttools/processabletools.Tokens.Interval} interval The interval-descriptor of the token's position in the original sequence
 * @class Represents the base class of tokens. <strong>Abstract class, it's methods must be implemented!</strong>
 */
exports.Tokens.Token = function Token( content, interval ) {
    /**
     * The content of the token.
     * @private
     * @type array
     */
    this.content = content;
    /**
     * The interval-descriptor of the token's position in the original sequence
     * @type module:model/texttools/processabletools.Tokens.Interval
     * @default Interval( 0, content.length )
     */
    this.interval = !!interval ? interval : new exports.Tokens.Interval( 0, this.length );
}
exports.Tokens.Token.prototype = Object.create( Object.prototype, 
/** @lends module:model/texttools/processabletools.Tokens.Token.prototype */
{
    /**
     * The constructor of the type, needed for proper JavaScript core functionality (e.g. instanceof)
     * @private
     * @type {function}
     */
    constructor: { value: exports.Tokens.Token },    
    /**
     * Accessor to the length of the owner token's content.
     * @type number
     */
    length: { 
        get: function () { throw new Error( "Not implemented!" ); },
        enumerable: true
    },    
    /**
     * Renders out the content of the token.
     * @function
     * @return {string}
     */
    render: {
        value: function () { throw new Error( "Not implemented!" ); },
        enumerable: true
    },
    /**
     * The string conversion method of the type, needed for proper JavaScript core functionality.
     * @type {function}
     * @private
     */
    toString: {
        value: function () { return this.render(); }
    },    
    /**
     * Tokenize (transform / split) the the token with the given tokenizer object.<br />
     * Implements the visitor pattern.
     * <dl>
     *    <dt> {@link module:model/texttools/processabletools.Processing.Tokenizer} </dt><dd> Visitor </dd>
     *    <dt> {@link module:model/texttools/processabletools.Tokens.Token} </dt><dd> Visitable </dd>
     *    <dt> {@link module:model/texttools/processabletools.Tokens.Token#tokenize} </dt><dd> accept </dd>
     *    <dt> {@link module:model/texttools/processabletools.Processing.Tokenizer#tokenizeNode} or {@link module:model/texttools/processabletools.Processing.Tokenizer#tokenizeLeaf} </dt><dd> visit </dd>
     * </dl>
     * See {@link module:model/texttools/processabletools/Processing.Tokenizer}
     * @function
     * @param {module:model/texttools/processabletools/Processing.Tokenizer} tokenizer
     * @return {module:model/texttools/processabletools.Tokens.Token}    the transformed token
     */
    tokenize: {
        value: function ( tokenizer ) { throw new Error( "Not implemented!" ); },
        enumerable: true
    },
    /**
     * Process the the token with the given processer object. Runs a search on the token's
     * content based on the given processer's regExp and if a match is found, calls the 
     * {@link module:model/texttools/processabletools.Processing.Processer#onMatch} method back with the results.<br /><br />
     * <em>It could find matches only inside of the leaf tokens interval, cross-border matches remains unnoticed!</em><br /><br />
     * Implements the Callback pattern. Roles:
     * <dl>
     *    <dt> {@link module:model/texttools/processabletools.Tokens.Token#process} </dt><dd> Caller </dd>
     *    <dt> {@link module:model/texttools/processabletools.Processing.Processer} </dt><dd> Callback object </dd>
     *    <dt> {@link module:model/texttools/processabletools.Processing.Processer#onMatch} </dt><dd> Callback function </dd>
     * </dl>
     * See {@link module:model/texttools/processabletools.Processing.Processer}
     * @function
     * @param {module:model/texttools/processabletools.Processing.Processer} processer
     */
    process: {
        value: function ( processer ) { throw new Error( "Not implemented!" ); },
        enumerable: true
    },
    /**
     * Replace substings in the token's content with the return value of the given replacer object's replace method. Runs a search on the token's
     * content based on the given replacer's regExp and if a match is found, calls the 
     * {@link module:model/texttools/processabletools.Processing.Replacer#replace} method back with the results.
     * It uses the string.replace method<br /><br />
     * <em>It could find matches only inside of the leaf tokens interval, cross-border matches remains unnoticed!</em><br /><br />
     * Implements the Callback pattern. Roles:
     * <dl>
     *    <dt> {@link module:model/texttools/processabletools.Tokens.Token#replace} </dt><dd> Caller </dd>
     *    <dt> {@link module:model/texttools/processabletools.Processing.Replacer} </dt><dd> Callback object </dd>
     *    <dt> {@link module:model/texttools/processabletools.Processing.Replacer#replace} </dt><dd> Callback function </dd>
     * </dl>
     * See {@link module:model/texttools/processabletools.Processing.Replacer}
     * @function
     * @param {module:model/texttools/processabletools.Processing.Replacer} replacer
     */
    replace: {
        value: function ( replacer ) { throw new Error( "Not implemented!" ); },
        enumerable: true
    }
});


/**
 * Create a new instance of Token.
 * @param {array} content     Array of tokens which represents the content of the token that needs to be created
 * @param {module:model/texttools/processabletools.Tokens.Interval} interval The interval-descriptor of the token's position in the original sequence
 * @class Represents a node in the token-tree, a container of other container ({@link module:model/texttools/processabletools.Tokens.Fork})/textual ({@link module:model/texttools/processabletools.Tokens.Token}) tokens. A composite object.
 * @extends module:model/texttools/processabletools.Tokens.Token
 */
exports.Tokens.Fork = function ForkToken( content, interval ) {
    exports.Tokens.Token.call( this, 
        ( typeof content !== 'undefined' && content !== null ? content : [] ),
        interval
    );
}
exports.Tokens.Fork.prototype = Object.create( exports.Tokens.Token.prototype, 
/** 
 * @lends module:model/texttools/processabletools.Tokens.Fork.prototype 
 * @extends module:model/texttools/processabletools.Tokens.Token.prototype 
 */
{
    /**
     * The constructor of the type, needed for proper JavaScript core functionality (e.g. instanceof)
     * @private
     * @type {function}
     */
    constructor: { value: exports.Tokens.Fork },
    /* See {@link module:model/texttools/processabletools.Tokens.Token#length} */
    length: { 
        get: function () {
            var result = 0;
            for ( var i = 0; i < this.content.length; ++i ) {
                result += this.content[ i ].length;
            }
            return result;
        },
        enumerable: true
    },
    /* See {@link module:model/texttools/processabletools.Tokens.Token#render} */
    render: {
        value: function () {
            var result = "";
            for ( var i = 0; i < this.content.length; ++i ) {
                result += this.content[ i ].render();
            }
            return result;
        },
        enumerable: true
    },
    /* See {@link module:model/texttools/processabletools.Tokens.Token#tokenize} */
    tokenize: {
        value: function ( tokenizer ) {
            return tokenizer.tokenizeNode( this );
        },
        enumerable: true
    },
    /* See {@link module:model/texttools/processabletools.Tokens.Token#tokenize} */
    process: {
        value: function ( processer ) {
            // we delegate the visit
            for ( var i = 0; i < this.content.length; ++i ) {
                this.content[ i ].process( processer );
            }
        },
        enumerable: true
    },
    /* See {@link module:model/texttools/processabletools.Tokens.Token#replace} */
    replace: {
        value: function ( replacer ) {
            // we delegate the visit
            for ( var i = 0; i < this.content.length; ++i ) {
                this.content[ i ].replace( replacer );
            }
        },
        enumerable: true
    }
});


/**
 * Create a new instance of Leaf.
 * @param {string} content    The content of the token.
 * @param {module:model/texttools/processabletools.Tokens.Interval} interval   The interval-descriptor of the token's position in the original sequence
 * @class Represents a textual token, a leaf in the token-tree. See {@link Token}.
 * @extends module:model/texttools/processabletools.Tokens.Token
 */
exports.Tokens.Leaf = function LeafToken( content, interval ) {
    if ( typeof content !== 'string' ) {
        throw new Error( "LeafToken's content needs to be string" );
    }
    exports.Tokens.Token.call( this, content, interval );
}
exports.Tokens.Leaf.prototype = Object.create( exports.Tokens.Token.prototype, 
/** 
 * @lends module:model/texttools/processabletools.Tokens.Leaf.prototype
 * @extends module:model/texttools/processabletools.Tokens.Token.prototype
 */
{
    /**
     * The constructor of the type, needed for proper JavaScript core functionality (e.g. instanceof)
     * @type {function}
     * @private
     */
    constructor: { value: exports.Tokens.Leaf },
    /* See {@link module:model/texttools/processabletools.Tokens.Token#length} */
    length: {
        get: function () {
            return this.content.length;
        },
        enumerable: true
    },
    /**
     * Returns a substring of the token's textual content.
     * @function
     * @param {number} start   the starting position of the desired substring
     *                         <em>in the domain of the owner tokens interval</em>
     * @param {number} end     the ending position of the desired substring
     *                         <em>in the domain of the owner tokens interval</em>
     * @return {string}
     */
    substring: {
        value: function ( start, end ) {
            return this.content.substring( start - this.interval.start, end - this.interval.start );
        }
    },
    /* See {@link module:model/texttools/processabletools.Tokens.Token#render} */
    render: {
        value: function () {
            return this.content;
        },
        enumerable: true
    },
    /* See {@link module:model/texttools/processabletools.Tokens.Token#tokenize} */
    tokenize: {
        value: function ( tokenizer ) {
            return tokenizer.tokenizeLeaf( this );
        },
        enumerable: true
    },
    /* See {@link module:model/texttools/processabletools.Tokens.Token#process} */
    process: {
        value: function ( processer ) {
            // we tokenize it with onMatch
            var baseString = this.content;
            var matchArray;
            while ( ( matchArray = processer.regExp.exec( baseString ) ) != null ) {
                processer.onMatch( this.interval.start + matchArray.index, matchArray[ 0 ], matchArray.slice( 1 ) );
            }
        }
    },
    /* See {@link module:model/texttools/processabletools.Tokens.Token#replace} */
    replace: {
        value: function ( replacer ) {
            this.content = this.content.replace( replacer.regExp, function ( match ) { return replacer.replace( match ); } );
        }
    }
});


/**
 * Create a new instance of Empty.
 * @param {string} content    The (hidden) content of the token.
 * @param {module:model/texttools/processabletools.Tokens.Interval} interval The interval-descriptor of the token's position in the original sequence
 * @class Represents a token withouth content, an empty leaf in the token-tree.<br />
 * <em>The "emptiness" doesn't necessarily mean that it's render method will return an empty string.</em>
 * @extends module:model/texttools/processabletools.Tokens.Leaf
 */
exports.Tokens.Empty = function EmptyToken( interval ) {
   exports.Tokens.Leaf.call( this, '', interval );
}
exports.Tokens.Empty.prototype = Object.create( exports.Tokens.Leaf.prototype, 
/** 
 * @lends module:model/texttools/processabletools.Tokens.Empty.prototype
 * @extends module:model/texttools/processabletools.Tokens.Leaf.prototype
 */
{
    /**
     * The constructor of the type, needed for proper JavaScript core functionality (e.g. instanceof)
     * @type {function}
     * @private
     */
    constructor: { value: exports.Tokens.Empty },
    /* See {@link module:model/texttools/processabletools.Tokens.Leaf#tokenize} */
    // Since the token has nothing to tokenize, it's an empty function
    tokenize: { value: function ( tokenizer ) { return this; } },
    /* See {@link module:model/texttools/processabletools.Tokens.Leaf#process} */
    // Since the token has nothing to render, it's an empty function
    process: { value: function () {} },
    /* See {@link module:model/texttools/processabletools.Tokens.Leaf#replace} */
    // Since the token has nothing to replace, it's an empty function
    replace: { value: function () {} },
    /* See {@link module:model/texttools/processabletools.Tokens.Leaf#content} */
    // Since the token has no public content, the method returns an empty string
    length: {
        get: function () { return 0; },
        enumerable: true
    },
    /* See {@link module:model/texttools/processabletools.Tokens.Leaf#content} */
    // Since the token has no public content, the method returns an empty string
    render: {
        value: function () { return ""; },
        enumerable: true
    },
});


/////////////////////////////////////////////////////////////////////////////
/**
 * Namespace for processing texttokens
 * @namespace
 */
exports.Processing = {};
/////////////////////////////////////////////////////////////////////////////

/**
 * Create a new instance of Tokenizer.
 * @param {function} constructor   Constructor function of the new Token object the tokenizer will create.
 * @param {Interval} interval      The interval-descriptor of the new {@link module:model/texttools/processabletools.Processing.Tokenizer#tokenConstructor} token that needs to be created.
 * @param {object} extraArg        Extra arguments that will be given to {@link module:model/texttools/processabletools.Processing.Tokenizer#tokenConstructor} during the creation, wrapped in an object.
 * @class Represents a tokenizer object, responsible for transforming a token-tree.
 * Its methods are called by the tokens itselves, see {@link module:model/texttools/processabletools.Tokens.Token#tokenize}.<br /><br />
 * Implements the visitor pattern. Roles:
 * <dl>
 *    <dt> {@link module:model/texttools/processabletools.Processing.Tokenizer} </dt><dd> Visitor </dd>
 *    <dt> {@link module:model/texttools/processabletools.Tokens.Token} </dt><dd> Visitable </dd>
 *    <dt> {@link module:model/texttools/processabletools.Tokens.Token#tokenize} </dt><dd> accept </dd>
 *    <dt> {@link module:model/texttools/processabletools.Processing.Tokenizer#tokenizeNode} or {@link module:model/texttools/processabletools.Processing.Tokenizer#tokenizeLeaf} </dt><dd> visit </dd>
 * </dl>
 */
exports.Processing.Tokenizer = function Tokenizer( constructor, interval, extraArg ) {
    /**
     * Constructor function of the new Token object the tokenizer will create.
     * @type function
     */
    this.tokenConstructor = constructor;
    /**
     * The interval-descriptor of the new {@link module:model/texttools/processabletools.Processing.Tokenizer#tokenConstructor} token that needs to be created.
     * @type module:model/texttools/processabletools.Tokens.Interval
     */
    this.interval = interval;
    /**
     * Extra arguments that will be given to {@link module:model/texttools/processabletools.Processing.Tokenizer#tokenConstructor} during the creation, wrapped in an object.
     * @type object
     */
    this.extraArg = extraArg;
}
exports.Processing.Tokenizer.prototype = {
    /**
     * The constructor of the type, needed for proper JavaScript core functionality (e.g. instanceof)
     * @type {function}
     * @private
     */
    constructor: exports.Processing.Tokenizer,
    /**
     * Splits the the given textual ({@link module:model/texttools/processabletools.Tokens.Leaf}) token's content to several new Tokens, 
     * aggregates them in a new container Token ({@link module:model/texttools/processabletools.Tokens.Fork}), then returns it.<br /><br />
     * There will be a {@link module:model/texttools/processabletools.Processing.Tokenizer#tokenConstructor} type of token in the interval 
     * {@link module:model/texttools/processabletools.Processing.Tokenizer#interval}, if needed, new tokens of the type of the given token will be
     * created before/after that interval.
     * Called by {@link module:model/texttools/processabletools.Processing.Tokenizer#tokenizeLeaf}
     * @param {module:model/texttools/processabletools.Tokens.Token} token    token that needs to be transformed
     * @return {module:model/texttools/processabletools.Tokens.Token}   the transformed token
     */
    split: function ( token ) {
        // We tokenize the string. In this case we don't have to check the precedences.
        var intervalBeforeStart = token.interval.start;
        var isStartInInterval = ( this.interval.start - token.interval.start ) >= 0;
        var intervalBeforeEnd = isStartInInterval ? this.interval.start : token.interval.start;
        
        var isEndInInterval = ( token.interval.end - this.interval.end ) >= 0;
        var intervalAfterStart = isEndInInterval ? this.interval.end : token.interval.end;
        var intervalAfterEnd = token.interval.end;
        
        var newContent = [];
        
        if ( intervalBeforeStart !== intervalBeforeEnd ) {
            var newTokenBefore = new token.constructor( 
                token.substring( intervalBeforeStart, intervalBeforeEnd ),
                new exports.Tokens.Interval( intervalBeforeStart, intervalBeforeEnd )
            );
            newContent.push( newTokenBefore );
        }
        
        var newToken = new this.tokenConstructor( 
            token.substring( intervalBeforeEnd, intervalAfterStart ),
            new exports.Tokens.Interval( intervalBeforeEnd, intervalAfterStart ),
            this.extraArg
        );
        newContent.push( newToken );
        
        if ( intervalAfterStart !== intervalAfterEnd ) {
            var newTokenAfter = new token.constructor( 
                token.substring( intervalAfterStart, intervalAfterEnd ),
                new exports.Tokens.Interval( intervalAfterStart, intervalAfterEnd )
            );
            newContent.push( newTokenAfter );
        }
        
        return new exports.Tokens.Fork( newContent, token.interval.clone() );
    },
    /**
     * Returns a new {@link module:model/texttools/processabletools.Processing.Tokenizer#tokenConstructor} type of Token created with the content of the given token.
     * Called by {@link module:model/texttools/processabletools.Processing.Tokenizer#tokenizeNode}
     * @param {module:model/texttools/processabletools.Tokens.Token} token    token that needs to be transformed
     * @return {module:model/texttools/processabletools.Tokens.Token}   the transformed token
     */
    replace: function ( token ) {
        return new this.tokenConstructor( 
            token.content,
            token.interval.clone(),
            this.extraArg
        );
    },
    /**
     * Tokenize (split) the the given textual token ({@link module:model/texttools/processabletools.Tokens.Leaf}).
     * Called by {@link module:model/texttools/processabletools.Tokens.Leaf#tokenize}
     * @param {module:model/texttools/processabletools.Tokens.Token} token    token that needs to be transformed
     * @return {module:model/texttools/processabletools.Tokens.Token}   the transformed token
     */
    tokenizeLeaf: function ( token ) {
        return this.split( token );
    },
    /**
     * Tokenize the the given container token's content tokens ({@link module:model/texttools/processabletools.Tokens.Fork}).
     * Called by {@link module:model/texttools/processabletools.Tokens.Fork#tokenize}
     * @param {module:model/texttools/processabletools.Tokens.Token} token    token that needs to be transformed
     * @return {module:model/texttools/processabletools.Tokens.Token}   the transformed token
     */
    tokenizeNode: function ( token ) {
        for ( var i = 0; i < token.content.length; ++i ) {
            var actToken = token.content[ i ];
            switch ( this.interval.relationTo( actToken.interval ) ) {
                case 3:
                case -1:
                case 1:
                    token.content[ i ] = actToken.tokenize( this );
                break;
                case 4:
                    token.content[ i ] = this.replace( actToken );
                break;
                case 2:
                    return token;
                break;
                default:
            }
        }
        return token;
    }
};


/**
 * Create a new instance of Processer.
 * @class Represents a Token Processer object, that will be given to the tokens' process method.
 * See {@link module:model/texttools/processabletools.Tokens.Token#process}<br /><br />
 * <strong>It's methods are empty by default.</strong><br /><br />
 * Implements the Callback pattern. Roles:
 * <dl>
 *    <dt> {@link module:model/texttools/processabletools.Tokens.Token#process} </dt><dd> Caller </dd>
 *    <dt> {@link module:model/texttools/processabletools.Processing.Processer} </dt><dd> Callback object </dd>
 *    <dt> {@link module:model/texttools/processabletools.Processing.Processer#onMatch} </dt><dd> Callback function </dd>
 * </dl>
 */
exports.Processing.Processer = function Processer() {
    /**
     * The ProcessableText instance the processer instance will work on.
     * @type module:model/texttools/processabletools.ProcessableText
     */
    this.root = null;
}
exports.Processing.Processer.prototype = {
    /**
     * The constructor of the type, needed for proper JavaScript core functionality (e.g. instanceof).
     * @type {function}
     * @private
     */
    constructor: exports.Processing.Processer,
    
    init: function ( text ) {
        this.root = text.root;
    },
    /**
     * A regular expression the maches will be based on.
     * @type RegExp
     */
    regExp: null,
    /**
     * The method {@link module:model/texttools/processabletools.Tokens.Token#process} calls this function back if a match based on 
     * {@link module:model/texttools/processabletools.Processing.Processer#regExp} is found.<br />
     * @param {number} index        The matched sequence's position in the whole ProcessableText, <em>not in the actual token</em>.
     * @param {string} match        The last matched sequence.
     * @param {array} submatcharray The parenthesized substring matches, if any. See the documentation of RegExp.exec.
     */
    onMatch: function ( index, match, submatcharray ) {},
    /**
     * The method {@link module:model/texttools/processabletools.ProcessableText#process} calls this function back at the start of the processing.
     */
    onStart: function () {},
    /**
     * The method {@link module:model/texttools/processabletools.ProcessableText#process} calls this function back at the end of the processing.
     */
    onEnd: function () {}
};


/**
 * Create a new instance of Replacer.
 * @class Represents a Token content substring replacer object, that will be given to the tokens' replace method.
 * See {@link module:model/texttools/processabletools.Tokens.Token#replace}<br /><br />
 * <em>It's methods are empty by default</em><br /><br />
 * Implements the Callback pattern. Roles:
 * <dl>
 *    <dt> {@link module:model/texttools/processabletools.Tokens.Token#replace} </dt><dd> Caller </dd>
 *    <dt> {@link module:model/texttools/processabletools.Processing.Replacer} </dt><dd> Callback object </dd>
 *    <dt> {@link module:model/texttools/processabletools.Processing.Replacer#replace} </dt><dd> Callback function </dd>
 * </dl>
 */
exports.Processing.Replacer = function Replacer() {}
exports.Processing.Replacer.prototype = {
    /**
     * The constructor of the type, needed for proper JavaScript core functionality (e.g. instanceof).
     * @type {function}
     * @private
     */
    constructor: exports.Processing.Replacer,
    /**
     * A regular expression the maches will be based on.
     * @type RegExp
     */
    regExp: null,
    /**
     * The method {@link module:model/texttools/processabletools.Tokens.Token#replace} calls this function back 
     * if a match based on {@link module:model/texttools/processabletools.Processing.Replacer#regExp} is found.<br />
     * @param {string} match   The matched sequence.
     * @returns {string}       the new substring to put in place of the match received
     */
    replace: function ( match ) {}
};


///////////////////////////////////////////


/**
 * Create a new instance of ProcessableText.
 * @param {string} string    The textual content of the object.
 * @class A facade over tokens. See {@link module:model/texttools/processabletools.Tokens.Token}.
 */
exports.ProcessableText = function ProcessableText( string ) {
    /**
     * The root of the token-tree which represents the textual content of the owner
     * @type module:model/texttools/processabletools.Tokens.Fork
     */
    this.root = new exports.Tokens.Fork( [ new exports.Tokens.Leaf( !!string ? string : "" ) ] );
}
exports.ProcessableText.prototype = Object.create( Object.prototype, 
/** @lends module:model/texttools/processabletools.ProcessableText.prototype */
{
    /**
     * The constructor of the type, needed for proper JavaScript core functionality (e.g. instanceof)
     * @type {function}
     * @private
     */
    constructor: { value: exports.ProcessableText },
    /**
     * The string conversion method of the type, needed for proper JavaScript core functionality.
     * @type {function}
     * @private
     */
    toString: {
        value: function () { return this.root.render(); }
    },
    /**
     * Process the the text with the given processer object.
     * Delegates the call to the root token {@link module:model/texttools/processabletools.ProcessableText#root}, see {@link module:model/texttools/processabletools.Tokens.Token#process}<br /><br />
     * Implements the Callback pattern. Roles:
     * <dl>
     *    <dt> {@link module:model/texttools/processabletools.ProcessableText#process} </dt><dd> Caller </dd>
     *    <dt> {@link module:model/texttools/processabletools.Processing.Processer} </dt><dd> Callback object </dd>
     *    <dt> {@link module:model/texttools/processabletools.Processing.Processer#onMatch} </dt><dd> Callback function </dd>
     * </dl>
     * See {@link module:model/texttools/processabletools.Processing.Processer}
     * @function
     * @param {module:model/texttools/processabletools.Processing.Processer} processer
     * @return {module:model/texttools/processabletools.ProcessableText} the owner istself, for function chaining
     */
    process: {
        value: function ( processer ) {
            processer.init( this );
            processer.onStart();
            this.root.process( processer );
            processer.onEnd();
            return this;
        },
        enumerable: true
    },
    /**
     * Replace substings in the text with the return value of the given replacer object's replace method.
     * Delegates the call to the root token {@link module:model/texttools/processabletools.ProcessableText#root},
     * see {@link module:model/texttools/processabletools.Tokens.Token#replace}<br /><br />
     * @function
     * @param {module:model/texttools/processabletools.Processing.Replacer} replacer
     * @return {module:model/texttools/processabletools.ProcessableText} the owner istself, for function chaining
     */
    replace: {
        value: function ( replacer ) {
            this.root.replace( replacer );
            return this;
        },
        enumerable: true
    },
    /**
     * Accessor to the length of the text.
     * @type number
     */
    length: {
        get: function () { return this.root.render().length; },
        enumerable: true
    }
});