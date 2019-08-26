class Condition {
	constructor(mode, property, value) {
		this.mode = mode;
		this.property = property;
		this.value = value;
	}

	static filterItem(tuple, elements, results, callback) {
		var elementsNew = elements.slice(0);

		$.ajax({
			beforeSend: function(request) {
				request.setRequestHeader("Accept", "application/json, text/plain, */*");
			},
			data: {
				"query": `SELECT ?item ?itemLabel WHERE { VALUES ?item {${resultsToIdList(results).join(" ")}} ${generateConditions(tuple).join("")} SERVICE wikibase:label { bd:serviceParam wikibase:language "${$("#setting-language-item").val().toLowerCase()},en". } }`
			},
			type: "GET",
			url: "https://query.wikidata.org/sparql"
		}).done(function(e) {
			var sparqlMatches = sparqlResultToIdList(e);
			$.each(elements, function(index, candidate) {
				if(sparqlMatches.indexOf(candidate.id) > -1) {
					extendData(elementsNew[index], results.entities[candidate.id]);
				} else {
					elementsNew[index] = null;
				}
			});
			callback(elementsNew.filter(function(n) {	// Filter out 'null'
				return n != null;
			}));
		}).fail(function(e) {
			console.error(e);
			callback(elements);	// Don't filter
		});

		function generateConditions(tuple) {
			var rules = [];
			$.each(tuple.conditions, function(a, b) {
				switch(b.mode) {
					case "=":
						rules.push(`?item wdt:${b.property} wd:${b.value} .`);
						break;
					case "~":
						rules.push(`?item ${b.property} ${b.value} .`);
						break;
				}
			});
			return rules;
		}
		function sparqlResultToIdList(results) {
			var idList = [];
			$.each(results.results.bindings, function(a, b) {
				idList.push(b.item.value.replace("http://www.wikidata.org/entity/", ""));
			});
			return idList;
		}
		function resultsToIdList(results) {
			var idList = [];
			$.each(results.entities, function(index, candidate) {
				idList.push(`wd:${candidate.id}`);
			});
			return idList;
		}
	}
	static filterItems(tuple, elements, callback) {
		var ids = [];
		$.each(elements, function(index, item) {
			ids.push(item.id);
		});

		$.ajax({
			data: {
				"action": "wbgetentities",
				"format": "json",
				"languages": `${$("#setting-language-item").val().toLowerCase()}|en`,
				"origin": "*",
				"ids": ids.join("|")
			},
			url: "https://www.wikidata.org/w/api.php"
		}).done(function(e) {
			if(tuple.conditions.length > 0) {
				Condition.filterItem(tuple, elements, e, callback);
			} else {
				callback(elements);
			}
		}).fail(function(e) {
			console.error(e);
			callback(elements);
		});
	}
	static parse(conditions) {
		var rules = [];
		if(conditions.startsWith("^")) {
			rules.push(new Condition("^", "", conditions.substr(1)));
		} else {
			$.each(conditions.split(","), function(ruleIndex, ruleTerm) {
				if(ruleTerm.split("=").length == 2) {
					var pair = ruleTerm.split("=");
					rules.push(new Condition("=", pair[0], pair[1]));
				} else if(ruleTerm.split("~").length == 2) {
					var pair = ruleTerm.split("~");
					rules.push(new Condition("~", pair[0], pair[1]));
				}
			});
		}
		return rules;
	}
}