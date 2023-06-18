export class GameService {

	mapService = null;
	camService = null;
	cam = null;
	gamePanelElm = null;
	gameMessageElm = null;

	async handleGuess(lat, lng) {
		const guessMarker = await this.mapService.addGuessMarker(lat, lng);
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
