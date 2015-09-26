function loadCatData(data){

	var url, path, i, pics,
	numcats = parseInt(data['cats']);

	//extract the base URL where this page is found.
	url = window.location.protocol + "//" + window.location.host 
	path = window.location.pathname.split('/').slice(0,-1);
	for(i=0; i<path.length; i++){
		url += path[i] + '/'
	}

	pics = []
	for(i=0; i<numcats; i++){
		pics[pics.length] = url+'img/pix'+(i+1)+'.jpg';
	}
	return {'images': pics}

}