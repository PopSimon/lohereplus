exports.ownpath = 'test';
var children = [ 'model' ];

exports.tests = [];

for ( var i in children ) {
    var child = require( "./" + children[i] );
    for ( var j in child.tests ) {
        var test = child.tests[ j ];
        exports.tests.push( child.ownpath + '/' + test );
    }
}