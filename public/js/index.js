import { wctCams } from '../cameras/wct-cams.js';
import { issCam } from '../cameras/iss-cam.js';
import { MapService} from './map-service.js';
import { CamService} from './cam-service.js';

function handleMarkerClick(cam) {
	camService.displayLiveCam(cam);
}

const mapService = new MapService();
const camService = new CamService();
window.handleGoogleMapLoaded = function() {
	mapService.init(wctCams, issCam, handleMarkerClick).then(()=>{});
}
//camService.displayLiveCams(cams, 'space--iss');
