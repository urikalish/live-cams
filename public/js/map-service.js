export class MapService {

	map = null;
	markers = [];
	selectedMarker = null;
	closestMarkers = [];
	issMarker = null;
	mapZoom = 2;
	closestCount = 0;
	debounceUpdatePins = null;

	debounce(func, timeout = 1000) {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => { func.apply(this, args); }, timeout);
		};
	}

	getPin(PinElement, isSelected, isClosest) {
		let background;
		if (isSelected) {
			background = '#f00';
		} else if (isClosest) {
			background = '#f90';
		} else {
			background = '#fc0';
		}
		const pinElement = new PinElement({
			scale: 0.0375 * this.mapZoom + 0.25, //0.04 * this.mapZoom + 0.2
			borderColor: '#000',
			background,
			glyphColor: '#000',
		})
		return pinElement.element;
	}

	async updatePins() {
		//@ts-ignore
		const { PinElement } = await google.maps.importLibrary('marker');
		this.markers.forEach(m => {
			m.content = this.getPin(PinElement, m === this.selectedMarker, this.closestMarkers.includes(m));
		});
	}

	async createMap() {
		//@ts-ignore
		const { Map } = await google.maps.importLibrary('maps');
		this.map = new Map(document.getElementById('map'), {
			zoom: 2,
			center: {lat: 20, lng: 11},
			mapId: 'world-map',
			labels: false,
			disableDefaultUI: true,
			mapTypeId: 'hybrid' // 'roadmap' | 'satellite' | 'hybrid'
		});
	}

	handleMapZoomChanged() {
		const mapZoom = this.map.getZoom();
		if (!mapZoom || mapZoom === this.mapZoom) {
			return;
		}
		this.mapZoom = mapZoom;
		this.debounceUpdatePins();
	}

	handleMapClicked(mapsMouseEvent) {
		console.log(mapsMouseEvent.latLng.lat() + ',' + mapsMouseEvent.latLng.lng());
	}

	async init(cams, issCam, closestCount, activateCamsForMarkers) {
		this.closestCount = closestCount;
		this.debounceUpdatePins = this.debounce(this.updatePins, 1000);
		await this.createMap();
		this.map.addListener('zoom_changed', this.handleMapZoomChanged.bind(this));
		this.map.addListener('click', this.handleMapClicked.bind(this));
		await this.addLocationMarkers(this.map, cams, activateCamsForMarkers);
		await this.handleIssMapMarker(this.map, issCam, activateCamsForMarkers);
	}

	getMarkerTitle(cam) {
		let geo = `${cam.geo.split('/')[1]}, ${cam.geo.split('/')[0]}`;
		const lat = Number.parseFloat(cam.pos.split(',')[0]).toFixed(5);
		const lng = Number.parseFloat(cam.pos.split(',')[1]).toFixed(5);
		const tags = cam.tags ? cam.tags.replaceAll(',', ', ') : '';
		return `${cam.name}\n${geo}\n${lat}, ${lng}${tags ? '\n' + tags : ''}`;
	}

	rad(x) {
		return x * Math.PI / 180;
	};

	getDistanceBetweenMarkers(m1, m2) {
		const lat1 = m1.position.lat;
		const lng1 = m1.position.lng;
		const lat2 = m2.position.lat;
		const lng2 = m2.position.lng;
		const R = 6378137; // Earth’s mean radius in meters
		const dLat = this.rad(lat2 - lat1);
		const dLong = this.rad(lng2 - lng1);
		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(this.rad(lat1)) * Math.cos(this.rad(lat2)) *
		Math.sin(dLong / 2) * Math.sin(dLong / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // returns the distance in meters
	};

	getClosestMarkers(marker, markers, count) {
		const distances = [];
		markers.forEach(m => {
			if (m !== marker) {
				distances.push({
					m,
					d: this.getDistanceBetweenMarkers(marker, m)
				});
			}
		});
		distances.sort((a,b) => a.d - b.d);
		distances.length = Math.min(distances.length, count);
		return distances.map(d => d.m);
	}

	zoomOnMarkers(markers) {
		const latLngBounds = new google.maps.LatLngBounds();
		markers.forEach(m => {
			latLngBounds.extend(m.position);
		});
		this.map.fitBounds(latLngBounds);
	}

	drawLineBetweenMarkers(map, m1, m2, color) {
		const line = new google.maps.Polyline({
			path: [m1.position, m2.position],
			geodesic: true,
			strokeColor: color,
			strokeOpacity: 1.0,
			strokeWeight: 2
		});
		line.setMap(map);
	}

	async addLocationMarkers(map, cams, activateCamsForMarkers) {
		//@ts-ignore
		const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker');

		this.markers = [];
		cams.forEach(cam => {
			if (!cam.src || !cam.pos) {
				return;
			}
			const lat = Number.parseFloat(cam.pos.split(',')[0]);
			const lng = Number.parseFloat(cam.pos.split(',')[1]);
			const marker = new AdvancedMarkerElement({
				map,
				position: {lat, lng},
				title: this.getMarkerTitle(cam),
				content: this.getPin(PinElement, false),
				//collisionBehavior: 'OPTIONAL_AND_HIDES_LOWER_PRIORITY'
			});
			marker.addListener('click', () => {
				if (this.selectedMarker) {
					this.selectedMarker.content = this.getPin(PinElement, false, false);
				}
				this.closestMarkers.forEach(m => {
					m.content = this.getPin(PinElement, false, false);
				});
				this.selectedMarker = marker;
				//console.log(`Cam clicked: ${cam.src}`);
				this.selectedMarker.content = this.getPin(PinElement, true, false);
				this.closestMarkers = this.getClosestMarkers(marker, this.markers, this.closestCount);
				this.closestMarkers.forEach(m => {
					m.content = this.getPin(PinElement, false, true);
				});
				//this.closestMarkers.forEach((m, i) => {
					//console.log(`Closest #${i+1}: ${m.cam.src}`);
				//});

				activateCamsForMarkers([marker, ...this.closestMarkers]);
			});
			marker.cam = cam;
			cam.mrk = marker;
			this.markers.push(marker);
		});
	}

	async handleIssMapMarker(map, issCam, activateCamsForMarkers) {
		if (!issCam) {
			return;
		}
		try {
			const req = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
			const json = await req.json();
			const lat = Number(json.latitude);
			const lng = Number(json.longitude);
			issCam.pos = `${lat},${lng}`;
			if (!this.issMarker) {
				const svgMarker = {
					path: 'm15.44.59-3.18 3.18c-.78.78-.78 2.05 0 2.83l1.24 1.24-.71.71-1.24-1.25c-.78-.78-2.05-.78-2.83 0L7.3 8.72c-.78.78-.78 2.05 0 2.83l1.24 1.24-.71.71-1.23-1.25c-.78-.78-2.05-.78-2.83 0L.59 15.43c-.78.78-.78 2.05 0 2.83l3.54 3.54c.78.78 2.05.78 2.83 0l3.18-3.18c.78-.78.78-2.05 0-2.83L8.9 14.55l.71-.71 1.24 1.24c.78.78 2.05.78 2.83 0l1.41-1.41c.78-.78.78-2.05 0-2.83L13.84 9.6l.71-.71 1.24 1.24c.78.78 2.05.78 2.83 0l3.18-3.18c.78-.78.78-2.05 0-2.83L18.26.58c-.78-.78-2.04-.78-2.82.01zM6.6 19.32l-1.06 1.06L2 16.85l1.06-1.06 3.54 3.53zm2.12-2.12-1.06 1.06-3.54-3.54 1.06-1.06 3.54 3.54zm9.54-9.54L17.2 8.72l-3.54-3.54 1.06-1.06 3.54 3.54zm2.12-2.12L19.32 6.6l-3.54-3.54L16.85 2l3.53 3.54zM14 21v2c4.97 0 9-4.03 9-9h-2c0 3.87-3.13 7-7 7zm0-4v2c2.76 0 5-2.24 5-5h-2c0 1.66-1.34 3-3 3z',
					fillColor: '#fff',
					fillOpacity: 1,
					strokeWeight: 0,
					rotation: 0,
					scale: 1,
					anchor: new google.maps.Point(12, 12),
				};
				this.issMarker = new google.maps.Marker({
					map,
					position: {lat, lng},
					title: this.getMarkerTitle(issCam),
					icon: svgMarker,
				});
				google.maps.event.addListener(this.issMarker, 'click', () => {
					activateCamsForMarkers([this.issMarker]);
				});
				this.issMarker.cam = issCam;
				issCam.mrk = this.issMarker;
			} else {
				this.issMarker.setPosition({lat, lng});
			}
			setTimeout(() => {
				this.handleIssMapMarker(map, issCam, activateCamsForMarkers)
			}, 10000);
		} catch(error) {
			console.log(error);
		}
	}

}
