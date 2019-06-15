class RequestQueue {
	constructor(max) {
		this.max = (max || 5);
		this.nextPointer = 0;
		this.queue = [];
		this.performing = 0;
	}
	enqueueRequest(tuple, rowIndex, tupleIndex) {
		this.queue.push([tuple, rowIndex, tupleIndex]);
		this.work();
	}
	work() {
		if(this.max > this.performing) {
			if(this.queue[this.nextPointer] === undefined) {
				console.debug("Queue finished");
				this.nextPointer = 0;
				this.queue = [];
				this.performing = 0;
			} else {
				var next = this.queue[this.nextPointer];
				this.nextPointer += 1;
				this._performRequest(next[0], next[1], next[2]);
			}
		}
	}
	_finishRequest() {
		this.performing -= 1;
		this.work();
	}
	_performRequest(tuple, rowIndex, tupleIndex) {
		var this_rq = this;
		this.performing += 1;
		tuple.ui.status = "progress";
		tuple.ui.update();

		if(tuple.conditions.length == 1 && tuple.conditions[0].mode == "^") {
			var host = getHost(tuple.conditions[0].value);
			if(host != null) {
				$.ajax({
					data: {
						"action": "query",
						"format": "json",
						"prop": "pageprops",
						"ppprop": "wikibase_item",
						"redirects": "1",
						"titles": tuple.searchquery,
						"origin": "*"
					},
					url: `https://${host}/w/api.php`
				}).always(function(e) {
					this_rq._finishRequest();
				}).done(function(e) {
					console.debug(e);
					if(Object.keys(e.query.pages)[0] == "-1") {
						tuple.ui.status = "noresults";
						tuple.ui.update();
					} else {
						tuple.ui.status = "success";
						tuple.result = e.query.pages[Object.keys(e.query.pages)[0]].pageprops.wikibase_item;
						tuple.ui.update();
					}
				}).fail(function(e) {
					tuple.ui.status = "failed";
					tuple.ui.update();
					console.error(e);
				});
			}

			function getHost(name) {
				if(name == "commonswiki") return "commons.wikimedia.org";
				if(name == "mediawikiwiki") return "www.mediawiki.org";
				if(name == "metawiki") return "meta.wikimedia.org";
				if(name == "specieswiki") return "species.wikimedia.org";
				if(name == "wikidatawiki") return "wikidata.org";
				if(name == "wikimaniawiki") return "wikimania.wikimedia.org";

				var match = name.match(/^([a-zA-Z_]+)(wikibooks|wikinews|wikiquote|wikisource|wikiversity|wikivoyage|wiktionary)$/);
				if(match != null) return `${match[1]}.${match[2]}.org`;

				var match = name.match(/^([a-zA-Z_]+)wiki$/);
				if(match != null) return `${match[1]}.wikipedia.org`;

				console.warn("Unknown wiki: ", name);
				return null;
			}
		} else {
			$.ajax({
				data: {
					"action": "wbsearchentities",
					"format": "json",
					"language": $("#setting-language-search").val(),
					"limit": Utils.validateNumber($("#setting-disambiguation-candidatesnumber").val(), 7),
					"origin": "*",
					"type": tuple.type.toLowerCase() == "q" ? "item" : "property",
					"search": tuple.searchquery
				},
				url: `https://www.wikidata.org/w/api.php`
			}).always(function(e) {
				this_rq._finishRequest();
			}).done(function(e) {
				if(e.search.length == 0) {
					tuple.ui.status = "noresults";
					tuple.ui.update();
				} else {
					Condition.filterItems(tuple, e.search, finalize);
				}
			}).fail(function(e) {
				tuple.ui.status = "failed";
				tuple.ui.update();
				console.error(e);
			});
		}
			
		function finalize(items) {
			if(items.length == 1) {
				tuple.ui.status = "success";
				tuple.result = items[0].id;
				tuple.ui.generateDisambiguation(items);
				tuple.ui.update();
			} else {
				tuple.ui.status = "disambiguation";
				tuple.ui.generateDisambiguation(items);
				tuple.ui.update();
			}
		}
	}
}