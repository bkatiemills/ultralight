function ulAuxilaryData(route, data){

	var url, path, i;

	url = window.location.protocol + "//" + window.location.host + "/" 
	path = window.location.pathname.split('/').slice(0,-1);
	for(i=0; i<path.length; i++){
		url += path[i] + '/'
	}


	if(route == "{{cats}}")
		return {'images': 
			[
				url+'img/pix1',
				url+'img/pix2',
				url+'img/pix3',
				url+'img/pix4',
				url+'img/pix5'
			]
		}
	return {}
}