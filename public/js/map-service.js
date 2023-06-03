export class MapService {

	markers = [];
	selectedMarker = null;
	mapZoom = 2;

	debounce(func, timeout = 1000){
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => { func.apply(this, args); }, timeout);
		};
	}

	getPin(PinElement, isSelected) {
		const pinElement = new PinElement({
			//scale: 0.04 * this.mapZoom + 0.2,
			scale: 0.0375 * this.mapZoom + 0.25,
			borderColor: '#000',
			background: isSelected ? '#f00' : '#fa0',
			glyphColor: '#000',
		})
		return pinElement.element;
	}

	async init(wctCams, issCam, onMarkerClick) {
		//@ts-ignore
		const { Map } = await google.maps.importLibrary('maps');
		//@ts-ignore
		const { PinElement } = await google.maps.importLibrary('marker');

		const debouncePinUpdate = this.debounce(() => {
			this.markers.forEach(m => {
				m.content = this.getPin(PinElement, m === this.selectedMarker);
			});
		}, 1000);

		const map = new Map(document.getElementById("map"), {
			zoom: 2,
			center: {lat: 20, lng: 11},
			mapId: "world-map",
			labels: false,
			disableDefaultUI: true,
			//mapTypeId: 'roadmap',
			//mapTypeId: 'satellite',
			mapTypeId: 'hybrid'
		});
		map.addListener('zoom_changed', () => {
			const mapZoom = map.getZoom();
			if (!mapZoom || mapZoom === this.mapZoom) {
				return;
			}
			this.mapZoom = mapZoom;
			debouncePinUpdate();
		});
		await this.addLocationMarkers(map, wctCams, onMarkerClick);
		await this.handleIssMapMarker(map, issCam, null, onMarkerClick);
	}

	async addLocationMarkers(map, cams, onMarkerClick) {
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
				title: `${cam.name}\n${cam.tags ? cam.tags + '\n' : ''}${cam.geo}\n${lat.toFixed(5)},${lng.toFixed(5)}`,
				content: this.getPin(PinElement, false),
				//collisionBehavior: 'OPTIONAL_AND_HIDES_LOWER_PRIORITY'
			});
			marker.addListener('click', () => {
				if (this.selectedMarker) {
					this.selectedMarker.content = this.getPin(PinElement, false);
				}
				this.selectedMarker = marker;
				this.selectedMarker.content = this.getPin(PinElement, true);

				onMarkerClick(cam);
			});
			cam.marker = marker;
			this.markers.push(marker);
		});
	}

	async handleIssMapMarker(map, issCam, issMarker, onMarkerClick) {
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
					rotation: 0,
					scale: 1,
					anchor: new google.maps.Point(12, 12),
				};
				issMarker = new google.maps.Marker({
					map,
					position: {lat, lng},
					title: `${issCam.name}\n${issCam.tags}\n${issCam.geo}\n${lat.toFixed(5)},${lng.toFixed(5)}`,
					icon: svgMarker,
				});
				google.maps.event.addListener(issMarker, 'click', () => {
					onMarkerClick(issCam);
				});
			} else {
				issMarker.setPosition({lat, lng});
			}
			setTimeout(() => {
				this.handleIssMapMarker(map, issCam, issMarker, onMarkerClick)
			}, 10000);
		} catch(error) {
			console.log(error);
		}
	}
}
