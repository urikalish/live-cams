export class GameService {

	mapService;
	camService;

	init(mapService, camService) {
		this.mapService = mapService;
		this.camService = camService;
	}

	goRandomCam() {
		const cams = this.camService.getCams();
		const index = Math.trunc(Math.random()*cams.length);
		return cams[index];
	}
}
