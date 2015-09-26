function ultralight(partials){
	var i;

	if(partials.constructor === Array){
		this.partials = partials;
	} else{
		this.partials = [];
	}

	this.parseQuery = function(){
		//return an object with keys/values as per query string
		//note all values will be strings.

		var queryString = window.location.search.substring(1);
		var elts = {};
		var value, i;

		queryString = queryString.split('&');
		for(i=0; i<queryString.length; i++){
			value = queryString[i].split('=');
			elts[value[0]] = value[1];
		}

		return elts;

	}

	this.matchQuery = function(){
		//given the URL query as an object, render the appropriate templates
		var auxdata, auxkey, 
			queryData = this.parseQuery();

		//add additional data as necessary
		if(typeof ulAuxilaryData === 'function'){
			auxdata = ulAuxilaryData(queryData)

			for(auxkey in auxdata){
				queryData[auxkey] = auxdata[auxkey];
			}
		}

		//render template
		template = document.getElementById('body').innerHTML;
		html = Mustache.to_html(template, queryData, ul.partials);
		//body = document.createElement('body'); //see #4
		//document.getElementsByTagName('body')[0].appendChild(body);
		document.body.innerHTML += html;
		return 0;

	}

	this.promisePartials = function(){
		// pull in all partials async, by the power of promises

		var sequence = Promise.resolve();

		sequence.then(function(){
			return Promise.all(ul.partials.map(ulUtilGet))
		}).then(function(partials){
			for(i=0; i<partials.length; i++){
				partial = document.createElement('script');
				partial.setAttribute('type', 'text/template');
				partial.setAttribute('id', ul.partials[i]);
				partial.innerHTML = partials[i]
				document.getElementsByTagName('head')[0].appendChild(partial);

			}

		}).then(function() {
			var i, key, hash, query, partials = {};

			//set up partials
			for(i=0; i<ul.partials.length; i++){
				partials[ul.partials[i]] = document.getElementById(ul.partials[i]).innerHTML;
			}
			ul.partials = partials;

			//render the route
			ul.matchQuery();
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