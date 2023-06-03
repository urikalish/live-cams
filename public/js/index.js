import { wctCams } from '../cameras/wct-cams.js';
import { errCamIds } from '../cameras/err-cams.js';
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

camService.init(wctCams, errCamIds, fixCams);

//camService.displayLiveCam(issCam);

