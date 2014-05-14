/*!
 * Basic usage of the HTML5 Geolocation API to plot user location on a map
 */

'use strict';

var map,
    google,
    geocoder,
    elevator;

// Initialise Google Map
function initialize() {

  var mapOptions = {
    backgroundColor: '#005b41',
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };

  map = new google.maps.Map(document.getElementById('location-map'), mapOptions);
  geocoder = new google.maps.Geocoder();
  elevator = new google.maps.ElevationService();

  // Try HTML5 geolocation
  if (navigator.geolocation) {

    // Browser supports Geolocation
    navigator.geolocation.getCurrentPosition(function (position) {

      // Remove loading message
      var loadingMessage = document.getElementById('loading-message');
      loadingMessage.parentNode.removeChild(loadingMessage);

      // Get lat/lng of user
      var userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      // Configure info window
      var infoWindow = new google.maps.InfoWindow({
        content: '<div class="info-window">' +
                   '<dl id="info-window-content">' +
                     '<dt>Lat:</dt><dd>' + userPosition.lat() + '</dd>' +
                     '<dt>Lng:</dt><dd>' + userPosition.lng() + '</dd>' +
                   '</dl>' +
                 '</div>'
      });

      // Output lat/lng to console
      console.log('Latitude: ' + userPosition.lat());
      console.log('Longitude: ' + userPosition.lng());

      // Configure map marker
      var marker = new google.maps.Marker({
        map: map,
        position: userPosition,
        title: 'Click to zoom'
      });

      // Set map center to user position
      map.setCenter(userPosition);

      // Set map hue colour
      map.set('styles', [{
        stylers: [
          { hue: '#005b41' }
        ]
      }]);

      // Open info window on marker
      infoWindow.open(map, marker);

      // Reverse Geocode lat/lng for address
      geocoder.geocode({ 'latLng': userPosition }, function (results, status) {
        var infoWindowContent = document.getElementById('info-window-content');
        var addressResponse;
        var userAddressFormatted = results[0].formatted_address;
        if (status === google.maps.GeocoderStatus.OK) {
          addressResponse = userAddressFormatted;
          console.log('Address: ' + userAddressFormatted);
        } else {
          addressResponse = '<span class="error">Street address not available</span>';
          console.log('Geocode failed: ' + status);
        }

        // Append to info window
        infoWindowContent.innerHTML = infoWindowContent.innerHTML + '<dt>Adr:</dt><dd>' + addressResponse + '</dd>';
      });

      // Make user position a LocationElevationRequest object
      var positionalRequest = {
        'locations': [userPosition]
      };

      // Determine elevation
      elevator.getElevationForLocations(positionalRequest, function (results, status) {
        var infoWindowContent = document.getElementById('info-window-content');
        var elevationResponse;
        var userElevationValue = results[0].elevation;
        if (status === google.maps.ElevationStatus.OK) {
          elevationResponse = userElevationValue;
          console.log('Elevation: ' + userElevationValue + ' meters');
        } else {
          elevationResponse = '<span class="error">Elevation not available</span>';
          console.log('Elevation failed: ' + status);
        }

        // Append to info window
        infoWindowContent.innerHTML = infoWindowContent.innerHTML + '<dt>Ele:</dt><dd>' + elevationResponse + ' meters</dd>';
      });

      // Zoom to marker on click
      google.maps.event.addListener(marker, 'click', function () {
        map.panTo(userPosition);
        map.setZoom(19);
        map.setTilt(45);
      });

    }, function () {
      // Browser supports Geolocation, but user declined
      handleNoGeolocation(true);
    });

  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

// Show error message info window
function handleNoGeolocation(errorFlag) {
  var errorContent,
      defaultLatLng = new google.maps.LatLng(52, -1);

  // Remove loading message
  var loadingMessage = document.getElementById('loading-message');
  loadingMessage.parentNode.removeChild(loadingMessage);

  if (errorFlag) {
    errorContent = 'Please allow location information';
  } else {
    errorContent = 'Your browser doesn\'t support Geolocation';
  }

  var infoWindowOptions = {
    map: map,
    position: defaultLatLng,
    content: '<div class="info-window-error">' +
               '<p>' + errorContent + '</p>' +
             '</div>'
  };

  var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
  map.setCenter(infoWindowOptions.position);
}

google.maps.event.addDomListener(window, 'load', initialize);
