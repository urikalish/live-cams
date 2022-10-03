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
				// const svgMarker = {
				// 	path: 'M 0,0 -0.051,0.484 0.213,2.06 C 0.278,1.982 0.373,1.901 0.513,1.822 1.091,1.494 1.443,1.95 1.443,1.95 L 1.9,1.726 0,0 Z m -22.639,-20.563 -2.388,1.466 21.813,19.356 -0.395,-1.255 0.114,-1.281 -0.238,-1.114 -18.906,-17.172 z m 4.574,37.464 0,1.404 c 0,0.108 -0.037,0.212 -0.104,0.308 l 2.132,-0.03 0.019,0.759 0.46,0.095 -0.01,-0.344 -0.337,-0.094 -0.132,-3.049 -2.028,0.951 z m -10.691,-6.412 0,-1.057 -1.164,0.602 c 0.018,0.038 0.034,0.078 0.049,0.118 0.094,0.028 0.186,0.071 0.274,0.133 l 0.979,0.698 c -0.089,-0.155 -0.138,-0.321 -0.138,-0.494 m -7.771,16.936 c 0.041,-0.139 0.135,-0.239 0.135,-0.239 l 0.008,-0.059 -0.212,-0.147 -0.016,0.006 0.014,0.389 0.071,0.05 z m 0.473,-0.07 0.015,0.055 0.036,-0.019 -0.051,-0.036 z m 1.349,-1.973 0.715,0.022 c -0.01,-0.03 -0.016,-0.056 -0.021,-0.082 l -0.978,-0.482 -0.408,0.191 -0.001,0.011 0.651,0.354 c 0.023,-0.011 0.042,-0.014 0.042,-0.014 m 29.756,3.33 c 0.484,0.364 0.575,0.893 0.438,1.425 0.008,0.004 0.012,0.006 0.012,0.006 0.246,0.213 0.321,0.565 0.321,0.565 l 0.683,0.097 0.523,0.448 0.171,0.075 -0.032,-0.15 1.931,-2.989 0.263,0.18 -0.366,-0.347 -1.864,-1.096 -1.106,-1.105 -3.117,1.29 2.143,1.601 z m 3.261,-7.649 -1.779,-1.039 -0.341,-0.318 0.01,0.527 0.488,0.46 1.764,1.082 0.492,0.449 0.398,-0.173 -1.032,-0.988 z m -12.509,-1.812 0.039,-0.284 c 0,0 0.118,-0.096 0.342,-0.199 l -0.432,-0.175 -0.942,0.451 0.993,0.207 z m 2.892,5.845 -0.034,-0.732 c -0.159,0.067 -0.335,0.122 -0.524,0.162 0.243,0.124 0.439,0.325 0.558,0.57 m -0.723,-8.18 0.649,0.433 1.593,1.508 0.166,0.108 0.864,0.046 -1.129,-0.68 -1.509,-1.409 -0.653,-0.306 0.019,0.3 z m 8.675,6.305 -1.019,-0.966 -0.87,-0.031 0.793,0.504 0.694,0.667 0.402,-0.174 z m -6.184,2.816 0.277,0.158 -0.241,-0.165 0,-0.1 3.459,-1.461 -0.2,-0.119 -1.494,-1.451 -1.386,-0.812 -0.393,-0.014 -0.032,-0.234 -0.182,-0.107 -0.492,-0.479 -0.67,-0.022 0.106,1.195 0.166,0.494 0.154,0.456 c 0,0.131 -0.036,0.257 -0.103,0.375 l 1.622,-0.71 0.157,0.114 0.128,2.192 -1.172,0.481 0.296,0.209 z m 2.783,-8.475 -1.48,-1.437 -1.893,-1.139 -1.333,-1.184 -0.352,0.165 0.39,0.236 1.394,1.324 1.893,1.195 1.537,1.466 1.685,1.03 0.616,0.033 -0.621,-0.579 -1.836,-1.11 z m 3.97,-12.346 0,0.063 0.005,-0.066 -0.005,0.003 z M 1.473,3.992 1.486,3.985 0.419,3.046 0.381,3.064 l 0.094,0.565 0.25,0.363 0.476,-0.22 0.272,0.22 z m -47.798,22.173 0,-0.263 -0.619,-0.363 -0.562,0.268 -0.051,1.256 1.421,-0.703 -0.189,-0.195 z m -2.399,6.325 0.044,-0.611 0.334,-0.149 -0.292,-0.181 -0.979,0.452 0.893,0.489 z m 19.214,10.528 1.505,-0.59 -15.151,-8.395 -0.131,0.059 -0.633,-0.363 0,-0.119 -0.132,-0.073 -0.025,0.889 -0.562,0.278 -10e-4,0.024 15.13,8.29 z m -25.167,-12.704 0.068,-0.032 -0.02,-0.011 -0.048,0.043 z m -3.866,-3.217 -0.071,-0.528 -21.24,-11.724 -1.532,0.943 22.482,12.212 0.361,-0.903 z m -30.998,-6.328 -1.424,0.873 26.29,13.158 0.283,-0.139 c 0.142,-0.704 0.697,-0.647 0.697,-0.647 l 0.37,0.156 0.108,-0.054 -26.324,-13.347 z m 27.127,13.835 0,-0.17 0.569,-0.26 0.189,0.065 -0.021,0.653 0.302,0.26 0.228,-0.171 0.101,-1.445 -1.823,0.862 0.455,0.206 z m 23.58,12.075 1.372,-0.538 -20.242,-10.317 -1.384,0.647 20.254,10.208 z M 4.565,8.279 22.545,24.198 24.646,23.383 6.819,7.273 6.303,7.504 6.058,7.365 c 0,0 -0.011,0.502 -0.587,0.79 0,0 -0.278,0.107 -0.47,0 L 4.777,8.012 4.565,8.279 Z M 6.823,-0.085 1.87,2.377 2.71,3.131 C 2.881,3.402 2.624,3.693 2.624,3.693 L 2.966,4.042 C 3.051,4.17 2.881,4.334 2.881,4.334 l -0.527,0.385 0,0.291 0.228,0.384 0.009,0.149 0.649,-0.056 0.918,-0.395 0.181,0.149 0,0.48 1.665,1.377 0.096,0 5.192,-2.338 17.812,16.895 0.116,0.482 -10.877,4.185 -0.056,-0.473 -18.221,-15.406 -0.374,0.174 0,-0.49 L 4.606,7.813 3.816,7.173 3.71,7.194 3.528,7.024 3.485,6.799 3.176,6.959 2.671,6.898 2.71,7.543 l -4.697,2.234 -0.982,0.072 -0.256,0.185 -2.032,0.921 0.129,0.114 0.501,0 c 0,0 0.385,-0.182 0.15,0.149 l -0.086,0.385 0.278,-0.097 0.16,0.161 0,0.106 c 0,0 0.555,-0.256 0.971,0.182 0.417,0.437 0.278,1.121 0.096,1.366 -0.181,0.245 -0.501,0.053 -0.501,0.053 l 0.032,0.502 -0.171,0.096 0.021,0.267 0.096,0.085 0.032,0.982 -0.234,0.086 -0.235,-0.203 -0.513,-0.043 -0.715,-0.598 -0.01,-0.48 -0.47,-0.363 c 0,0 -0.758,0.256 -0.576,-0.437 l -0.16,-0.118 -0.235,-0.053 -0.032,-1.473 -0.001,0 -2.583,1.172 0.894,0.582 1.508,1.452 1.836,1.11 1.395,1.366 1.779,1.081 1.238,1.224 0.256,2.332 1.437,-0.624 2.064,1.679 -3.189,1.313 0.143,1.491 -1.155,-1.074 -0.548,0.225 0.408,0.251 1.381,1.31 0.27,2.846 -0.609,-0.579 -1.903,2.952 0,0.086 c 0.353,-0.043 0.63,0.181 0.63,0.181 0.502,0.395 0.331,1.057 0,1.558 -0.331,0.502 -0.961,0.523 -1.217,0.459 -0.256,-0.064 -0.459,-0.459 -0.459,-0.459 l -0.053,0 -1.975,3.096 -0.757,-0.513 2.006,-3.148 0,-0.075 -0.715,-0.496 -0.31,-0.625 C -5.223,31.87 -5.4,31.836 -5.503,31.794 l -1.479,1.152 -0.173,0.086 c 0,0 0.159,0.356 -0.254,0.526 0,0 -0.297,0.015 -0.326,-0.099 0,0 -0.585,-0.015 -0.328,-0.598 0.256,-0.441 0.683,-0.057 0.683,-0.057 l 1.024,-0.747 c -0.207,0.034 -0.403,0.005 -0.569,-0.106 l -2.932,-1.968 c -0.372,-0.25 -0.544,-0.627 -0.568,-1.044 l -0.684,-0.497 c 0.002,0.015 0.003,0.025 0.003,0.025 l 0.086,0.139 0,0.043 0.082,0.056 -0.082,0.035 0,0.517 -0.192,0.085 c -0.032,0.222 -0.331,0.596 -0.447,0.687 -0.103,0.093 -0.304,0.156 -0.535,0.156 -0.125,0 -0.24,-0.018 -0.336,-0.049 l 0.026,0.284 -0.352,0 -0.053,-0.49 -0.418,-0.224 -2.877,1.205 0.085,0.086 -4.355,1.807 -2.234,-1.409 4.383,-1.878 0.114,0.071 4.864,-2.085 0,-0.135 c 0.073,-0.267 0.285,-0.502 0.385,-0.601 -0.292,-0.139 -0.521,-0.386 -0.636,-0.691 l -0.036,0.024 0.077,1.31 -2.327,0.996 -0.206,-0.085 -0.071,-2.135 0.55,-0.248 -3.623,-2.556 0.05,2.04 -0.48,-1.771 0,-0.572 -0.203,-0.143 0.068,2.768 -0.48,-1.772 0,-2.304 c -0.062,-0.024 -0.121,-0.054 -0.178,-0.088 l -0.407,-0.013 0.334,1.368 0.074,3.042 -0.48,-1.772 0,-2.64 -0.747,-0.024 0,0.188 -0.342,0.185 c -0.128,0.384 -0.54,0.37 -0.54,0.37 l -0.314,-0.028 -1.167,0.555 -1.352,0.213 -0.227,-0.412 -0.996,-0.2 0,-0.256 0.427,-0.256 0,-0.541 0.313,-0.156 0,-0.594 -5.665,2.657 -0.862,0.404 0.763,0.564 1.921,1.025 1.58,1.167 1.878,0.91 1.466,1.139 1.736,0.925 0.071,2.547 -1.778,-0.868 -1.523,-1.124 -1.865,-0.897 -1.565,-1.167 -1.936,-0.953 -1.617,-1.196 c 0.084,0.259 -0.094,0.438 -0.094,0.438 l -0.01,0 0.085,0.046 1.636,1.238 1.95,0.954 1.58,1.195 1.878,0.997 1.495,1.11 1.764,0.882 0.072,2.661 -1.85,-0.91 -1.495,-1.167 -1.893,-0.911 -1.608,-1.181 -1.921,-0.968 -1.637,-1.196 -1.992,-1.024 -0.433,-0.3 c -10e-4,0.009 -10e-4,0.015 -10e-4,0.015 l -0.128,0.064 0,0.182 0.252,0.242 0.253,0.181 2.064,1.11 1.622,1.252 1.978,1.025 1.566,1.224 1.892,0.939 1.537,1.181 1.794,0.954 0,2.676 -1.808,-0.911 -1.537,-1.182 -1.921,-0.953 -1.622,-1.238 -1.979,-0.996 -1.679,-1.253 -2.021,-1.024 -1.736,-1.239 -1.067,-0.213 -0.897,0.413 -0.498,-0.128 0.124,-2.904 -1.761,0.826 0.014,0.099 -0.967,0.456 -0.079,0.035 0,0.513 0.669,0.405 0.655,-0.313 0.612,0.377 -0.036,1.011 -0.327,0.149 0.313,0.185 -0.05,1.004 -0.341,0.156 0.313,0.185 -0.006,0.221 15.649,8.918 0.051,0.396 -7.664,3 0,-0.407 -20.193,-10.771 -0.375,0.173 0,-0.427 3.646,-1.708 -0.693,0 -1.409,-0.654 0.107,-1.967 -1.715,0.828 0.797,0.427 c 0.036,0.123 0.049,0.234 0.045,0.334 l 0.126,0.065 0,2.248 -2.984,1.395 0.004,0.101 20.583,10.765 0.054,0.366 -7.14,2.818 -0.025,-0.392 -20.25,-9.994 -0.411,0.193 0,-0.564 2.397,-1.123 -1.422,-0.704 -0.324,0.213 -0.651,0.053 -0.292,-0.039 -1.622,-0.839 -0.313,0.242 -2.96,1.437 0,-0.47 -26.228,-12.843 -0.451,0.277 0,-0.498 2.8,-1.725 1.424,-0.876 2.903,-1.788 26.81,13.895 0,0.351 0.882,-0.423 0,-1.644 -25.042,-13.264 -0.476,0.294 0,-0.547 3.058,-1.882 1.535,-0.945 3.218,-1.981 18.725,10.606 -0.022,-0.299 2.05,-1.067 0.213,1.508 -0.402,0.9 6.251,3.541 -3.296,1.551 -3.241,-1.79 0.019,1.277 -0.105,0.249 1.829,0.994 -2.124,1.053 2.563,-1.271 c 0.015,-0.569 0.655,-0.612 0.655,-0.612 l 0.313,0.142 3.387,-1.593 0,0.373 0.468,-0.227 -0.083,-1.484 0.483,-1.238 -0.227,-1.566 0.455,-1.295 -0.213,-1.509 0.441,-1.209 -0.185,-1.551 2.192,-1.167 0.227,1.565 -0.441,1.181 0.221,1.478 0.078,-0.04 0.562,0.327 0.946,-0.47 0.627,0.363 0,0.527 0.064,0.057 0.313,-0.192 -0.278,-0.185 0.043,-0.954 0.548,-0.256 0.028,-0.669 0.249,-0.135 0.349,0.22 0.982,-0.498 0.598,0.377 -0.036,0.975 -0.114,0.029 0.434,0.284 0.961,-0.505 0.605,0.406 -0.036,0.953 -0.27,0.121 0.242,0.171 -0.043,0.968 -0.27,0.128 0.349,0.228 0.625,-0.302 0.093,-2.168 2.875,-1.38 0.199,0.384 0,1.324 0.29,0.172 1.034,-0.5 0.095,-0.046 -0.056,-0.057 c -0.118,-0.395 0.245,-0.597 0.245,-0.597 l 0.224,0 c -0.213,-0.395 0.15,-0.534 0.15,-0.534 l 0.395,-0.011 0.139,-0.139 0.202,-0.01 0.16,-0.107 0.812,-0.854 -0.235,-0.011 c -0.086,-0.448 0.267,-0.587 0.267,-0.587 l 0.512,-0.021 c 0.066,-0.045 0.131,-0.077 0.193,-0.1 l -1.232,-0.804 -0.142,0.043 -0.32,-0.149 -0.017,-0.373 0.13,-0.076 0.249,0.135 1.16,-0.583 0,-0.427 0.861,-0.455 0.249,0.142 0.015,0.178 0.361,-0.195 -1.678,-1.157 c -0.107,-0.074 -0.19,-0.168 -0.25,-0.278 -0.148,-0.01 -0.289,-0.054 -0.418,-0.14 l -2.23,-1.492 c -0.067,0.265 -0.203,0.472 -0.424,0.584 l -3.966,2.013 c -0.729,0.375 -1.759,-0.523 -2.339,-1.603 l -0.662,0.368 -0.804,-0.562 0,-0.712 1.024,-0.553 c -0.014,-0.488 0.151,-0.906 0.576,-1.136 l 3.861,-2.042 c 0.101,-0.053 0.204,-0.089 0.306,-0.109 l -0.231,-0.607 -0.534,-0.377 c -0.015,-0.011 -0.029,-0.026 -0.042,-0.042 -0.119,-0.153 -0.098,-0.532 0.263,-0.976 0.398,-0.491 0.953,-0.32 0.953,-0.32 l 0.69,0.491 0.471,0.421 c 0.526,-0.361 1.088,-0.491 1.539,-0.188 l 0.207,0.138 c 0.086,-0.146 0.205,-0.267 0.364,-0.352 l 8.266,-4.425 c 0.27,-0.145 0.567,-0.116 0.863,0.031 l 0.252,-0.111 -0.786,-0.605 0,-0.748 -1.356,-1.035 0,-0.832 0.715,-0.395 0.417,0.32 0,-0.384 0.693,-0.363 0.278,0.213 0.011,-0.373 0.715,-0.374 0.363,0.331 -0.022,-0.086 -0.213,-0.277 -0.011,-0.224 0.737,-0.416 1.265,1.056 0,0.47 0.112,0.128 0.448,-0.246 2.124,1.751 0.011,0.16 0.096,0 0.8,0.662 0,0.854 -0.694,0.373 0,0.363 -0.939,0.363 0,0.16 -0.875,0.427 0,0.086 -0.715,0.405 -1.238,-0.982 -0.587,0.256 -0.295,-0.226 -0.228,0.098 0,0.247 c 0.798,1.18 1.212,2.887 0.306,3.322 l -0.013,0.007 -0.827,0.427 c 0.195,0.214 0.306,0.46 0.306,0.722 l 0,2.722 c 0,0.825 -1.102,1.494 -2.462,1.494 -0.424,0 -0.823,-0.065 -1.172,-0.18 l 3.488,2.485 c 0.151,0.108 0.267,0.232 0.352,0.367 0.055,0.001 0.108,0.006 0.161,0.016 0.037,-0.323 0.163,-0.581 0.405,-0.698 l 1.608,-0.777 c -0.013,-0.183 -0.025,-0.36 -0.032,-0.501 -0.028,-0.541 0.377,-1.381 0.452,-1.452 0,0 -0.263,-0.515 -0.166,-1.126 0.031,-0.188 0.107,-0.34 0.21,-0.46 -0.218,-0.207 -0.354,-0.499 -0.354,-0.823 0,-0.379 0.186,-0.713 0.47,-0.92 -0.166,-0.181 -0.304,-0.45 -0.326,-0.855 L -21.342,5.237 -21.63,4.782 c 0,0 -0.053,-0.954 1.427,-0.954 1.181,0.1 1.138,0.783 1.138,0.783 l -0.227,0.569 -0.014,2.007 c 0,0 -0.043,0.398 -0.25,0.711 0.297,0.205 0.491,0.548 0.491,0.936 0,0.324 -0.136,0.616 -0.353,0.823 0.108,0.117 0.193,0.252 0.234,0.391 0.119,0.398 0.062,0.754 -0.08,1.039 0,0 0.117,0.135 0.249,0.345 l 0.523,0 0.221,0.233 -0.002,0.001 c 0.488,-0.178 0.933,0.114 1.254,0.594 l 0.806,-0.387 -0.091,-2.096 0,-0.085 3.387,-1.679 0.342,0.313 0.111,1.747 6.048,-2.903 -0.175,-0.125 0,-0.918 -0.683,0.32 L -7.871,5.978 -7.946,4.964 -7.708,4.839 -7.999,4.611 -8.056,3.615 -7.857,3.501 -8.099,3.288 -8.134,2.444 l -21.705,-18.586 -0.389,0.238 0,-0.571 4.808,-2.971 2.387,-1.475 5.052,-3.121 24.619,23.444 0.185,0.513 z',
				// 	fillColor: '#fff',
				// 	fillOpacity: 1,
				// 	strokeWeight: 0,
				// 	rotation: 180,
				// 	scale: 0.4,
				// 	anchor: new google.maps.Point(12, 12),
				// };
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
			}, 10000);
		} catch(error) {
			console.log(error);
		}
	}
}