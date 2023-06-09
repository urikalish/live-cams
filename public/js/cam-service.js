import { FixService } from './fix-service.js';

export class CamService {

	cams = [];

	getCams() {
		return this.cams;
	}

	init(wctCams, errCams, remCams, addCams, updCams) {
		const fixService = new FixService();
		this.cams = fixService.fix(wctCams, errCams, remCams, addCams, updCams);
	}

	addSrcQueryParams(src, autoPlay) {
		const srcLocation = src.split('?')[0];
		const srcQuery = src.replace(srcLocation, '').replace('?', '');
		const urlParams = new URLSearchParams(srcQuery);
		if (src.includes('youtube.com')) {
			urlParams.set('autoplay', autoPlay ? '1' : '0');
			urlParams.set('mute', '1');
			urlParams.set('vq', 'hd1080');
		} else if (src.includes('livestream.com')) {
			urlParams.set('mute', 'true');
		}
		return srcLocation + '?' + urlParams.toString();
	}

	createCamView(cam, isLarge, autoPlay) {
		const width = isLarge ? 950: 475;
		const height = isLarge ? 534 : 267;
		const src = this.addSrcQueryParams(cam.src, autoPlay);

		const wrapperElm = document.createElement('div');
		wrapperElm.classList.add('cam-container');
		if (isLarge) {
			wrapperElm.classList.add('cam-container--large');
		}
		wrapperElm.setAttribute('id', cam.id);
		wrapperElm.setAttribute('name', cam.name);
		wrapperElm.setAttribute('geo', cam.geo);
		wrapperElm.setAttribute('pos', cam.pos);
		wrapperElm.setAttribute('tags', cam.tags);
		wrapperElm.setAttribute('src', src);
		wrapperElm.style['width'] = width + 'px';
		wrapperElm.style['height'] = height + 'px';

		const frElm = document.createElement('iframe');
		frElm.setAttribute('src', src);
		frElm.setAttribute('width', '' + width);
		frElm.setAttribute('height', '' + height);
		frElm.setAttribute('title', name);
		frElm.setAttribute('frameborder', '0');
		frElm.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
		frElm.setAttribute('allowfullscreen', 'true');
		wrapperElm.appendChild(frElm);

		if (cam.id) {
			const buttonElm = document.createElement('button');
			buttonElm.textContent = '';
			buttonElm.classList.add('info-btn');
			buttonElm.addEventListener('click', () => {
				console.log(cam.id);
				navigator.clipboard.writeText(cam.id).then(() => {});
			})
			wrapperElm.appendChild(buttonElm);
		}

		return wrapperElm;
	}

	displayLiveCams(cams, autoPlay) {
		const mainElm = document.getElementById('main');
		const mapElm = document.getElementById('map');
		mainElm.replaceChildren();
		mainElm.appendChild(mapElm);
		cams.forEach((cam, i) => {
			const frElm = this.createCamView(cam, i === 0, autoPlay);
			mainElm.appendChild(frElm);
		});
	}

	displayAllErrCams(wctCams, errCams, remCams, addCams, updCams) {
		this.init(wctCams, [], remCams, addCams, updCams);
		const unwantedCams = [];
		const allCams = this.cams;
		errCams.forEach(unwantedCam => {
			const cam = allCams.find(cam => cam.src.includes(unwantedCam));
			if (cam) {
				unwantedCams.push(cam);
				console.log(cam.name);
			} else {
				console.log(`Unwanted cam not found in cam list: ${unwantedCam}`);
			}
		});
		this.cams = unwantedCams;
		this.displayLiveCams(unwantedCams, false);
	}

	// async checkYouTubeCams(wctCams, errCams, remCams, addCams, updCams) {
	// 	this.init(wctCams, errCams, remCams, addCams, updCams);
	// 	const ytCams = [];
	// 	this.cams.forEach(cam => {
	// 		if (cam.src?.includes('youtube.com')) {
	// 			ytCams.push(cam);
	// 		}
	// 	})
	// 	ytCams.length = 1;
	// 	for (let cam of ytCams) {
	// 		let src = this.addSrcQueryParams(cam.src, false);
	// 		const res = await fetch(src, {
	// 			mode: 'no-cors',
	// 			headers: {'Access-Control-Allow-Origin': '*'}
	// 		});
	// 		const htmlString = await res.text();
	// 		const parser = new DOMParser();
	// 		const doc = parser.parseFromString(htmlString, 'text/html');
	// 		if (doc.querySelector('.ytp-error')) {
	// 			console.log(`Youtube N/A: ${cam.src}`);
	// 		} else {
	// 			console.log(`OK`);
	// 		}
	// 	}
	// }

}
