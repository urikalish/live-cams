import { wctCams } from '../cameras/wct-cams.js';
import { addCams } from "../cameras/add-cams.js";
import { errCams } from '../cameras/err-cams.js';
import { remCams } from '../cameras/rem-cams.js';
import { updCams } from '../cameras/upd-cams.js';
import { issCam } from '../cameras/iss-cam.js';
import { MapService} from './map-service.js';
import { CamService} from './cam-service.js';

const mapService = new MapService();
const camService = new CamService();

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || 'view';

if (mode === 'view') {
	const autoShowIssCam = true;
	const autoPlay = true;
	const closestCount = 16;
	window.handleGoogleMapLoaded = () => {
		mapService.init(camService.getCams(), issCam, closestCount, markers => {camService.displayLiveCams(markers.map(m => m.cam), autoPlay);}).then(()=>{});
	}
	camService.init(wctCams, errCams, remCams, addCams, updCams);
	if (autoShowIssCam) {
		camService.displayLiveCams([issCam], autoPlay);
	}
} else if (mode === 'check') {
	window.handleGoogleMapLoaded = () => {};
	camService.displayAllErrCams(wctCams, errCams, remCams, addCams, updCams);
}
