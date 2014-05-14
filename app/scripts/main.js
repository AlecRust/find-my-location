/*!
 * Uses the HTML5 Geolocation API to plot your location and information on a map
 */

'use strict';

var map,
    google,
    geocoder,
    elevator,
    loadingMessage = document.getElementById('loading-message');

// Initialise Google Map
function initialize() {

  // Set up map options
  var mapOptions = {
    backgroundColor: '#005b41',
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };

  // Initialise map, geocoder and elevator
  map = new google.maps.Map(document.getElementById('location-map'), mapOptions);
  geocoder = new google.maps.Geocoder();
  elevator = new google.maps.ElevationService();

  // Try HTML5 geolocation
  if (navigator.geolocation) {

    // Browser supports Geolocation
    navigator.geolocation.getCurrentPosition(function (position) {

      // Remove loading message
      loadingMessage.parentNode.removeChild(loadingMessage);

      // Get lat/lng of user
      var userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      // Make user position a LocationElevationRequest object for elevation request
      var elevationRequest = {
        'locations': [userPosition]
      };

      // Set map center to user position
      map.setCenter(userPosition);

      // Output lat/lng to console
      console.log('Latitude: ' + userPosition.lat());
      console.log('Longitude: ' + userPosition.lng());

      // Configure info window
      var infoWindow = new google.maps.InfoWindow({
        content: '<div class="info-window">' +
                   '<dl id="info-window-content">' +
                     '<dt>Lat:</dt><dd>' + userPosition.lat() + '</dd>' +
                     '<dt>Lng:</dt><dd>' + userPosition.lng() + '</dd>' +
                   '</dl>' +
                 '</div>'
      });

      // Configure map marker
      var marker = new google.maps.Marker({
        map: map,
        position: userPosition,
        title: 'Click to zoom'
      });

      // Open info window on marker
      infoWindow.open(map, marker);

      // Reverse Geocode lat/lng for address
      geocoder.geocode({ 'latLng': userPosition }, function (results, status) {
        var infoWindowContent = document.getElementById('info-window-content');
        var addressResponse;
        var userAddressFormatted = results[0].formatted_address;

        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            addressResponse = userAddressFormatted;
            console.log('Address: ' + userAddressFormatted);
          } else {
            addressResponse = '<span class="error">Address not available</span>';
            console.log('No address result');
          }
        } else {
          addressResponse = '<span class="error">Geocode failed: ' + status + '</span>';
          console.log('Geocode failed: ' + status);
        }

        // Append to info window
        infoWindowContent.innerHTML = infoWindowContent.innerHTML + '<dt>Adr:</dt><dd>' + addressResponse + '</dd>';
      });

      // Determine elevation
      elevator.getElevationForLocations(elevationRequest, function (results, status) {
        var infoWindowContent = document.getElementById('info-window-content');
        var elevationResponse;
        var userElevationValue = results[0].elevation;

        if (status === google.maps.ElevationStatus.OK) {
          if (results[0]) {
            elevationResponse = userElevationValue;
            console.log('Elevation: ' + userElevationValue + ' meters');
          } else {
            elevationResponse = '<span class="error">Elevation not available</span>';
            console.log('No elevation result');
          }
        } else {
          elevationResponse = '<span class="error">Elevation failed: ' + status + '</span>';
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
