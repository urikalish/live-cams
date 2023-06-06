import { wctCams } from '../cameras/wct-cams.js';
import { errCamSources } from '../cameras/err-cams.js';
import { fixCams } from '../cameras/fix-cams.js';
import { issCam } from '../cameras/iss-cam.js';
import { MapService} from './map-service.js';
import { CamService} from './cam-service.js';

const mapService = new MapService();
const camService = new CamService();

function activateCamsForMarkers(markers) {
	camService.displayLiveCams(markers.map(m => m.cam));
}

window.handleGoogleMapLoaded = () => {
	mapService.init(wctCams, issCam, activateCamsForMarkers).then(()=>{});
}

const testErrCams = false;
const autoShowIssCam = false;

if (!testErrCams) {
	camService.init(wctCams, errCamSources, fixCams);
	if (autoShowIssCam) {
		camService.displayLiveCams([issCam]);
	}
} else {
	camService.init(wctCams, [], fixCams);
	const deadCams = [];
	const allCams = camService.getCams();
	allCams.forEach(c => {
		if (errCamSources.includes(c.src)) {
			deadCams.push(c);
		}
	});
	camService.displayLiveCams(deadCams);
}
