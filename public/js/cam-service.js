export class CamService {

	getCamStr(cam) {
		return `${cam.name} | ${cam.tags} | ${cam.geo} | ${cam.pos} | ${cam.src}`;
	}

	fixCameraList(wctCams, fixCams) {
		console.log(`Number of cameras before fix: ${wctCams.length}`);
		let i;

		i = 0;
		while (i < wctCams.length) {
			let isRemoved = false;
			for (const [fixedCamId, fixedCamValues] of Object.entries(fixCams)) {
				if ((wctCams[i].src.includes(fixedCamId) || fixedCamId === wctCams[i].pos) && fixedCamValues._action === 'remove') {
					console.log(`Removed | ${this.getCamStr(wctCams[i])}`);
					wctCams.splice(i, 1);
					isRemoved = true;
					break;
				}
			}
			if (!isRemoved) {
				i++;
			}
		}

		i = 0;
		while (i < wctCams.length) {
			for (const [fixedCamId, fixedCamValues] of Object.entries(fixCams)) {
				const cam = wctCams[i];
				if ((cam.src.includes(fixedCamId) || fixedCamId === wctCams[i].pos) && fixedCamValues._action !== 'remove') {
					wctCams[i] = {...cam, ...fixedCamValues};
					console.log(`Fixed | ${this.getCamStr(wctCams[i])}`);
					break;
				}
			}
			i++;
		}

		i = 0;
		while (i < wctCams.length) {
			const cam = wctCams[i];
			if (!cam.src) {
				console.log(`No source | ${this.getCamStr(cam)}`);
				wctCams.splice(i, 1);
			} else {
				i++;
			}
		}

		i = 0;
		while (i < wctCams.length) {
			const cam = wctCams[i];
			if (!cam.pos) {
				console.log(`No location | ${this.getCamStr(cam)}`);
				wctCams.splice(i, 1);
			} else {
				i++;
			}
		}

		i = 0;
		while (i < wctCams.length) {
			const cam = wctCams[i];
			let sameCam = null;
			for (let j = 0; j < i; j++) {
				if (wctCams[i].src === wctCams[j].src) {
					sameCam = wctCams[j];
					break;
				}
			}
			if (sameCam) {
				if (sameCam.tags.length < cam.tags.length) {
					sameCam.tags = cam.tags;
				}
				if (sameCam.name !== cam.name) {
					sameCam.name = `${sameCam.name} / ${cam.name}`;
				}
				console.log(`Duplicated | ${this.getCamStr(cam)}`);
				wctCams.splice(i, 1);
			} else {
				i++;
			}
		}

		console.log(`Number of cameras after fix: ${wctCams.length}`);
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
