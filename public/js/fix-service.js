export class FixService {

	getCamStr(cam) {
		return `${cam.name}${cam.tags ? ' | ' + cam.tags : ''} | ${cam.geo} | ${cam.pos} | ${cam.src} | ${cam.id}`;
	}

	addCams(cams, addCams) {
		addCams.forEach(cam => {
			//console.log(`Added | ${this.getCamStr(cam)}`);
			cams.push(cam);
		})
	}

	removeCams(cams, unwantedCams) {
		if (unwantedCams.length === 0) {
			return;
		}
		let i = 0;
		while (i < cams.length) {
			if (unwantedCams.find(e => cams[i].src.includes(e))) {
				//console.log(`Removed | ${this.getCamStr(cams[i])}`);
				cams.splice(i, 1);
			} else {
				i++;
			}
		}
	}

	updateCams(cams, updCams) {
		if (updCams.length === 0) {
			return;
		}
		let i = 0;
		while (i < cams.length) {
			for (const [updCamId, updCamValues] of Object.entries(updCams)) {
				if (cams[i].src.includes(updCamId) || cams[i].pos === updCamId) {
					cams[i] = {...cams[i], ...updCamValues};
					//console.log(`Updated | ${this.getCamStr(cams[i])}`);
					break;
				}
			}
			i++;
		}
	}

	removeNoSourceCams(cams) {
		let i = 0;
		while (i < cams.length) {
			const cam = cams[i];
			if (!cam.src) {
				//console.log(`No source | ${this.getCamStr(cam)}`);
				cams.splice(i, 1);
			} else {
				i++;
			}
		}
	}

	removeNoPositionCams(cams) {
		let i = 0;
		while (i < cams.length) {
			const cam = cams[i];
			if (!cam.pos) {
				//console.log(`No position | ${this.getCamStr(cam)}`);
				cams.splice(i, 1);
			} else {
				i++;
			}
		}
	}

	handleClonedCams(cams) {
		let i = 0;
		while (i < cams.length) {
			const cam = cams[i];
			let prevCam = null;
			for (let j = 0; j < i; j++) {
				if (cams[i].src && cams[i].src === cams[j].src) {
					prevCam = cams[j];
					break;
				}
			}
			if (prevCam) {
				//console.log(`Clone1 | ${this.getCamStr(prevCam)}`);
				//console.log(`Clone2 | ${this.getCamStr(cam)}`);
				if (cam.name !== prevCam.name) {
					if (cam.name.includes(prevCam.name) && cam.name.length > prevCam.name.length) {
						prevCam.name = cam.name;
					} else {
						prevCam.name = `${prevCam.name} / ${cam.name}`;
					}
				}
				if (cam.tags !== prevCam.tags) {
					const tagSet = new Set();
					prevCam.tags.split(',').forEach(t => tagSet.add(t));
					cam.tags.split(',').forEach(t => tagSet.add(t));
					prevCam.tags = Array.from(tagSet).join(',');
				}
				if (cam.position && !prevCam.position) {
					prevCam.position = cam.position;
				}
				cams.splice(i, 1);
			} else {
				i++;
			}
		}
	}

	addIds(cams) {
		cams.forEach(cam => {
			let found = false;
			let match = /(^https:\/\/www\.youtube\.com\/embed\/live_stream\?channel=)([0-9a-zA-Z_-]*)/.exec(cam.src);
			if (match && match[2]) {
				cam.id = match[2];
				found = true;
			}
			if (!found) {
				match = /(^https:\/\/www\.youtube\.com\/embed\/)([0-9a-zA-Z_-]*)/.exec(cam.src);
				if (match && match[2]) {
					cam.id = match[2];
					found = true;
				}
			}
			if (!found) {
				match = /(^https:\/\/)(\S*)/.exec(cam.src);
				if (match && match[2]) {
					cam.id = match[2];
					found = true;
				}
			}
			if (!found) {
				cam.id = cam.src;
			}
			//console.log(`Add ID | ${this.getCamStr(cam)}`);
		});
	}

	leaveOnlyYouTubeCams(cams) {
		let i = 0;
		while (i < cams.length) {
			if (cams[i].src.includes('youtube.com')) {
				i++;
			} else {
				cams.splice(i, 1);
			}
		}
	}

	randomizeOrder(cams) {
		let currentIndex = cams.length;
		let randomIndex;
		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[cams[currentIndex], cams[randomIndex]] = [cams[randomIndex], cams[currentIndex]];
		}
	}

	fix(wctCams, errCams, remCams, addCams, updCams, onlyYouTube, randomOrder) {
		const cams = [...wctCams];
		console.log(`WCT:${wctCams.length}, Err:${addCams.length}, Remove:${remCams.length}, Add:${addCams.length}, Update:${Object.keys(updCams).length}`);
		this.removeCams(cams, [...errCams, ...remCams]);
		this.addCams(cams, addCams);
		this.updateCams(cams, updCams);
		this.handleClonedCams(cams);
		this.removeNoSourceCams(cams);
		this.removeNoPositionCams(cams);
		this.addIds(cams);
		if (onlyYouTube) {
			this.leaveOnlyYouTubeCams(cams);
		}
		if (randomOrder) {
			this.randomizeOrder(cams);
		}
		console.log(`Valid cameras: ${cams.length}`);
		return cams;
	}

}
