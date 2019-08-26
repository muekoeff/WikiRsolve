class RequestManager {
	constructor() {
		this.requestQueue = new TaskQueue();
	}

	enqueueRequest(tuple, rowIndex, tupleIndex) {
		this.requestQueue.enqueueTask(this._performRequest, {
			tuple: tuple,
			rowIndex: rowIndex,
			tupleIndex: tupleIndex
		});
	}

	_performRequest(requestQueue, data) {
		this.performing += 1;
		data.tuple.ui.status = "working";
		data.tuple.ui.update();

		if(data.tuple.conditions.length == 1 && data.tuple.conditions[0].mode == "^") {
			var host = WikiUtils.getHost(data.tuple.conditions[0].value);
			if(host != null) {
				$.ajax({
					data: {
						"action": "query",
						"format": "json",
						"prop": "pageprops",
						"ppprop": "wikibase_item",
						"redirects": "1",
						"titles": data.tuple.searchquery,
						"origin": "*"
					},
					url: `https://${host}/w/api.php`
				}).always(function(e) {
					requestQueue.finishTask();
				}).done(function(e) {
					console.debug(e);
					if(Object.keys(e.query.pages)[0] == "-1") {
						data.tuple.ui.status = "no results";
						data.tuple.ui.update();
					} else {
						data.tuple.ui.status = "success";
						data.tuple.result = e.query.pages[Object.keys(e.query.pages)[0]].pageprops.wikibase_item;
						data.tuple.ui.update();
					}
				}).fail(function(e) {
					data.tuple.ui.status = "error";
					data.tuple.ui.update();
					console.error(e);
				});
			} else {
				data.tuple.ui.status = "error";
				data.tuple.ui.update();
			}
		} else {
			$.ajax({
				data: {
					"action": "wbsearchentities",
					"format": "json",
					"language": $("#setting-language-search").val(),
					"limit": Utils.validateNumber($("#setting-disambiguation-candidatesnumber").val(), 7),
					"origin": "*",
					"search": data.tuple.searchquery,
					"type": data.tuple.type.toLowerCase() == "q" ? "item" : "property",
					"uselang": $("#setting-language-search").val()
				},
				url: `https://www.wikidata.org/w/api.php`
			}).always(function(e) {
				requestQueue.finishTask();
			}).done(function(e) {
				if(e.search.length == 0) {
					data.tuple.ui.status = "no results";
					data.tuple.ui.update();
				} else {
					Condition.filterItems(data.tuple, e.search, finalize);
				}
			}).fail(function(e) {
				data.tuple.ui.status = "error";
				data.tuple.ui.update();
				console.error(e);
			});
		}
			
		function finalize(items) {
			if(items.length == 1) {
				data.tuple.ui.status = "success";
				data.tuple.result = items[0].id;
				data.tuple.ui.generateDisambiguation(items);
				data.tuple.ui.update();
			} else {
				data.tuple.ui.status = "disambiguation";
				data.tuple.ui.generateDisambiguation(items);
				data.tuple.ui.update();
			}
		}
	}
}