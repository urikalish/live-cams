import { wctCams } from '../cameras/wct-cams.js';
import { fixCams } from '../cameras/fix-cams.js';
import { issCam } from '../cameras/iss-cam.js';
import { MapService} from './map-service.js';
import { CamService} from './cam-service.js';

const mapService = new MapService();
const camService = new CamService();

function handleMarkerClick(cam) {
	camService.displayLiveCam(cam);
}
window.handleGoogleMapLoaded = function() {
	mapService.init(wctCams, issCam, handleMarkerClick).then(()=>{});
}

camService.fixCameraList(wctCams, fixCams);
//camService.displayLiveCam(issCam);

