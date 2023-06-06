import { wctCams } from '../cameras/wct-cams.js';
import { errCamSources } from '../cameras/err-cams.js';
import { fixCams } from '../cameras/fix-cams.js';
import { issCam } from '../cameras/iss-cam.js';
import { MapService} from './map-service.js';
import { CamService} from './cam-service.js';

const testErrCams = true;
const autoShowIssCam = true;
const closestCount = 16;

const mapService = new MapService();
const camService = new CamService();

function activateCamsForMarkers(markers) {
	camService.displayLiveCams(markers.map(m => m.cam));
}

window.handleGoogleMapLoaded = () => {
	mapService.init(wctCams, issCam, closestCount, activateCamsForMarkers).then(()=>{});
}

if (!testErrCams) {
	camService.init(wctCams, errCamSources, fixCams);
	if (autoShowIssCam) {
		camService.displayLiveCams([issCam]);
	}
} else {
	camService.init(wctCams, [], fixCams);
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
