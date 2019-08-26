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
		$("#setting-disambiguation-matchhighlight").change(function(e) {
			if(this.checked) {
				Settings.enableConditionalStyle("disambiguation-matchhighlight", `.tool-matchhighlight {
					background-color: rgba(255,255,0,.8);
				}`);
			} else {
				Settings.disableConditionalStyle("disambiguation-matchhighlight");
			}
		});

		$("#setting-candidateremoval").change();
		$("#setting-disambiguation-matchhighlight").change();
	}
	static disableConditionalStyle(name) {
		var element = $(`style[data-setting='${name}']`);
		if(element.length != 0) element.remove();
	}
	static enableConditionalStyle(name, style) {
		if($(`style[data-setting='${name}']`).length == 0) $("head").append(`<style data-setting="${name}">${style}</style>`);
	}
	static export() {
		var settings = {
			"candidateremoval": $("#setting-candidateremoval").is(":checked"),
			"disambiguation-candidatesnumber": $("#setting-disambiguation-candidatesnumber").val(),
			"disambiguation-matchhighlight": $("#setting-disambiguation-matchhighlight").is(":checked"),
			"language-item": $("#setting-language-item").val(),
			"language-search": $("#setting-language-search").val()
		};
		return settings;
	}
	static initialize() {
		$("#button-settings-geturl").click(function(e) {
			e.preventDefault();
			if($("#button-settings-geturl").hasClass("mode-ready")) {
				window.location.search = `?settings=${encodeURIComponent(JSON.stringify(Settings.export()))}`;
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
		});
		$("#button-settings-save").click(function(e) {
			e.preventDefault();
			localStorage.setItem('wikiRsolve.settings', JSON.stringify(Settings.export()));
			$("#button-settings-save").tooltipster({
				content: "Saved!",
				side: "left",
				theme: ["tooltipster-light", "tooltipster-success"],
				timer: 10000,
				trigger: "custom"
			}).tooltipster("open");
		});

		Settings.loadLanguages();
		Settings.load();
		Settings.attachLiveHandler();
	}
	static load() {
		var localstorageSettings = localStorage.getItem("wikiRsolve.settings");
		if(localstorageSettings != null) {
			try {
				apply(JSON.parse(localstorageSettings));
			} catch(ex) {
				console.warn(ex);
			}
		}

		var query = (new URL(window.location.href)).searchParams.get("settings");
		if(query != null) {
			try {
				apply(JSON.parse(query));
			} catch(ex) {
				console.warn(ex);
			}
		}

		function apply(settings) {
			assign(settings, "candidateremoval", x => $("#setting-candidateremoval").prop("checked", x));
			assign(settings, "disambiguation-candidatesnumber", x => $("#setting-disambiguation-candidatesnumber").val(x));
			assign(settings, "disambiguation-matchhighlight", x => $("#setting-disambiguation-matchhighlight").prop("checked", x));
			assign(settings, "language-item", x => $("#setting-language-item").val(x));
			assign(settings, "language-search", x => $("#setting-language-search").val(x));
		}
		function assign(settings, key, assignFunction) {
			if(typeof settings[key] != "undefined") assignFunction(settings[key]);
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