import { cams } from './cams.js';
import { MapService} from './map-service.js';
import { CamService} from './cam-service.js';

function handleMarkerClick(cam) {
	camService.displayLiveCam(cam);
}

const mapService = new MapService();
const camService = new CamService();
mapService.init(cams, handleMarkerClick);
//camService.displayLiveCams(cams, 'space--iss');
