ul = new ultralight()

function ultralight(){
	this.parseHash = function(){
		// split the url hash up into an array of strings.
		// if there's no hash, return an empty array.
	    var elts, hash;

	    hash = window.location.hash;
	    hash = hash.slice(1,hash.length)

	    if(hash){
	        elts = hash.split('/')
	    } else
	        elts = []

	    return elts
	}

	this.matchRoute = function(hashArray){
		//given the URL hash as an array, return the corresponding value from ul.routes
		var key, auxkey, route, template, data, auxdata, html;

		for(key in ul.routes){
			route = key.split('/')
			routeData = this.compareRoutes(hashArray, route)
			if(routeData){

				//add additional data to the view as neessary:
				if (typeof ulAuxilaryData === "function"){
					auxdata = ulAuxilaryData(key, routeData)
					for(auxkey in auxdata){
						routeData[auxkey] = auxdata[auxkey]
					}
				}

				//render template
				template = document.getElementById(ul.routes[key]).innerHTML;
				html = Mustache.to_html(template, routeData, ul.partials);
				document.getElementById('content').innerHTML += html;
				return 0;
			}

		}
		return 404;
	}

	this.compareRoutes = function(hash, route){
		//helper for comparing route arrays. hash is from the url hash, route is from ul.routes

		var key,
			data = {}

	 	if (hash == null || route == null) return false;
		if (hash.length != route.length) return false;

		for (var i = 0; i < hash.length; ++i) {
			// deal with variable routes
			if(route[i].slice(0,2) == '{{'){
				key = route[i].substring(2, route[i].length - 2);
				data[key] = hash[i];
				continue;
			} else if (hash[i] !== route[i])
				return false;
		}
		return data;
	}

	this.loadJSON = function(callback, file) {   
		// pull in some json, thx http://codepen.io/KryptoniteDove/blog/load-json-file-locally-using-pure-javascript
	    var xobj = new XMLHttpRequest();
	        xobj.overrideMimeType("application/json");
	    xobj.open('GET', file, true);
	    xobj.onreadystatechange = function () {
	          if (xobj.readyState == 4 && xobj.status == "200") {
	            callback(xobj.responseText);
	          }
	    };
	    xobj.send(null);  
	}

	// pull in templates
	this.loadJSON(function(response) {
    	this.routes = JSON.parse(response);
	}.bind(this), 'data/routes.json');

	// pull in partials
	this.loadJSON(function(response) {
    	this.partials = JSON.parse(response);
	}.bind(this), 'data/partials.json');	

}

window.onload = function(){
	var key, hash;

	//set up partials
	for(key in ul.partials){
		ul.partials[key] = document.getElementById(key).innerHTML
	}

	//render the route and report status in the console.
	hash = ul.parseHash()
	console.log(ul.matchRoute(hash))
}

window.onhashchange = function(){
	// since we're using hashes like full-fledged routes.
	location.reload(false)
}