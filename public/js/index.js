import { wctCams } from '../cameras/wct-cams.js';
import { addCams } from "../cameras/add-cams.js";
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
	camService.displayLiveCams(markers.map(m => m.cam));
}

window.handleGoogleMapLoaded = () => {
	mapService.init(camService.getCams(), issCam, closestCount, activateCamsForMarkers).then(()=>{});
}

if (!testErrCams) {
	camService.init(wctCams, addCams, remCams, updCams);
	if (autoShowIssCam) {
		camService.displayLiveCams([issCam]);
	}
} else {
	camService.init(wctCams, addCams, [], updCams);
	const deadCams = [];
	const allCams = camService.getCams();
	const newErrCamSources = [];
	errCamSources.forEach(e => {
		const cam = allCams.find(cam => cam.src.includes(e));
		if (cam) {
			deadCams.push(cam);
			console.log(cam.name);
			newErrCamSources.push(e);
		} else {
			console.warn(`Error cam not found in cam list: ${e}`);
		}
	});
	console.log(newErrCamSources.sort());
	camService.displayLiveCams(deadCams);
}
