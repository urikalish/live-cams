import { locations } from './locations.js';
import { liveCams } from './live-cams.js';

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 2,
		center: {lat: 21, lng: 21},
		mapTypeId: google.maps.MapTypeId.SATELLITE,
		labels: false,
		disableDefaultUI: true,
	});
}
window.initMap = initMap;

function createYouTubeFrame(liveCam) {
	const frElm = document.createElement('iframe');
	frElm.setAttribute('src', `https://www.youtube.com/embed/${liveCam.id}?vq=hd1080&autoplay=1&mute=1`);
	frElm.setAttribute('width', '950');
	frElm.setAttribute('height', '534');
	frElm.setAttribute('title', 'YouTube video player');
	frElm.setAttribute('frameborder', '0');
	frElm.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
	frElm.setAttribute('allowfullscreen', 'true');
	return frElm;
}

function displayLiveCams(liveCams, location) {
	const mainElm = document.getElementById('main');
	mainElm.replaceChildren();
	liveCams.filter(lc => lc.location === location).forEach((liveCam) => {
		const frElm = createYouTubeFrame(liveCam);
		mainElm.appendChild(frElm);
	});
}

// function addMapMarker(lat, lng, path, color) {
// 	const svgMarker = {
// 		path: "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z",
// 		fillColor: color,
// 		fillOpacity: 1,
// 		strokeWeight: 1,
// 		rotation: 0,
// 		scale: 0.5,
// 		anchor: new google.maps.Point(12, 12),
// 	};
// 	const marker = new google.maps.Marker({
// 		position: {lat, lng},
// 		icon: svgMarker,
// 		map: map,
// 	});
// }

async function handleIssMapMarker() {
	try {
		const req = await fetch('http://api.open-notify.org/iss-now.json');
		const json = await req.json();
		const lat = Number(json.iss_position.latitude);
		const lng = Number(json.iss_position.longitude);
		const svgMarker = {
			path: 'm15.44.59-3.18 3.18c-.78.78-.78 2.05 0 2.83l1.24 1.24-.71.71-1.24-1.25c-.78-.78-2.05-.78-2.83 0L7.3 8.72c-.78.78-.78 2.05 0 2.83l1.24 1.24-.71.71-1.23-1.25c-.78-.78-2.05-.78-2.83 0L.59 15.43c-.78.78-.78 2.05 0 2.83l3.54 3.54c.78.78 2.05.78 2.83 0l3.18-3.18c.78-.78.78-2.05 0-2.83L8.9 14.55l.71-.71 1.24 1.24c.78.78 2.05.78 2.83 0l1.41-1.41c.78-.78.78-2.05 0-2.83L13.84 9.6l.71-.71 1.24 1.24c.78.78 2.05.78 2.83 0l3.18-3.18c.78-.78.78-2.05 0-2.83L18.26.58c-.78-.78-2.04-.78-2.82.01zM6.6 19.32l-1.06 1.06L2 16.85l1.06-1.06 3.54 3.53zm2.12-2.12-1.06 1.06-3.54-3.54 1.06-1.06 3.54 3.54zm9.54-9.54L17.2 8.72l-3.54-3.54 1.06-1.06 3.54 3.54zm2.12-2.12L19.32 6.6l-3.54-3.54L16.85 2l3.53 3.54zM14 21v2c4.97 0 9-4.03 9-9h-2c0 3.87-3.13 7-7 7zm0-4v2c2.76 0 5-2.24 5-5h-2c0 1.66-1.34 3-3 3z',
			fillColor: '#fff',
			fillOpacity: 1,
			strokeWeight: 0,
			rotation: 0,
			scale: 1,
			anchor: new google.maps.Point(12, 12),
		};
		if (!issMarker) {
			issMarker = new google.maps.Marker({
				position: {lat, lng},
				icon: svgMarker,
				map: map,
			});
		} else {
			issMarker.setPosition({lat, lng});
		}
		setTimeout(handleIssMapMarker, 1000);
	} catch(error) {
		console.log(error);
	}
}

function addLocationMarkers() {
	locations.forEach(location => {
		const lat = location.lat;
		const lng = location.lng;
		if (!lat || !lng) {
			return;
		}
		const svgMarker = {
			path: 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z',
			fillColor: '#f00',
			fillOpacity: 1,
			strokeWeight: 1,
			rotation: 0,
			scale: 0.5,
			anchor: new google.maps.Point(12, 12),
		};
		const marker = new google.maps.Marker({
			position: {lat, lng},
			icon: svgMarker,
			title: location.name,
			map: map,
		});
		google.maps.event.addListener(marker, 'click', function() {
			displayLiveCams(liveCams, location.id)}
		);
	});
}

function displayIssLiveCam() {
	const issElm = document.getElementById('iss');
	issElm.replaceChildren();
	const liveCam = liveCams.find(lc => lc.location === 'iss');
	if (!liveCam) {
		return;
	}
	const frElm = createYouTubeFrame(liveCam);
	issElm.appendChild(frElm);
}

let map = null;
let issMarker = null;
setTimeout(() => {
	handleIssMapMarker();
	addLocationMarkers();
	displayIssLiveCam();
	displayLiveCams(liveCams, 'usa--new-york');
}, 1000);
