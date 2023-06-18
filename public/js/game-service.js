export class GameService {

	mapService = null;
	camService = null;
	cam = null;
	gamePanelElm = null;
	gameMessageElm = null;

	async handleGuess(guessLat, guessLng) {
		const trueLat = Number.parseFloat(this.cam.pos.split(',')[0]);
		const trueLng = Number.parseFloat(this.cam.pos.split(',')[1]);
		const distance = await this.mapService.displayGuess(guessLat, guessLng, trueLat, trueLng);
		if (distance >= 10000) {
			this.gameMessageElm.textContent = Math.round(distance / 1000) + ' km';
		} else if (distance > 1000) {
			this.gameMessageElm.textContent = (distance / 1000).toFixed(1) + ' km';
		} else {
			this.gameMessageElm.textContent = Math.round(distance) + ' m'
		}
	}

	init(mapService, camService) {
		this.mapService = mapService;
		this.camService = camService;
		this.mapService.onGuess = this.handleGuess.bind(this);
		this.gamePanelElm = document.querySelector('#game-panel');
		this.gameMessageElm = document.querySelector('#game-message');
		this.gamePanelElm.classList.toggle('hidden', false);
		this.gameMessageElm.classList.toggle('hidden', false);
	}

	goRandomCam() {
		this.mapService.clearGuessMarker();
		this.mapService.clearTrueMarker();
		this.mapService.clearDistanceLine();
		const cams = this.camService.getCams();
		const index = Math.trunc(Math.random()*cams.length);
		this.cam = cams[index];
		this.camService.displayLiveCams([this.cam], true);
		this.gameMessageElm.textContent = 'Where is this camera?';
	}
}
