var BBCodeEngine = new exports.BBCodeEngine( {
    b: {
        HTMLtag: "em",
        attributes: {
            class: "bold"
        }
    }
}, 5 );

var EscapeEngine = new exports.HTMLEscapeEngine();
var EscapeEngine = new exports.HTMLEscapeEngine();
var LinkifierEngine = new exports.LinkifierEngine([
    "google\\.(?:com|hu)"
], [
    "\\s*\\.puruttya.hu"
]);

function escapeTest() {
    var s = "zsidó cigány <b> &alt; dsfsdfdfd"
    var token = new exports.Token( s );

    var t = EscapeEngine.escape( token );

    console.log(t.render());
}

function linkifyTest() {
    var s = "zsidó google.hu cigány http://google.hu <b> &alt; google.hu dsfsdfdfd"
    var token = new exports.Token( s );

    var t = LinkifierEngine.process( token );

    console.log( t.render() );
}

function linkifyXSSTest() {
    var s = "zsidó google.hu cigány http://google.hu.\"onclick=\"alert(\"Szia_ocsi!\")\" <b> &alt; dsfsdfdfd"
    var token = new exports.Token( s );

    var t = LinkifierEngine.process( token );

    console.log( t.render() );
}

function lineFormattingTest() {
    var s = "\n\n\nn\nzsidó cig\nány <b> \n\n\n &alt; dsfsdfdfd\nss\n\n"
    var token = new exports.Token( s );

    var t = exports.LineBreakEngine.process( token );

    console.log(t.render());
}

function okTest() {
    var s = "zsidó cigány [b] appCodeNa [/b] dsfsdfdfd"
    var token = new exports.Token( s );

    var t = BBCodeEngine.process( token );

    console.log(t.render());
}

function nestedTest() {
    var s = "zsidó cigány [b] appC [b]ode[/b]Na [/b] dsfsdfdfd"
    var token = new exports.Token( s );

    var t = BBCodeEngine.process( token );

    console.log(t.render());
}

function badlyNestedTest() {
    var s = "zsidó cigány [b] ap[b]pC [b]ode[/b]Na [/b] dsfsdfdfd"
    var token = new exports.Token( s );

    var t = BBCodeEngine.process( token );

    console.log(t.render());
}