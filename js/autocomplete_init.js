$(document).ready(function() {
	searchFor = $("#searchFor");
	searchIn = function() { return $("#searchIn").val(); };
	url = "http://staff.mzk.cz/~xrosecky/autocomplete.php";
	var map = {
		"vse" : [ "title_shortStr", "authorStr", "authorTitle" ],
		"slova z autoru" : ["authorStr"],
		"slova z nazvu" : ["title_shortStr"],
	};
	create_autocomplete(searchFor, searchIn, map, url);
	create_autocomplete($("#Author"), null, [ "authorStr" ], url);
	create_autocomplete($("#Title"), null, [ "title_shortStr" ], url);
});
