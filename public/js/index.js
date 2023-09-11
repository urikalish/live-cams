import { wctCams } from '../cameras/wct-cams.js';
import { remCams, addCams, updCams, issCam } from '../cameras/upd-cams.js';
import { MapService} from './map-service.js';
import { CamService} from './cam-service.js';
import { GameService } from './game-service.js';

const mapService = new MapService();
const camService = new CamService();
const gameService = new GameService();

window.handleGoogleMapLoaded = () => {};
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || 'guess';

if (mode === 'guess') {
	window.handleGoogleMapLoaded = async () => {
		await mapService.initForGuess(camService);
		gameService.startUserGuess();
	}
	camService.init(wctCams, remCams, addCams, updCams, issCam, true, true);
	gameService.init(mapService, camService);
} else if (mode === 'view') {
	const autoShowIssCam = true;
	const autoPlay = true;
	const closestCount = 16;
	window.handleGoogleMapLoaded = async () => {
		await mapService.initForView(camService, closestCount, markers => {
			camService.displayLiveCams(markers.map(m => m.cam), autoPlay);
		});
	}
	camService.init(wctCams, remCams, addCams, updCams, issCam, false, false);
	if (autoShowIssCam) {
		camService.displayLiveCams([issCam], autoPlay);
	}
} else if (mode === 'rem') {
	camService.init(wctCams, [], addCams, updCams, null, false, false);
	camService.displayAllProblematicCams(wctCams, remCams);
}
