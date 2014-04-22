/*!
 * Basic usage of the HTML5 Geolocation API to plot users' location on a map
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
        },
    };
    map = new google.maps.Map(document.getElementById('location-map-canvas'),
        mapOptions);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            
            // Remove loading message and hidden map intro from DOM
            $('.loading-message, .location-map-intro').remove();
            
            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);

            var infowindow = new google.maps.InfoWindow({
                content: 'Here you are!'
            });

            var marker = new google.maps.Marker({
                map: map,
                position: pos
            });

            map.setCenter(pos);

            // Set map hue colour
            map.set('styles', [{
                stylers: [
                    { hue: '#005b41' }
                ]
            }]);

            // Open info window on marker click
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
                map.setZoom(18);
                map.setCenter(marker.getPosition());
            });
        }, function () {
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
        errorContent = 'Your browser doesn\'t support geolocation :(';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: errorContent
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

// Asynchronously load Google Maps API
function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&' +
        'callback=initialize';
    document.body.appendChild(script);
}

window.onload = loadScript;
