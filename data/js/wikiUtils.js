class WikiUtils {
	static getHost(name) {
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
}