/*!
 * Basic usage of the HTML5 Geolocation API to plot user location on a map
 */

'use strict';

var map,
    google,
    geocoder;

// Initialise Google Map
function initialize() {
    
    var mapOptions = {
        backgroundColor: '#005b41',
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };
    
    map = new google.maps.Map(document.getElementById('location-map-canvas'), mapOptions);
    geocoder = new google.maps.Geocoder();

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        
        // Browser supports Geolocation
        navigator.geolocation.getCurrentPosition(function (position) {
            
            // Remove loading message and hidden map intro from DOM
            $('.loading-message, .location-map-intro').remove();
            
            // Get lat/lng of user
            var userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            // Configure info window
            var infoWindow = new google.maps.InfoWindow({
                content: '<div class="info-window">' +
                    '<dl>' +
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

            // Reverse Geocode lat/lng
            geocoder.geocode({ 'latLng': userPosition }, function (results, status) {
                var $infoWindowContent = $('.info-window dl');
                var userAddress;
                var userAddressFormatted = results[0].formatted_address;
                if (status === google.maps.GeocoderStatus.OK) {
                    userAddress = userAddressFormatted;
                    console.log('Address: ' + userAddressFormatted);
                } else {
                    userAddress = '<span class="error">Street address not available</span>';
                    console.log('Geocode failed: ' + status);
                }
                
                // Append address line to info window
                $infoWindowContent.append('<dt>Adr:</dt><dd>' + userAddress + '</dd>');
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

    // Remove loading message and hidden map intro from DOM
    $('.loading-message, .location-map-intro').remove();
    
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

// Asynchronously load Google Maps API
function loadScript() {
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&' + 'callback=initialize';
    document.body.appendChild(script);
}

window.onload = loadScript;
