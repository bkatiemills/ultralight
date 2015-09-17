function ultralight(partials){
	var i;
 
	this.partials = partials ? partials : [];

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
			body = document.createElement('body');
			document.getElementsByTagName('body')[0].appendChild(body);
			document.body.innerHTML += html;
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

	this.promisePartials = function(){
		// pull in all partials async, by the power of promises

		sequence = Promise.resolve();

		sequence.then(function(x){
			return Promise.all(this.partials.map(ulUtilGet))
		}).then(function(partials){

			for(i=0; i<partials.length; i++){
				partial = document.createElement('script');
				partial.setAttribute('type', 'text/template');
				partial.setAttribute('id', this.partials[i]);
				partial.innerHTML = partials[i]
				document.getElementsByTagName('head')[0].appendChild(partial);

			}

		}).then(function() {
			var i, key, hash, partials = {};

			//set up partials
			for(i=0; i<ul.partials.length; i++){
				partials[ul.partials[i]] = document.getElementById(ul.partials[i]).innerHTML;
			}
			ul.partials = partials;

			//render the route and report status in the console.
			hash = ul.parseHash()
			console.log(ul.matchRoute(hash))
		}).then(function(){
			//allow a post-rendering callback
			if(typeof ulCallback === "function"){
				ulCallback();
			}
		});
	}

	this.promisePartials()

}

function ulUtilGet(name) {
	// promise to get tempate <name>; thanks http://www.html5rocks.com/en/tutorials/es6/promises/
	var rootURL, path;

	rootURL = window.location.protocol + "//" + window.location.host;
	path = window.location.pathname.split('/').slice(0,-1);
	for(i=0; i<path.length; i++){
		rootURL += path[i] + '/'
	}

	url = rootURL + 'partials/' + name + '.mustache';

	// Return a new promise.
 	return new Promise(function(resolve, reject) {
		// Do the usual XHR stuff
    	var req = new XMLHttpRequest();
    	req.open('GET', url);

    	req.onload = function() {
      		// This is called even on 404 etc
      		// so check the status
      		if (req.status == 200) {
        		// Resolve the promise with the response text
        		resolve(req.response);
      		}
      		else {
        		// Otherwise reject with the status text
        		// which will hopefully be a meaningful error
        		reject(Error(req.statusText));
      		}
    	};

	    // Handle network errors
	    req.onerror = function() {
    		reject(Error("Network Error"));
    	};

	    // Make the request
	    req.send();
  	});
}

window.onhashchange = function(){
	// since we're using hashes like full-fledged routes.
	location.reload(false)
}