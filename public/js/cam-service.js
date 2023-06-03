export class CamService {

	cams = [];

	getCamStr(cam) {
		return `${cam.name} | ${cam.tags} | ${cam.geo} | ${cam.pos} | ${cam.src}`;
	}

	removeDeadCams(fixCams) {
		let i = 0;
		while (i < this.cams.length) {
			let isRemoved = false;
			for (const [fixedCamId, fixedCamValues] of Object.entries(fixCams)) {
				if ((this.cams[i].src.includes(fixedCamId) || fixedCamId === this.cams[i].pos) && fixedCamValues._action === 'remove') {
					console.log(`Removed | ${this.getCamStr(this.cams[i])}`);
					this.cams.splice(i, 1);
					isRemoved = true;
					break;
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
				const cam = this.cams[i];
				if ((cam.src.includes(fixedCamId) || fixedCamId === this.cams[i].pos) && fixedCamValues._action !== 'remove') {
					this.cams[i] = {...cam, ...fixedCamValues};
					console.log(`Updated | ${this.getCamStr(this.cams[i])}`);
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
				console.log(`No source | ${this.getCamStr(cam)}`);
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
				console.log(`No position | ${this.getCamStr(cam)}`);
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
			let sameCam = null;
			for (let j = 0; j < i; j++) {
				if (this.cams[i].src === this.cams[j].src) {
					sameCam = this.cams[j];
					break;
				}
			}
			if (sameCam) {
				if (cam.tags !== sameCam.tags) {
					const tagSet = new Set();
					sameCam.tags.split(',').forEach(t => tagSet.add(t));
					cam.tags.split(',').forEach(t => tagSet.add(t));
					sameCam.tags = Array.from(tagSet).join(',');
				}
				if (cam.name !== sameCam.name) {
					if (cam.name.includes(sameCam.name) && cam.name.length > sameCam.name.length) {
						sameCam.name = cam.name;
					} else {
						sameCam.name = `${sameCam.name} / ${cam.name}`;
					}
				}
				console.log(`Duplicated | ${this.getCamStr(cam)}`);
				this.cams.splice(i, 1);
			} else {
				i++;
			}
		}
	}

	init(cams, fixCams) {
		this.cams = cams;
		console.log(`Number of cameras before fix: ${this.cams.length}`);
		this.removeDeadCams(fixCams);
		this.updateCams(fixCams);
		this.removeNoSourceCams();
		this.removeNoPositionCams();
		this.handleDuplicatedCams();
		console.log(`Number of cameras after fix: ${this.cams.length}`);
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
