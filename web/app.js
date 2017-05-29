var app = (function() {
	function init(dataUri) {
		updateSourceDisplay(dataUri);
		
		loadJson(dataUri, function(features) {
			let mapTargetElement = document.getElementById('map');
			let map = prepareMap(mapTargetElement);
			updateNumber(features);
			showOnMap(map, features);
		});
	}
	
	function updateSourceDisplay(dataUri) {
		let sourceDisplayLink = document.getElementById("sourceLink");
		let sourceDisplay = document.getElementById("source");
		sourceDisplayLink.href = dataUri;
		sourceDisplayLink.textContent = dataUri;
	}
	
	function prepareMap(targetElement) {
		var map = new google.maps.Map(targetElement, {
		  zoom: 12,
		  center: new google.maps.LatLng(48.2, 16.35),
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		return map;
	}

	function loadJson(uri, success) {
		var request = new XMLHttpRequest;
		request.onload = function(e) {
			if (request.status >= 200 && request.status < 400) {
				var data = JSON.parse(request.responseText);
				success(data.features);
			}
			else {
				console.warn("uje");
			}
		};
		request.onerror = function() {
			console.error("Error loading data!");
			alert("Error loading data!");
		};
		request.open("GET", uri, true);
		request.send();
	}
	
	function updateNumber(features) {
		document.getElementById("number").innerText = features.length;
	}
	
	function showOnMap(map, features) {
		var infowindow = new google.maps.InfoWindow();
		for (let i=0; i<features.length; i++) {
			let feature = features[i];
			showFeatureOnMap(map, feature, infowindow);
		}
	}
	
	function showFeatureOnMap(map, feature, infowindow) {
		let marker = new google.maps.Marker({
			position: new google.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]),
			map: map
		});
		
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
			  infowindow.setContent("<p><b>" + feature.properties.STANDORT + "</b></p>" + "<p>" + feature.properties.ANGEBOT + "</p>");
			  infowindow.open(map, marker);
			}
		})(marker, feature));
	}
	
	return {
		init: init,
	};
})();