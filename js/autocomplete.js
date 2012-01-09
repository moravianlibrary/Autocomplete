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
