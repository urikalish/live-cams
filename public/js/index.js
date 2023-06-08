import { wctCams } from '../cameras/wct-cams.js';
import { addCams } from "../cameras/add-cams.js";
import { errCams } from '../cameras/err-cams.js';
import { remCams } from '../cameras/rem-cams.js';
import { updCams } from '../cameras/upd-cams.js';
import { issCam } from '../cameras/iss-cam.js';
import { MapService} from './map-service.js';
import { CamService} from './cam-service.js';

const testErrCams = false;
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

if (!testErrCams) {
	camService.init(wctCams, errCams, remCams, addCams, updCams);
	if (autoShowIssCam) {
		camService.displayLiveCams([issCam], true);
	}
} else {
	camService.init(wctCams, [], remCams, addCams, updCams);
	const unwantedCams = [];
	const allCams = camService.getCams();
	errCams.forEach(unwantedCam => {
		const cam = allCams.find(cam => cam.src.includes(unwantedCam));
		if (cam) {
			unwantedCams.push(cam);
			console.log(cam.name);
		} else {
			console.warn(`Unwanted cam not found in cam list: ${unwantedCam}`);
		}
	});
	camService.setCams(unwantedCams);
	camService.displayLiveCams(unwantedCams, true);
}
