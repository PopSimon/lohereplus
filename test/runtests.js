var reporter = require('./nodeunit').reporters.default;
var tests = require('./index.js').tests;

var children = [ 'model' ];

testsPaths = [];

for ( var i in tests ) {
    testsPaths.push( './' + tests[i] );
}

for ( var i in testsPaths ) {
    console.log( testsPaths[i] );
}

reporter.run( testsPaths );

