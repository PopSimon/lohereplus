/**
 * @author simon
 */"use strict";

var fade_time = 2000;
var visible_time = 12000;
var hidden_time = 1000;
var cycle_time = visible_time + hidden_time + 2 * fade_time;
var logo_images = [];
var jqxhr = $.getJSON('images/logo/logo_list.json', function(data) {
	logo_images = data;
});

jqxhr.error(function() {
	/*
	 * test data
	 */
	logo_images = JSON.parse('["nb5.jpg", "p11.png", "p4.jpg"]');
});

jqxhr.complete(function() {
	$(document).ready(function() {
		$("header").append('<img id="logo_over" src="images/logo/' + logo_images[Math.round(Math.random() * (logo_images.length - 1 ))] + '" \>');
		$("#logo_over").fadeToggle(0);
		setTimeout(function() {
			slideShowStep();
			setInterval(slideShowStep, cycle_time);
		}, 1000);
	});
});

function slideShowStep() {
	// nem láthatót láthatóvá tenni
	setTimeout(function() {
		$("#logo_over").fadeToggle(fade_time);
	}, 0);
	// láthatót láthatatlanná
	setTimeout(function() {
		$("#logo_over").fadeToggle(fade_time);
	}, visible_time);
	// elem lecserélése
	setTimeout(function() {
		$("#logo_over").replaceWith('<img id="logo_over" src="images/logo/' + logo_images[Math.round(Math.random() * (logo_images.length - 1 ))] + '" \>');
		$("#logo_over").fadeToggle(0);
	}, visible_time + fade_time + hidden_time);
}