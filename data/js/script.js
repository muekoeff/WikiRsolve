var elements;
var requestManager = new RequestManager();

jQuery(document).ready(function($) {
	$("#button-copy").click(function(e) {
		e.preventDefault();
		Utils.copyTextToClipboard($("#output").val());
	});
	$("#button-copyquickstatements").click(function(e) {
		e.preventDefault();
		Utils.copyTextToClipboard($("#output").val());
		window.open("https://tools.wmflabs.org/quickstatements/");
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
	// @source https://sumtips.com/snippets/javascript/tab-in-textarea/#jq
	$("#commands").keydown(function(e) {
		if(e.keyCode === 9) { // tab was pressed
			// get caret position/selection
			var start = this.selectionStart;
			var end = this.selectionEnd;
	
			var $this = $(this);
			$this.val(`${$this.val().substring(0, start)}\t${$this.val().substring(end)}`);
			this.selectionStart = this.selectionEnd = start + 1;
			return false;
		}
	});
	$("#statusfilter").on("changed.bs.select", function(e, clickedIndex, isSelected, previousValue) {
		e.preventDefault();
		updateFilter();
	})

	Settings.initialize();
	updateFilter();
	setupExample();

	function setupExample() {
		var samples = [
			"Berlin|Q|P17=Q30\nBremen||P17=Q30\nHamburg||P17=Q30\nManheim||P17=Q30\nStuttgart||P17=Q30",
			"Saransk|Q|^dewikivoyage\nSekretaj Sonetoj||^eowikisource\nSlavery||^commonswiki\nSphaleron||^dewiki\nSupernatural||^frwikiquote"
		];
		var sample = samples[Math.floor(Math.random()*samples.length)];
		$("#commands").attr("placeholder", sample);
		$("#button-copyexample").click(function(e) {
			e.preventDefault();
			if($(this).hasClass("tooltipstered")) $(this).tooltipster("destroy");
			if($("#commands").val() == "") {
				$("#commands").val(sample);
				$(this).tooltipster({
					content: `All ready! Now press that "Parse" button to the left and then "Request"`,
					functionAfter: function() {
						$("#button-copyexample").addClass("btn-light").removeClass("btn-success");
					},
					functionBefore: function() {
						$("#button-copyexample").addClass("btn-success").removeClass("btn-danger btn-light");
					},
					theme: ["tooltipster-light", "tooltipster-success"],
					timer: 10000,
					trigger: "custom"
				}).tooltipster("open");
			} else {
				$(this).tooltipster({
					content: $(`<span>Please clear your entered commands first.<br/><small>Just to make sure you didn't accidentially press this button.</small></span>`),
					functionAfter: function() {
						$("#button-copyexample").addClass("btn-light").removeClass("btn-danger");
					},
					functionBefore: function() {
						$("#button-copyexample").addClass("btn-danger").removeClass("btn-light");
					},
					theme: ["tooltipster-light", "tooltipster-error"],
					timer: 10000,
					trigger: "custom"
				}).tooltipster("open");
			}
		});
	}
	function updateFilter() {
		var selected = $("#statusfilter").val();
		$("#statusfilter option").each(function(i, val) {
			var statusLabel = $(this).attr("value");
			if(selected.includes(statusLabel)) {
				Settings.disableConditionalStyle(`statusfilter-${statusLabel}`);
			} else {
				Settings.enableConditionalStyle(`statusfilter-${statusLabel}`, `.status-${statusLabel.replace(/ /g, "-")} {
					display: none;
				}`);
			}
		});
	}
});

function extendData(oldItem, newItem) {
	var langCode = $("#setting-language-item").val().toLowerCase();

	if(typeof newItem.descriptions[langCode] != "undefined") oldItem.description = newItem.descriptions[langCode].value;
	if(typeof newItem.labels[langCode] != "undefined") oldItem.label = newItem.labels[langCode].value;
}
function generateOutput(elements) {
	var rows = [];
	var rows_failed = [];
	$.each(elements, function(rowIndex, row) {
		var tuples = [];
		var failed = false;
		$.each(row, function(tupleIndex, tuple) {
			if(typeof tuple == "string") {
				tuples.push(tuple.substring(1));
			} else {
				if(tuple.result != null) {
					tuples.push(tuple.result);
				} else {
					tuples.push(tuple.searchquery);
					failed = true;
				}
			}
		});
		if(failed) {
			rows_failed.push(tuples.join("\t"));
		} else {
			rows.push(tuples.join("\t"));
		}
	});
	var output = rows.join("\n");
	$("#output").val(output);
	$("#output-failed").val(rows_failed.join("\n"));
	$("#button-copy").removeAttr("disabled");
	$("#button-copyquickstatements").removeAttr("disabled");
	$("#button-result-tools").removeAttr("disabled");
	// Display WikiCompare-button only if list of Wikidata IDs
	if(/^Q[0-9]+(\nQ[0-9]+)*$/.test(output)) {
		$("#button-wikicompare").attr("href", `https://nw520.github.io/WikiCompare/?f&r&i=${encodeURIComponent(rows.join(","))}`).show();
	} else {
		$("#button-wikicompare").hide();
	}
}
function generateTable(elements) {
	if(elements.length > 0) {
		$("#table-output tbody").html("");

		$.each(elements, function(rowIndex, row) {
			if(row != null) {
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

	function parseItem(tuple) {
		if(tuple.startsWith("$")) {
			return tuple;
		} else {
			var parts = tuple.split("|");
			if(parts.length == 3) {
				var tuple = new Tuple(parts[0], parts[1], Condition.parse(parts[2]));
				if(tuple.validate()) return tuple;
			} else if(parts.length == 2) {
				var tuple = new Tuple(parts[0], parts[1]);
				if(tuple.validate()) return tuple;
			} else if(parts.length == 1) {
				var tuple = new Tuple(parts[0]);
				if(tuple.validate()) return tuple;
			}
		}
	}
	function parseRow(row) {
		if(row === "") {
			return null;
		} else {
			var items = [];
			$.each(row.split("\t"), function(a, b) {
				var parse = parseItem(b);
				if(typeof parse != "undefined" && parse !== null) items.push(parse);
			});
			return items;
		}
	}
}
function request() {
	$.each(elements, function(rowIndex, row) {
		$.each(row, function(tupleIndex, tuple) {
			if(typeof tuple != "string") requestManager.enqueueRequest(tuple, rowIndex, tupleIndex);
		});
	});
}