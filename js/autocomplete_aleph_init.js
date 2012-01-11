$(document).ready(function() {
	searchFor = $(':input[name="request"]');
	searchIn = function() { return $(':input[name="find_code"]').val(); };
	url = "http://staff.mzk.cz/~xrosecky/autocomplete.php";
	var map = {
		"WRD" : [ "title", "author", "author_title" ],
		"WTI" : ["title"],
		"WAU" : ["author"],
                "WKW" : ["subject"],
	};
	create_autocomplete(searchFor, searchIn, map, url);
	create_autocomplete($("#Author"), null, [ "authorStr" ], url);
	create_autocomplete($("#Title"), null, [ "title_shortStr" ], url);
});
