$(document).ready(function() {
	searchFor = $("#searchFor");
	searchIn = function() { return $("#searchIn").val(); };
	url = "http://bupu.mzk.cz/~xrosecky/autocomplete.php";
	var map = {
		"vse" : [ "title_shortStr", "authorStr", "authorTitle" ],
		"slova z autoru" : ["authorStr"],
		"slova z nazvu" : ["authorTitle"],
	};
	create_autocomplete(searchFor, searchIn, map, url);
});
