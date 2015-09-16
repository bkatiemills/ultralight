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
				url+'img/pix1.jpg',
				url+'img/pix2.jpg',
				url+'img/pix3.jpg',
				url+'img/pix4.jpg',
				url+'img/pix5.jpg'
			]
		}
	return {}
}