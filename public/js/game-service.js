export class GameService {

	mapService = null;
	camService = null;
	cam = null;
	gamePanelElm = null;
	locationMessageElm = null;
	distanceMessageElm = null;
	nextButtonElm = null;
	waitingForGuess = true;
	waitingForGuessStartTime = 0;

	addCoverElm() {
		const containerElm = document.querySelector('.cam-container');
		const coverElm = document.createElement('div');
		coverElm.setAttribute('id', 'cam-cover');
		coverElm.classList.add('cam-cover');
		coverElm.textContent = '?';
		containerElm.appendChild(coverElm);
	}

	startUserGuess() {
		this.nextButtonElm.classList.toggle('hidden', true);
		this.mapService.clearGuess();
		const cams = this.camService.getCams();
		const index = Math.trunc(Math.random()*cams.length);
		this.cam = cams[index];
		this.camService.displayLiveCams([this.cam], true);
		this.addCoverElm();
		this.locationMessageElm.textContent = '';
		this.distanceMessageElm.textContent = '';
		this.waitingForGuessStartTime = Date.now();
		this.waitingForGuess = true;
	}

	async handleGuess(guessLat, guessLng) {
		if (!this.waitingForGuess || (Date.now() - this.waitingForGuessStartTime < 2000)) {
			return;
		}
		this.waitingForGuess = false;
		this.locationMessageElm.textContent = `${this.cam.name} ${this.cam.geo}`;
		const trueLat = Number.parseFloat(this.cam.pos.split(',')[0]);
		const trueLng = Number.parseFloat(this.cam.pos.split(',')[1]);
		const distance = await this.mapService.displayGuess(guessLat, guessLng, trueLat, trueLng);
		if (distance >= 10000) {
			this.distanceMessageElm.textContent = `${Math.round(distance / 1000).toLocaleString('en-US')} km`;
		} else if (distance > 1000) {
			this.distanceMessageElm.textContent = `${(distance / 1000).toFixed(1)} km`;
		} else {
			this.distanceMessageElm.textContent = `${Math.round(distance)} m`;
		}
		if (distance > 1000000) {
			this.distanceMessageElm.style.color = '#f00';
		} else {
			const maxDistance = Math.PI * 6378137;
			const dd = distance / maxDistance;
			this.distanceMessageElm.style.color = `hsl(${120 - dd * 120}, 100%, 50%)`;
		}
		this.nextButtonElm.classList.toggle('hidden', false);
	}

	init(mapService, camService) {
		this.mapService = mapService;
		this.camService = camService;
		this.mapService.onGuess = this.handleGuess.bind(this);
		this.gamePanelElm = document.querySelector('#game-panel');
		this.distanceMessageElm = document.querySelector('#distance-message');
		this.locationMessageElm = document.querySelector('#location-message');
		this.nextButtonElm = document.querySelector('#next-button');
		this.gamePanelElm.classList.toggle('hidden', false);
		this.locationMessageElm.classList.toggle('hidden', false);
		this.distanceMessageElm.classList.toggle('hidden', false);
		this.nextButtonElm.classList.toggle('hidden', true);
		this.nextButtonElm.addEventListener('click', () => {
			this.startUserGuess();
		})
	}
}
