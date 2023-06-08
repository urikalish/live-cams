import { wctCams } from '../cameras/wct-cams.js';
import { addCams } from "../cameras/add-cams.js";
import { errCams } from '../cameras/err-cams.js';
import { remCams } from '../cameras/rem-cams.js';
import { updCams } from '../cameras/upd-cams.js';
import { issCam } from '../cameras/iss-cam.js';
import { MapService} from './map-service.js';
import { CamService} from './cam-service.js';

const displayAllErrCams = false;
//const checkYouTubeCams = false;
const autoShowIssCam = true;
const closestCount = 16;

const mapService = new MapService();
const camService = new CamService();

function activateCamsForMarkers(markers) {
	camService.displayLiveCams(markers.map(m => m.cam), true);
}

window.handleGoogleMapLoaded = () => {
	mapService.init(camService.getCams(), issCam, closestCount, activateCamsForMarkers).then(()=>{});
}

if (displayAllErrCams) {
	camService.displayAllErrCams(wctCams, errCams, remCams, addCams, updCams);
// } else if (checkYouTubeCams) {
// 	camService.checkYouTubeCams(wctCams, errCams, remCams, addCams, updCams);
} else {
	camService.init(wctCams, errCams, remCams, addCams, updCams);
	if (autoShowIssCam) {
		camService.displayLiveCams([issCam], true);
	}
}
