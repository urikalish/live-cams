export class GameService {

	mapService = null;
	camService = null;
	camIndex = 0;
	cam = null;
	gamePanelElm = null;
	statsMessageElm = null;
	distanceMessageElm = null;
	locationMessageElm = null;
	nextButtonElm = null;
	waitingForGuess = true;
	waitingForGuessStartTime = 0;
	guesses = [];

	addCoverElm() {
		const containerElm = document.querySelector('.cam-container');
		const coverElm = document.createElement('div');
		coverElm.setAttribute('id', 'cam-cover');
		coverElm.classList.add('cam-cover');
		coverElm.textContent = '';
		containerElm.appendChild(coverElm);
	}

	startUserGuess() {
		this.mapService.clearGuess();
		const cams = this.camService.getCams();
		this.cam = cams[this.camIndex];
		this.camIndex = (this.camIndex + 1) % cams.length;
		this.camService.displayLiveCams([this.cam], true);
		this.addCoverElm();
		this.statsMessageElm.textContent = '';
		this.distanceMessageElm.textContent = '';
		this.locationMessageElm.textContent = '';
		this.displayStats();
		this.waitingForGuessStartTime = Date.now();
		this.waitingForGuess = true;
	}

	getDistanceString(distance) {
		if (distance >= 10000) {
			return `${Math.round(distance / 1000).toLocaleString('en-US')} km`;
		} else if (distance > 1000) {
			return `${(distance / 1000).toFixed(1)} km`;
		} else {
			return `${Math.round(distance)} m`;
		}
	}

	displayGuessDistance(distance) {
		this.distanceMessageElm.textContent = this.getDistanceString(distance);
		if (distance > 1000000) {
			this.distanceMessageElm.style.color = '#f00';
		} else {
			//const maxDistance = Math.PI * 6378137;
			const dd = distance / 1000000;
			this.distanceMessageElm.style.color = `hsl(${120 - dd * 120}, 100%, 50%)`;
		}
	}

	displayStats() {
		if (this.guesses.length === 0) {
			this.statsMessageElm.textContent = '';
		}
		let sortedGuesses = [...this.guesses].sort((a,b) => a-b);
		const bestGuess = this.getDistanceString(sortedGuesses[0]);
		const avgGuess = this.getDistanceString(sortedGuesses.reduce((a,c) => a + c, 0) / sortedGuesses.length);
		if (sortedGuesses.length > 0) {
			this.statsMessageElm.textContent = `Guesses: ${sortedGuesses.length} / Average: ${avgGuess} / Best: ${bestGuess}`;
		}
	}

	async handleGuess(guessLat, guessLng) {
		if (!this.waitingForGuess || (Date.now() - this.waitingForGuessStartTime < 1000)) {
			return;
		}
		this.waitingForGuess = false;
		this.locationMessageElm.textContent = `${this.cam.name} / ${this.cam.geo.split('/')[1]}, ${this.cam.geo.split('/')[0]}`;
		const trueLat = Number.parseFloat(this.cam.pos.split(',')[0]);
		const trueLng = Number.parseFloat(this.cam.pos.split(',')[1]);
		const distance = await this.mapService.displayGuess(guessLat, guessLng, trueLat, trueLng);
		this.guesses.push(distance);
		this.displayGuessDistance(distance);
		this.displayStats();
	}

	init(mapService, camService) {
		this.mapService = mapService;
		this.camService = camService;
		this.mapService.onGuess = this.handleGuess.bind(this);
		this.gamePanelElm = document.querySelector('#game-panel');
		this.distanceMessageElm = document.querySelector('#distance-message');
		this.locationMessageElm = document.querySelector('#location-message');
		this.statsMessageElm = document.querySelector('#stats-message');
		this.nextButtonElm = document.querySelector('#next-button');
		this.gamePanelElm.classList.toggle('hidden', false);
		this.statsMessageElm.classList.toggle('hidden', false);
		this.distanceMessageElm.classList.toggle('hidden', false);
		this.locationMessageElm.classList.toggle('hidden', false);
		this.nextButtonElm.addEventListener('click', () => {
			this.startUserGuess();
		})
	}
}
