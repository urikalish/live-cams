import { cams } from './cams.js';
import { MapService} from './map-service.js';
import { CamService} from './cam-service.js';

function handleMarkerClick(locationId) {
	camService.displayLiveCams(cams, locationId);
}

const mapService = new MapService();
const camService = new CamService();
mapService.init(cams, handleMarkerClick);
