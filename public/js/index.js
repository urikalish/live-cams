import { wctCams } from '../cameras/wct-cams.js';
import { addCams } from "../cameras/add-cams.js";
import { errCams } from '../cameras/err-cams.js';
import { remCams } from '../cameras/rem-cams.js';
import { updCams } from '../cameras/upd-cams.js';
import { issCam } from '../cameras/iss-cam.js';
import { MapService} from './map-service.js';
import { CamService} from './cam-service.js';
import { GameService } from './game-service.js';

const mapService = new MapService();
const camService = new CamService();
const gameService = new GameService();

window.handleGoogleMapLoaded = () => {};
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || 'view';

if (mode === 'view') {
	const autoShowIssCam = true;
	const autoPlay = true;
	const closestCount = 16;
	window.handleGoogleMapLoaded = async () => {
		await mapService.initForView(camService, closestCount, markers => {
			camService.displayLiveCams(markers.map(m => m.cam), autoPlay);
		});
	}
	camService.init(wctCams, errCams, remCams, addCams, updCams, issCam, false);
	if (autoShowIssCam) {
		camService.displayLiveCams([issCam], autoPlay);
	}
} else if (mode === 'guess') {
	window.handleGoogleMapLoaded = async () => {
		await mapService.initForGuess(camService);
		gameService.startUserGuess();
	}
	camService.init(wctCams, errCams, remCams, addCams, updCams, issCam, true);
	gameService.init(mapService, camService);
} else if (mode === 'check') {
	camService.init(wctCams, [], remCams, addCams, updCams, null, false);
	camService.displayAllErrCams(wctCams, errCams);
}
