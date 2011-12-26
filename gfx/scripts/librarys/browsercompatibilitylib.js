/**
 * @author simon
 */

"use strict";

/**
 * Fixing the setTimeout/setInterval parameterlist "unfeature" on IE.
 */
	
/*@cc_on
(function(f){
 window.setTimeout =f(window.setTimeout);
 //window.setInterval =f(window.setInterval);
})(function(f){return function(c,t){var a=[].slice.call(arguments,2);return f(function(){c.apply(this,a)},t)}});
@*/


/**
 * Provides much of the functionality Function.prototype.bind to the browsers
 * that don's support it.
 * 
 * Some of the many differences (there may well be others, as this list does not seriously attempt to be exhaustive) between this algorithm and the specified algorithm are:
 * - The partial implementation relies Array.prototype.slice, Array.prototype.concat, Function.prototype.call and Function.prototype.apply, built-in methods to have their original values.
 * - The partial implementation creates functions that do not have immutable "poison pill" caller and arguments properties that throw a TypeError upon get, set, or deletion. (This could be added if the implementation supports Object.defineProperty, or partially implemented [without throw-on-delete behavior] if the implementation supports the __defineGetter__ and __defineSetter__ extensions.)
 * - The partial implementation creates functions that have a prototype property. (Proper bound functions have none.)
 * - The partial implementation creates bound functions whose length property does not agree with that mandated by ECMA-262: it creates functions with length 0, while a full implementation, depending on the length of the target function and the number of pre-specified arguments, may return a non-zero length.
 */

if (!Function.prototype.bind) {

	Function.prototype.bind = function (oThis) {
 
		if (typeof this !== "function") // closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is trying to be fBound is not callable");

		var aArgs = Array.prototype.slice.call(arguments, 1), 
			fToBind = this, 
			fNOP = function () {},
			fBound = function () {
				return fToBind.apply(this instanceof fNOP ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));    
			};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;

	};

}