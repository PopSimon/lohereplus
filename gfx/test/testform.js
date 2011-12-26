/**
 * @author simon
 */

function Control(/*Object*/ o, /*String*/ propertyname) {
    this.targetObject = o;
    this.taretProperty = propertyname;
    
}

function TestForm(/*string*/id) {
    this.DOMElement = $(this.getHTMLString(id));
    this.controls = [];
    this.getHTMLString = function(id) {
        return '<form id="' + id + '" name="' + id + '" class="testform"></form>';
    };
    this.addControl = function(/*control*/c) {
        this.controls.push(c);
        this.DOMElement.append(c.DOMElement);
    };
}
