export class CamService {

	cams = [];

	getCams() {
		return this.cams;
	}

	getCamStr(cam) {
		return `${cam.name}${cam.tags ? ' | ' + cam.tags : ''}${cam.ytc ? ' | YTC | ' + cam.ytc : ''}${cam.ytv ? ' | YTV | ' + cam.ytv : ''} | ${cam.geo} | ${cam.pos} | ${cam.src}`;
	}

	removeDeadCams(errCamIds) {
		let i = 0;
		while (i < this.cams.length) {
			let isRemoved = false;
			for (let errCamId of errCamIds) {
				const cam = this.cams[i];
				if (cam.src.includes(errCamId) || errCamId === cam.pos) {
					isRemoved = true;
					//console.log(`Removed | ${this.getCamStr(this.cams[i])}`);
					this.cams.splice(i, 1);
				}
			}
			if (!isRemoved) {
				i++;
			}
		}
	}

	updateCams(fixCams) {
		let i = 0;
		while (i < this.cams.length) {
			for (const [fixedCamId, fixedCamValues] of Object.entries(fixCams)) {
				if (this.cams[i].src.includes(fixedCamId) || this.cams[i].pos === fixedCamId) {
					this.cams[i] = {...this.cams[i], ...fixedCamValues};
					//console.log(`Updated | ${this.getCamStr(this.cams[i])}`);
					break;
				}
			}
			i++;
		}
	}

	removeNoSourceCams() {
		let i = 0;
		while (i < this.cams.length) {
			const cam = this.cams[i];
			if (!cam.src) {
				//console.log(`No source | ${this.getCamStr(cam)}`);
				this.cams.splice(i, 1);
			} else {
				i++;
			}
		}
	}

	removeNoPositionCams() {
		let i = 0;
		while (i < this.cams.length) {
			const cam = this.cams[i];
			if (!cam.pos) {
				//console.log(`No position | ${this.getCamStr(cam)}`);
				this.cams.splice(i, 1);
			} else {
				i++;
			}
		}
	}

	handleDuplicatedCams() {
		let i = 0;
		while (i < this.cams.length) {
			const cam = this.cams[i];
			let prevCam = null;
			for (let j = 0; j < i; j++) {
				if (this.cams[i].src === this.cams[j].src) {
					prevCam = this.cams[j];
					break;
				}
			}
			if (prevCam) {
				if (cam.name !== prevCam.name) {
					if (cam.name.includes(prevCam.name) && cam.name.length > prevCam.name.length) {
						prevCam.name = cam.name;
					} else {
						prevCam.name = `${prevCam.name} / ${cam.name}`;
					}
				}
				if (cam.position && !prevCam.position) {
					prevCam.position = cam.position;
				}
				if (cam.tags !== prevCam.tags) {
					const tagSet = new Set();
					prevCam.tags.split(',').forEach(t => tagSet.add(t));
					cam.tags.split(',').forEach(t => tagSet.add(t));
					prevCam.tags = Array.from(tagSet).join(',');
				}
				//console.log(`Duplicated | ${this.getCamStr(cam)}`);
				this.cams.splice(i, 1);
			} else {
				i++;
			}
		}
	}

	addYouTubeIds() {
		this.cams.forEach(cam => {
			let match = /(^https:\/\/www\.youtube\.com\/embed\/live_stream\?channel=)([0-9a-zA-Z_-]*)/.exec(cam.src);
			if (match && match[2]) {
				cam.ytc = match[2];
				//console.log(`YT channel | ${this.getCamStr(cam)}`);
			} else {
				match = /(^https:\/\/www\.youtube\.com\/embed\/)([0-9a-zA-Z_-]*)/.exec(cam.src);
				if (match && match[2]) {
					cam.ytv = match[2];
					//console.log(`YT video | ${this.getCamStr(cam)}`);
				}
			}
		});
	}

	init(cams, errCamIds, fixCams) {
		this.cams = cams;
		console.log(`All cameras: ${this.cams.length}`);
		this.removeDeadCams(errCamIds);
		this.updateCams(fixCams);
		this.handleDuplicatedCams();
		this.removeNoSourceCams();
		this.removeNoPositionCams();
		this.addYouTubeIds();
		console.log(`Valid cameras: ${this.cams.length}`);
	}

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
		frElm.setAttribute('title', 'Video player frame');
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
		cams.forEach(cam => {
			let src = this.addSrcQueryParams(cam.src);
			const frElm = this.createCameraFrame(src);
			mainElm.appendChild(frElm);
		});
	}

}
