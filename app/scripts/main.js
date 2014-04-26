/*!
 * Basic usage of the HTML5 Geolocation API to plot user location on a map
 */

'use strict';

var map,
    google;

// Initialise Google Map
function initialize() {
    var mapOptions = {
        backgroundColor: '#005b41',
        zoom: 8,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    };
    map = new google.maps.Map(document.getElementById('location-map-canvas'), mapOptions);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            
            // Remove loading message and hidden map intro from DOM
            $('.loading-message, .location-map-intro').remove();
            
            var userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            // Configure info window
            var infoWindow = new google.maps.InfoWindow({
                content: '<div class="info-window">' +
                    '<h2>Here you are!</h2>' +
                    '<p><b>Lat:</b> ' + userPosition.lat() + '</p>' +
                    '<p><b>Lng:</b> ' + userPosition.lng() + '</p>' +
                    '</div>'
            });

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

            // Open and zoom to info window on marker click
            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open(map, marker);
                map.setCenter(userPosition);
                map.setZoom(18);
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
    var errorContent;
    
    if (errorFlag) {
        errorContent = 'Allow location information to display it on this map';
    } else {
        errorContent = 'Your browser doesn\'t support Geolocation';
    }

    var mapOptions = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: errorContent
    };

    var infoWindow = new google.maps.InfoWindow(mapOptions);
    map.setCenter(mapOptions.position);
}

// Asynchronously load Google Maps API
function loadScript() {
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&' + 'callback=initialize';
    document.body.appendChild(script);
}

window.onload = loadScript;
