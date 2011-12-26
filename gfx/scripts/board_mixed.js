/**
 * @author simon
 */"use strict";
 

$(document).ready( function() {
	/*
	 * Globals
	 */
	LOHERE.thread = $("section");
	LOHERE.thread.id = LOHERE.thread.attr("id");
	LOHERE.msgform = $("form");
	LOHERE.msgform.pinimg = LOHERE.msgform.find("img#msgbox_pin");
	LOHERE.msgform.txtarea = LOHERE.msgform.find("textarea");
	
	/*
	 * Set messageform dynamic behaviour.
	 */
	LOHERE.msgform.draggable();
	LOHERE.msgform.draggable("disable");
	LOHERE.msgform.pinimg.click( function(e) {
		LOHERE.msgform.toggleClass("unpinned");
		if(LOHERE.msgform.hasClass("unpinned")) {
			var pos = {
				left: LOHERE.msgform.offset().left - $(document).scrollLeft(),
				top: LOHERE.msgform.offset().top - $(document).scrollTop()
			}
			LOHERE.msgform.pinimg.attr("src", "images/unpin.png");
			LOHERE.msgform.draggable( "enable" );
			LOHERE.msgform.offset(pos);
		} else {
			var pos = {
				left: LOHERE.msgform.offset().left + $(document).scrollLeft(),
				top: LOHERE.msgform.offset().top + $(document).scrollTop()
			}
			LOHERE.msgform.pinimg.attr("src", "images/pin.png");
			LOHERE.msgform.draggable( "disable" );
			LOHERE.msgform.offset(pos);
		}
	});
	
	var postdatas = LOHERE.getAllPostData(LOHERE.thread.id);
	LOHERE.createPosts( postdatas );
	
	/**
	 * Testform
	 */
	var gui = new DAT.GUI({
        height : 5 * 32 - 1
    });
    var params = {
        interation: 5000
    };
    gui.add(params, 'interation', 128, 256, 16);
    LOHERE.init();
} );

/*
window.onload = function() {

   var fizzyText = new FizzyText('dat.gui');

   var gui = new DAT.GUI();

   // Text field
   gui.add(fizzyText, 'message');

   // Sliders with min + max
   gui.add(fizzyText, 'maxSize').min(0.5).max(7);
   gui.add(fizzyText, 'growthSpeed').min(0.01).max(1).step(0.05);
   gui.add(fizzyText, 'speed', 0.1, 2, 0.05); // shorthand for min/max/step

   gui.add(fizzyText, 'noiseStrength', 10, 100, 5);

   // Boolean checkbox
   gui.add(fizzyText, 'displayOutline');

   // Fires a function called 'explode'
   gui.add(fizzyText, 'explode').name('Explode!'); // Specify a custom name.

};
 */
