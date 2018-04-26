var elements;

class Condition {
	constructor(property, value) {
		this.property = property;
		this.value = value;
	}
}
class Settings {
	static attachLiveHandler() {
		$("#setting-candidateremoval").change(function(e) {
			if(this.checked) {
				Settings.disableConditionalStyle("candidateremoval");
			} else {
				Settings.enableConditionalStyle("candidateremoval", `.tool-candidateremoval {
					display: none;
				}`);
			}
		});
	}
	static disableConditionalStyle(name) {
		var element = $(`style[data-setting='${name}']`);
		if(element.length != 0) element.remove();
	}
	static enableConditionalStyle(name, style) {
		if($(`style[data-setting='${name}']`).length == 0) $("head").append(`<style data-setting="${name}">${style}</style>`);
	}
	static export() {
		if($("#button-settings-geturl").hasClass("mode-ready")) {
			var settings = {
				"candidateremoval": $("#setting-candidateremoval").is(":checked"),
				"disambiguation-candidatesnumber": $("#setting-disambiguation-candidatesnumber").val(),
				"language-item": $("#setting-language-item").val(),
				"language-search": $("#setting-language-search").val()
			};
			window.location.search = `?settings=${encodeURIComponent(JSON.stringify(settings))}`;
		} else {
			$("#button-settings-geturl").tooltipster({
				content: "Clicking again on this button will redirect you to a new url which has your settings stored. This url can be bookmarked. However, your current entries in the input textbox will be gone once redirected.",
				functionAfter: function() {
				$("#button-settings-geturl").removeClass("mode-ready");
				},
				functionBefore: function() {
					$("#button-settings-geturl").addClass("mode-ready");
				},
				side: "left",
				theme: ["tooltipster-light", "tooltipster-error"],
				timer: 10000,
				trigger: "custom"
			}).tooltipster("open");
		}
	}
	static initialize() {
		Settings.attachLiveHandler();
		$("#button-settings-geturl").click(function(e) {
			e.preventDefault();
			Settings.export();
		});

		Settings.loadLanguages();
		Settings.load();
	}
	static load() {
		var query = (new URL(window.location.href)).searchParams.get("settings");
		if(query != null) {
			try {
				var settings = JSON.parse(query);

				if(typeof settings["candidateremoval"] != "undefined") $("#setting-candidateremoval").prop("checked", settings["candidateremoval"]);
				$("#setting-candidateremoval").change();

				if(typeof settings["disambiguation-candidatesnumber"] != "undefined") $("#setting-disambiguation-candidatesnumber").val(settings["disambiguation-candidatesnumber"]);
				if(typeof settings["language-item"] != "undefined") $("#setting-language-item").val(settings["language-item"]);
				if(typeof settings["language-search"] != "undefined") $("#setting-language-search").val(settings["language-search"]);
			} catch(ex) {
				console.warn(ex);
			}
		}
	}
	static loadLanguages() {	// https://www.wikidata.org/w/api.php?action=help&modules=wbsearchentities
		var lang = ["aa","ab","ace","ady","ady-cyrl","aeb","aeb-arab","aeb-latn","af","ak","aln","als","am","an","ang","anp","ar","arc","arn","arq","ary","arz","as","ase","ast","atj","av","avk","awa","ay","az","azb","ba","ban","bar","bat-smg","bbc","bbc-latn","bcc","bcl","be","be-tarask","be-x-old","bg","bgn","bh","bho","bi","bjn","bm","bn","bo","bpy","bqi","br","brh","bs","bto","bug","bxr","ca","cbk-zam","cdo","ce","ceb","ch","cho","chr","chy","ckb","co","cps","cr","crh","crh-cyrl","crh-latn","cs","csb","cu","cv","cy","da","de","de-at","de-ch","de-formal","din","diq","dsb","dtp","dty","dv","dz","ee","egl","el","eml","en","en-ca","en-gb","eo","es","es-formal","et","eu","ext","fa","ff","fi","fit","fiu-vro","fj","fo","fr","frc","frp","frr","fur","fy","ga","gag","gan","gan-hans","gan-hant","gcr","gd","gl","glk","gn","gom","gom-deva","gom-latn","gor","got","grc","gsw","gu","gv","ha","hak","haw","he","hi","hif","hif-latn","hil","ho","hr","hrx","hsb","ht","hu","hu-formal","hy","hz","ia","id","ie","ig","ii","ik","ike-cans","ike-latn","ilo","inh","io","is","it","iu","ja","jam","jbo","jut","jv","ka","kaa","kab","kbd","kbd-cyrl","kbp","kea","kg","khw","ki","kiu","kj","kk","kk-arab","kk-cn","kk-cyrl","kk-kz","kk-latn","kk-tr","kl","km","kn","ko","ko-kp","koi","kr","krc","kri","krj","krl","ks","ks-arab","ks-deva","ksh","ku","ku-arab","ku-latn","kum","kv","kw","ky","la","lad","lb","lbe","lez","lfn","lg","li","lij","liv","lki","lmo","ln","lo","loz","lrc","lt","ltg","lus","luz","lv","lzh","lzz","mai","map-bms","mdf","mg","mh","mhr","mi","min","mk","ml","mn","mo","mr","mrj","ms","mt","mus","mwl","my","myv","mzn","na","nah","nan","nap","nb","nds","nds-nl","ne","new","ng","niu","nl","nl-informal","nn","no","nod","nov","nrm","nso","nv","ny","nys","oc","olo","om","or","os","ota","pa","pag","pam","pap","pcd","pdc","pdt","pfl","pi","pih","pl","pms","pnb","pnt","prg","ps","pt","pt-br","qu","qug","rgn","rif","rm","rmy","rn","ro","roa-rup","roa-tara","ru","rue","rup","ruq","ruq-cyrl","ruq-latn","rw","rwr","sa","sah","sat","sc","scn","sco","sd","sdc","sdh","se","sei","ses","sg","sgs","sh","shi","shi-latn","shi-tfng","shn","si","simple","sje","sk","skr","skr-arab","sl","sli","sm","sma","smj","sn","so","sq","sr","sr-ec","sr-el","srn","srq","ss","st","stq","sty","su","sv","sw","szl","ta","tay","tcy","te","tet","tg","tg-cyrl","tg-latn","th","ti","tk","tl","tly","tn","to","tpi","tr","tru","ts","tt","tt-cyrl","tt-latn","tum","tw","ty","tyv","tzm","udm","ug","ug-arab","ug-latn","uk","ur","uz","uz-cyrl","uz-latn","ve","vec","vep","vi","vls","vmf","vo","vot","vro","wa","war","wo","wuu","xal","xh","xmf","yi","yo","yue","za","zea","zh","zh-classical","zh-cn","zh-hans","zh-hant","zh-hk","zh-min-nan","zh-mo","zh-my","zh-sg","zh-tw","zh-yue","zu"];

		$("#languages").html("");
		$.each(lang, function(index, langcode) {
			$("#languages").append(`<option value="${langcode}"></option>`);
		})
	}
}
class Tuple {
	constructor(searchquery, type, conditions) {
		this.searchquery = searchquery;
		
		if(typeof type != "undefined") this.type = type; else this.type = "q";
		if(typeof conditions != "undefined") this.conditions = conditions;

		this.result = null;
	}

	attachUi(ui) {
		this.ui = ui;
	}
	validate() {
		if(this.type.toLowerCase() != "p" && this.type.toLowerCase() != "q") return false;
		return true;
	}
}
class UiRow {
	constructor(rowIndex, tupleIndex, tuple, status, disambiguation, disambiguationRaw) {
		this.rowIndex = rowIndex;
		this.tupleIndex = tupleIndex;
		this.tuple = tuple;
		if(typeof status != "undefined") this.status = status; else this.status = "pending";
		if(typeof disambiguation != "undefined") this.disambiguation = disambiguation; else this.disambiguation = null;
		if(typeof disambiguationRaw != "undefined") this.disambiguationRaw = disambiguationRaw; else this.disambiguationRaw = null;
	}

	clearResult() {
		this.tuple.result = null;
		this.status = "disambiguation";
		this.generateDisambiguation();
		this.update();
	}
	generateDisambiguation(result) {
		var output = [];
		var ui = this;

		if(typeof result == "undefined" && this.disambiguationRaw != null) result = this.disambiguationRaw;
		if(typeof result != "undefined") this.disambiguationRaw = result;

		$.each(result, function(a, b) {
			if(b != null) {
				output.push(`<span class="${ui.tuple.result == b.id ? "mode-selected" : ""}" title="${b.description || "-"}"><a href="${b.concepturi}" data-item="${b.id}">${getHighlightedWord(b.label, ui.tuple.searchquery)}</a> <small>(${b.id}, ${b.description || "-"})</small> <small>[<a href="${b.concepturi}" target="_blank">Open</a>]</small></span>`);
			}
		});

		this.tuple.ui.disambiguation = output.join("<br/>");

		function getHighlightedWord(word, originalWord) {
			var indexOf = word.toLowerCase().indexOf(originalWord.toLowerCase());
			word = _e(word);
			originalWord = _e(originalWord);
			
			if(indexOf >= 0) {
				return `${word.substr(0, indexOf)}<span class="wordhighlight">${word.substr(indexOf, originalWord.length)}</span>${word.substring(indexOf + originalWord.length)}`;
			} else {
				return word;
			}
		}
	}
	generateRow() {
		return `<tr data-rowindex="${this.rowIndex}" data-tupleindex="${this.tupleIndex}">${this.generateInnerRow()}</tr>`;
	}
	generateInnerRow() {
		return `<th scope="row">${this.rowIndex + 1}</th>
			<td><span class="status status-${this.status}"></span></td>
			<td>${_e(this.tuple.searchquery)}</td>
			<td>${this.tuple.result != null ? `<a href="https://www.wikidata.org/wiki/${this.tuple.result}" target="_blank">${this.tuple.result}</a><small class="tool-candidateremoval">&nbsp;[<a href="#" data-action="remove-candidate">&times;</a>]</small>` : ""}</td>
			<td>${this.disambiguation || ""}</td>`;
	}
	getRow() {
		return $(`tr[data-rowindex='${this.rowIndex}'][data-tupleindex='${this.tupleIndex}']`);
	}
	update() {
		this.getRow().html(this.generateInnerRow());
		attachRemoveListener(this);
		if(this.disambiguation != null) attachDisambiguationListener(this);

		function attachDisambiguationListener(ui) {
			$(ui.getRow().children("td")[3]).find("a[data-item]").each(function(a, b) {
				$(b).click(function(e) {
					e.preventDefault();
					ui.tuple.result = $(this).attr("data-item");
					ui.status = "success";
					ui.generateDisambiguation();
					ui.update();
				});
			});
		}
		function attachRemoveListener(ui) {
			$(ui.getRow().find("a[data-action='remove-candidate']")).click(function(e) {
				e.preventDefault();
				ui.clearResult();
			});
		}
	}
}

jQuery(document).ready(function($) {
	$("#button-copy").click(function(e) {
		e.preventDefault();
		copyTextToClipboard($("#output").val());
	});
	$("#button-output").click(function(e) {
		e.preventDefault();
		generateOutput(elements);
	});
	$("#button-parse").removeAttr("disabled").click(function(e) {
		e.preventDefault();
		parse();
	});
	$("#button-request").click(function(e) {
		e.preventDefault();
		request();
	});

	Settings.initialize();
});

function copyTextToClipboard(text) {
	var textArea = document.createElement("textarea");

	textArea.style.position = 'fixed';
	textArea.style.top = 0;
	textArea.style.left = 0;
	textArea.style.width = '2em';
	textArea.style.height = '2em';
	textArea.style.padding = 0;
	textArea.style.border = 'none';
	textArea.style.outline = 'none';
	textArea.style.boxShadow = 'none';
	textArea.style.background = 'transparent';
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.select();

	try {
		document.execCommand('copy');
	} catch(e) {
		console.error(e);
	}

	document.body.removeChild(textArea);
}
function generateOutput(elements) {
	var rows = [];
	$.each(elements, function(rowIndex, row) {
		var tuples = [];
		$.each(row, function(tupleIndex, tuple) {
			if(typeof tuple == "string") {
				tuples.push(tuple.substring(1));
			} else {
				tuples.push((tuple.result != null ? tuple.result : `<${tuple.searchquery}>`));
			}
		});
		rows.push(tuples.join("\t"));
	});
	$("#output").val(rows.join("\n"));
	$("#button-copy").removeAttr("disabled");
}
function generateTable(elements) {
	var output = "";
	var i = 0;
	if(elements.length > 0) {
		$("#table-output tbody").html("");

		$.each(elements, function(rowIndex, row) {
			if(row != null) {
				i++;
				$.each(row, function(tupleIndex, tuple) {
					if(tuple != null && typeof tuple != "string") {
						tuple.attachUi(new UiRow(rowIndex, tupleIndex, tuple, "pending"));
						$("#table-output tbody").append(tuple.ui.generateRow());
					}
				});
			}
		});
		$("#button-output,#button-request").removeAttr("disabled").show();
	} else {
		$("#table-output tbody").html(`<tr><td colspan="5">No data</td></tr>`);
		$("#button-output,#button-request").attr("disabled", "disabled").hide();
	}
}
function parse() {
	elements = [];
	$.each($("#commands").val().split("\n"), function(a, b) {
		var parse = parseRow(b);
		if(parse !== null && parse.length > 0) elements.push(parse);
	});
	generateTable(elements);

	function parseConditions(conditions) {
		var rules = [];
		$.each(conditions.split(","), function(ruleIndex, ruleTerm) {
			var pair = ruleTerm.split("=");
			rules.push(new Condition(pair[0], pair[1]));
		});

		return rules;
	}
	function parseItem(tuple) {
		if(tuple.startsWith("$")) {
			return tuple;
		} else {
			var parts = tuple.split("|");
			if(parts.length == 3) {
				var tuple = new Tuple(parts[0], parts[1], parseConditions(parts[2]));
				if(tuple.validate()) return tuple;
			} else if(parts.length == 2) {
				var tuple = new Tuple(parts[0], parts[1]);
				if(tuple.validate()) return tuple;
			}
		}
	}
	function parseRow(row) {
		var items = [];
		$.each(row.split("\t"), function(a, b) {
			var parse = parseItem(b);
			if(typeof parse != "undefined" && parse !== null) items.push(parse);
		});
		return items;
	}
}
function request() {
	$.each(elements, function(rowIndex, row) {
		$.each(row, function(tupleIndex, tuple) {
			if(typeof tuple != "string") performRequest(tuple, rowIndex, tupleIndex);
		});
	});

	function filterItems(tuple, elements, callback) {
		var elementsNew = elements.slice(0);
		var ids = [];
		$.each(elements, function(index, item) {
			ids.push(item.id);
		});

		$.ajax(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&languages=${$("#setting-language-item").val().toLowerCase()}|en&origin=*&ids=${ids.join("|")}`
		).done(function(e) {
			$.each(elements, function(index, candidate) {
				if(!filterItem(tuple, e.entities[candidate.id])) {
					elementsNew[index] = null;
				} else {
					extendData(elementsNew[index], e.entities[candidate.id]);
				}
			});
			callback(elementsNew.filter(function(n) {	// Filter out 'null'
				return n != null;
			}));
		}).fail(function(e) {
			console.error(e);
			callback(elementsNew);
		});

		function filterItem(tuple, item) {
			var endresult = true;

			$.each(tuple.conditions, function(index, condition) {
				if(typeof item.claims[condition.property] != "undefined") {
					if(!claimCheck(item.claims[condition.property], condition.value)) {
						endresult = false;
						return;
					}
				} else {
					endresult = false;
					return;
				}
			});
			return endresult;

			function claimCheck(claims, target) {
				var endresult = false;
				$.each(claims, function(index, claim) {
					if(claim.mainsnak.datavalue.value.id == target)	{
						endresult = true;
						return;
					}
				});
				return endresult;
			}
		}
	}
	function performRequest(tuple, rowIndex, tupleIndex) {
		tuple.ui.status = "progress";
		tuple.ui.update();

		$.ajax(`https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=${$("#setting-language-search").val()}&limit=${validateNumber($("#setting-disambiguation-candidatesnumber").val(), 7)}&origin=*&type=${tuple.type.toLowerCase() == "q" ? "item" : "property"}&search=${tuple.searchquery}`
		).done(function(e) {
			if(e.search.length == 0) {
				tuple.ui.status = "noresults";
				tuple.ui.update();
			} else {
				filterItems(tuple, e.search, finalize);
			}
		}).fail(function(e) {
			tuple.ui.status = "failed";
			tuple.ui.update();
			console.error(e);
		});

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
	function extendData(oldItem, newItem) {
		var langCode = $("#setting-language-item").val().toLowerCase();

		// Description
		if(typeof newItem.descriptions[langCode] != "undefined") oldItem.description = newItem.descriptions[langCode].value;

		if(typeof newItem.labels[langCode] != "undefined") oldItem.label = newItem.labels[langCode].value;
	}
}
function validateNumber(i, fallback) {
	return (isNaN(i) ? fallback : i);
}
function _e(text) {
	return $('<div/>').text(text).html();
}
