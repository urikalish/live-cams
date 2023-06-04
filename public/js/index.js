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

// function displayAllDeadCameras() {
// 	//IMPORTANT - while using, comment out the removal of error cams in camService.init()
// 	const deadCams = [];
// 	const allCams = camService.getCams();
// 	allCams.forEach(c => {
// 		if (errCamSources.includes(c.src)) {
// 			deadCams.push(c);
// 		}
// 	});
// 	camService.displayLiveCams(deadCams);
// }

window.handleGoogleMapLoaded = () => {
	mapService.init(wctCams, issCam, activateCamsForMarkers).then(()=>{});
}

camService.init(wctCams, errCamSources, fixCams);

//camService.displayLiveCam(issCam);

