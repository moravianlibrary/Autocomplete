function create_autocomplete(where, select, map, url) {
	where.autocomplete({
                source: function(request, response) {
			if (select != null) {
				selected = select();
				fields = map[selected];
			}
			$.ajax({
				url: url,
				dataType: "json",
				contentType: "application/json;charset=UTF-8",
				data: {
					"fl" : "key",
					"wt" : "json",
					"echoParams" : "none",
					"rows" : "10",
					"sort" : "count desc",
					"indent" : "on",
					"q"  : request.term
				},
				success: function(data) {
					var result = [];
					jQuery.each(data.response.docs, function(key, value) {
						result.push(value.key);
					});
					response(result);
				}
			});
		}
	});
}

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


/*
$(document).ready(function() {
	$("#edit-custom-search-blocks-form-1-1").autocomplete({
		source: function(request, response) {
			$.ajax({
				url: "http://beta.mzk.cz/Autocomplete",
				dataType: "json",
				contentType: "application/json;charset=UTF-8",
				data: {
					"fl" : "key",
					"wt" : "json",
					"echoParams" : "none",
					"rows" : "10",
					"sort" : "count desc",
					"indent" : "on",
					"q"  : request.term
				},
				success: function(data) {
                                        var result = [];
                                        jQuery.each(data.response.docs, function(key, value) {
						result.push(value.key);
					});
					response(result);
				}
			});
		}
	});
});
*/

