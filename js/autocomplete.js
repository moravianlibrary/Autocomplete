function create_autocomplete(where, select, map, url) {
	where.autocomplete({
                source: function(request, response) {
		  	var fields = null;
			if (select != null) {
				selected = select();
				fields = map[selected];
			} else {
				fields = map;
			}
			var query = '';
			var sep = '';
			if (fields != null) {
				$(fields).each(function(index) {
					query+= sep + "(key:" + request.term + " AND field:" + fields[index]+ ")";
					sep = " OR ";
				});
			} else {
				response([]);
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
					"q"  : query
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
