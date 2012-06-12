exports.ownpath = 'processabletools';
var children = [ 'interval.js', 'processabletext.js', 'tokens.js', 'processing.js', 'tokenizing.js', 'replacing.js' ];

exports.tests = [];

for ( var i in children ) {
    exports.tests.push( children[i]  );
}