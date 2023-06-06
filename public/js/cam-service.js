import { FixService } from './fix-service.js';

export class CamService {

	cams = [];

	getCams() {
		return this.cams;
	}

	init(wctCams, addCams, remCams, updCams) {
		const fixService = new FixService();
		this.cams = fixService.fix(wctCams, addCams, remCams, updCams);
	}

	addSrcQueryParams(src) {
		const srcLocation = src.split('?')[0];
		const srcQuery = src.replace(srcLocation, '').replace('?', '');
		const urlParams = new URLSearchParams(srcQuery);
		if (src.includes('youtube.com')) {
			urlParams.set('autoplay', '1');
			urlParams.set('mute', '1');
			urlParams.set('vq', 'hd1080');
		} else if (src.includes('livestream.com')) {
			urlParams.set('mute', 'true');
		}
		return srcLocation + '?' + urlParams.toString();
	}

	createCameraFrame(name, geo, pos, src, isLarge) {
		const frElm = document.createElement('iframe');
		frElm.setAttribute('cam-name', name);
		frElm.setAttribute('cam-geo', geo);
		frElm.setAttribute('cam-pos', pos);
		frElm.setAttribute('src', src);
		frElm.setAttribute('width', isLarge ? '950': '475');
		frElm.setAttribute('height', isLarge ? '534' : '267');
		frElm.setAttribute('title', name);
		frElm.setAttribute('frameborder', '0');
		frElm.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
		frElm.setAttribute('allowfullscreen', 'true');
		return frElm;
	}

	displayLiveCams(cams) {
		const mainElm = document.getElementById('main');
		const mapElm = document.getElementById('map');
		mainElm.replaceChildren();
		mainElm.appendChild(mapElm);
		cams.forEach((cam, i) => {
			let src = this.addSrcQueryParams(cam.src);
			const frElm = this.createCameraFrame(cam.name, cam.geo, cam.pos, src, i === 0);
			mainElm.appendChild(frElm);
		});
	}

}
