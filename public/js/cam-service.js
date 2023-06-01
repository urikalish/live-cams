export class CamService {

	addSrcQueryParams(src) {
		const srcLocation = src.split('?')[0];
		const srcQuery = src.replace(srcLocation, '').replace('?', '');
		const urlParams = new URLSearchParams(srcQuery);
		if (src.includes('youtube.com')) {
			urlParams.set('vq', 'hd1080');
		}
		urlParams.set('autoplay', '1');
		urlParams.set('mute', '1');
		return srcLocation + '?' + urlParams.toString();
	}

	createCameraFrame(src) {
		const frElm = document.createElement('iframe');
		frElm.setAttribute('src', src);
		frElm.setAttribute('width', '950');
		frElm.setAttribute('height', '534');
		frElm.setAttribute('title', 'YouTube video player');
		frElm.setAttribute('frameborder', '0');
		frElm.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
		frElm.setAttribute('allowfullscreen', 'true');
		return frElm;
	}

	displayLiveCam(cam) {
		const mainElm = document.getElementById('main');
		const mapElm = document.getElementById('map');
		mainElm.replaceChildren();
		mainElm.appendChild(mapElm);
		let src = this.addSrcQueryParams(cam.src);
		const frElm = this.createCameraFrame(src);
		mainElm.appendChild(frElm);
	}
}
