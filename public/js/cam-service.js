export class CamService {

	createYouTubeFrame(cam) {
		const frElm = document.createElement('iframe');
		frElm.setAttribute('src', `https://www.youtube.com/embed/${cam.id}?vq=hd1080&autoplay=1&mute=1`);
		frElm.setAttribute('width', '950');
		frElm.setAttribute('height', '534');
		frElm.setAttribute('title', 'YouTube video player');
		frElm.setAttribute('frameborder', '0');
		frElm.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
		frElm.setAttribute('allowfullscreen', 'true');
		return frElm;
	}

	displayLiveCams(cams, locationId) {
		const location = cams.find(l => l.id === locationId);
		if (!location) {
			return;
		}
		const mainElm = document.getElementById('main');
		const mapElm = document.getElementById('map');
		mainElm.replaceChildren();
		mainElm.appendChild(mapElm);
		location.cams.forEach(cam => {
			const frElm = this.createYouTubeFrame(cam);
			mainElm.appendChild(frElm);
		});
	}
}