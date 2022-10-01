export class MapService {

	init(cams, onMarkerClick) {
		window.initMap = () => {
			const map = new google.maps.Map(document.getElementById('map'), {
				zoom: 2,
				center: {lat: 21, lng: 21},
				mapTypeId: google.maps.MapTypeId.SATELLITE,
				labels: false,
				disableDefaultUI: true,
			});
			setTimeout(() => {
				this.addLocationMarkers(map, onMarkerClick, cams);
				this.handleIssMapMarker(map, onMarkerClick, null).then(() => {
				});
			}, 1000);
		}
	}

	addLocationMarkers(map, onMarkerClick, cams) {
		cams.forEach(location => {
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
				scale: 0.4,
				anchor: new google.maps.Point(12, 12),
			};
			const marker = new google.maps.Marker({
				position: {lat, lng},
				icon: svgMarker,
				title: location.name,
				map,
			});
			google.maps.event.addListener(marker, 'click', () => {
				onMarkerClick(location.id);
			});
		});
	}

	async handleIssMapMarker(map, onMarkerClick, issMarker) {
		try {
			const req = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
			const json = await req.json();
			const lat = Number(json.latitude);
			const lng = Number(json.longitude);
			if (!issMarker) {
				const svgMarker = {
					path: 'm15.44.59-3.18 3.18c-.78.78-.78 2.05 0 2.83l1.24 1.24-.71.71-1.24-1.25c-.78-.78-2.05-.78-2.83 0L7.3 8.72c-.78.78-.78 2.05 0 2.83l1.24 1.24-.71.71-1.23-1.25c-.78-.78-2.05-.78-2.83 0L.59 15.43c-.78.78-.78 2.05 0 2.83l3.54 3.54c.78.78 2.05.78 2.83 0l3.18-3.18c.78-.78.78-2.05 0-2.83L8.9 14.55l.71-.71 1.24 1.24c.78.78 2.05.78 2.83 0l1.41-1.41c.78-.78.78-2.05 0-2.83L13.84 9.6l.71-.71 1.24 1.24c.78.78 2.05.78 2.83 0l3.18-3.18c.78-.78.78-2.05 0-2.83L18.26.58c-.78-.78-2.04-.78-2.82.01zM6.6 19.32l-1.06 1.06L2 16.85l1.06-1.06 3.54 3.53zm2.12-2.12-1.06 1.06-3.54-3.54 1.06-1.06 3.54 3.54zm9.54-9.54L17.2 8.72l-3.54-3.54 1.06-1.06 3.54 3.54zm2.12-2.12L19.32 6.6l-3.54-3.54L16.85 2l3.53 3.54zM14 21v2c4.97 0 9-4.03 9-9h-2c0 3.87-3.13 7-7 7zm0-4v2c2.76 0 5-2.24 5-5h-2c0 1.66-1.34 3-3 3z',
					fillColor: '#fff',
					fillOpacity: 1,
					strokeWeight: 0,
					rotation: 270,
					scale: 0.8,
					anchor: new google.maps.Point(12, 12),
				};
				issMarker = new google.maps.Marker({
					position: {lat, lng},
					icon: svgMarker,
					map,
				});
				google.maps.event.addListener(issMarker, 'click', function () {
					onMarkerClick('space--iss');
				});
			} else {
				issMarker.setPosition({lat, lng});
			}
			setTimeout(() => {
				this.handleIssMapMarker(map, onMarkerClick, issMarker)
			}, 1000);
		} catch(error) {
			console.log(error);
		}
	}
}