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

		route = document.getElementById('body').getAttribute('route');
		routeArray = route.split('/');
		routeData = this.compareRoutes(hashArray, routeArray)

		if(routeData){

			//add additional data to the view as neessary:
			if (typeof ulAuxilaryData === "function"){
				auxdata = ulAuxilaryData(route, routeData)
				for(auxkey in auxdata){
					routeData[auxkey] = auxdata[auxkey]
				}
			}

			//render template
			template = document.getElementById('body').innerHTML;
			html = Mustache.to_html(template, routeData, ul.partials);
			document.getElementById('content').innerHTML += html;
			return 0;
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

}

window.onload = function(){
	var i, key, hash, partials = {};

	//set up partials
	for(i=0; i<ul.partials.length; i++){
		partials[ul.partials[i]] = document.getElementById(ul.partials[i]).innerHTML
	}
	ul.partials = partials

	//render the route and report status in the console.
	hash = ul.parseHash()
	console.log(ul.matchRoute(hash))
}

window.onhashchange = function(){
	// since we're using hashes like full-fledged routes.
	location.reload(false)
}