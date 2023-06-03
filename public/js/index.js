import { wctCams } from '../cameras/wct-cams.js';
import { fixCams } from '../cameras/fix-cams.js';
import { issCam } from '../cameras/iss-cam.js';
import { MapService} from './map-service.js';
import { CamService} from './cam-service.js';

const mapService = new MapService();
const camService = new CamService();

window.handleGoogleMapLoaded = () => {
	mapService.init(wctCams, issCam, (cam) => {
		camService.displayLiveCam(cam);
	}).then(()=>{});
}

camService.init(wctCams, fixCams);

//camService.displayLiveCam(issCam);

