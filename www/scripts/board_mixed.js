/**
 * @author julius
 */"use strict";
 
$(document).ready( function() {
	$("form").draggable();
	$("form").draggable("disable");
	$("img#msgbox_pin").click( function(e) {
		$("form").toggleClass("pinned");
		if($("form").hasClass("pinned")) {
			var pos = {
				left: $("form").offset().left - $(document).scrollLeft(),
				top: $("form").offset().top - $(document).scrollTop()
			}
			$("img#msgbox_pin").attr("src", "images/pin.png");
			$("form").draggable( "enable" );
			$("form").offset(pos);
		} else {
			var pos = {
				left: $("form").offset().left + $(document).scrollLeft(),
				top: $("form").offset().top + $(document).scrollTop()
			}
			$("img#msgbox_pin").attr("src", "images/unpin.png");
			$("form").draggable( "disable" );
			$("form").offset(pos);
		}
	});
	
	function reply(element) {
		
	}
	
	$("section article footer a").click( function(e) {
		var link = '>>' + $(e.srcElement).attr("href").match(/\d+/);
		//link = '>>' + link;
		$("form textarea").text( $("form textarea").text() + link + " ");
		//alert(link);
		
	}
		
	)
});
