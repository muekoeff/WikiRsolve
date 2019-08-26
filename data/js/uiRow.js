class UiRow {
	constructor(rowIndex, tupleIndex, tuple, status, disambiguation, disambiguationRaw) {
		this.rowIndex = rowIndex;
		this.tupleIndex = tupleIndex;
		this.tuple = tuple;
		if(typeof status != "undefined") this.status = status; else this.status = "pending";
		if(typeof disambiguation != "undefined") this.disambiguation = disambiguation; else this.disambiguation = null;
		if(typeof disambiguationRaw != "undefined") this.disambiguationRaw = disambiguationRaw; else this.disambiguationRaw = null;

		this.disambiguationCell = null;
		this.resultCell = null;
		this.statusCell = null;
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
				output.push(`<span class="${ui.tuple.result == b.id ? "mode-selected" : ""}" title="${b.description || "-"}"><a href="${b.concepturi}" data-item="${b.id}">${getHighlightedWord(b.label, ui.tuple.searchquery)}</a> <small>(<a href="${b.concepturi}" target="_blank">${b.id}</a>, ${b.description || "-"})</small></span>`);
			}
		});
		this.disambiguation = output;

		function getHighlightedWord(word, originalWord) {
			var indexOf = word.toLowerCase().indexOf(originalWord.toLowerCase());
			word = _e(word);
			originalWord = _e(originalWord);
			
			if(indexOf >= 0) {
				return `${word.substr(0, indexOf)}<span class="tool-matchhighlight">${word.substr(indexOf, originalWord.length)}</span>${word.substring(indexOf + originalWord.length)}`;
			} else {
				return word;
			}
		}
	}
	generateRow() {
		this.statusCell = $(`<td><span class="status">${this.status}</span></td>`);
		this.resultCell = $(`<td>${this.tuple.result != null ? `<a href="https://www.wikidata.org/wiki/${this.tuple.result}" target="_blank">${this.tuple.result}</a><small class="tool-candidateremoval">&nbsp;[<a href="#" data-action="remove-candidate">&times;</a>]</small>` : ""}</td>`);
		this.disambiguationCell = $(`<td>${this.disambiguation == null ? "" : this.disambiguation.join("<br/>")}</td>`);

		var $row = $(`<tr class="status-${this.status.replace(/ /g, "-")}" data-rowindex="${this.rowIndex}" data-tupleindex="${this.tupleIndex}"></tr>`);
		$row.append(`<th scope="row">${this.rowIndex + 1}</th>`);
		$row.append(this.statusCell);
		$row.append(`<td>${_e(this.tuple.searchquery)}</td>`);
		$row.append(this.resultCell);
		$row.append(this.disambiguationCell);

		return $row;
	}
	getRow() {
		return $(`tr[data-rowindex='${this.rowIndex}'][data-tupleindex='${this.tupleIndex}']`);
	}
	update() {
		updateDisambiguationCell(this);
		updateResultCell(this);
		updateStatusCell(this);
		this.getRow().removeClass(function(i, className) {
			return (className.match (/(^|\s)status-\S+/g) || []).join(' ');
		});
		this.getRow().addClass(`status-${this.status.replace(/ /g, "-")}`);
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
		function updateDisambiguationCell(uiRow) {
			if(uiRow.disambiguationCell != null) {
				uiRow.disambiguationCell.html(uiRow.disambiguation == null ? "" : uiRow.disambiguation.join("<br/>"));
			}
		}
		function updateResultCell(uiRow) {
			if(uiRow.resultCell != null) {
				uiRow.resultCell.html(uiRow.tuple.result != null ? `<a href="https://www.wikidata.org/wiki/${uiRow.tuple.result}" target="_blank">${uiRow.tuple.result}</a><small class="tool-candidateremoval">&nbsp;[<a href="#" data-action="remove-candidate">&times;</a>]</small>` : "");
			}
		}
		function updateStatusCell(uiRow) {
			if(uiRow.statusCell != null) {
				uiRow.statusCell.find("span").text(uiRow.status);
			}
		}
	}
}