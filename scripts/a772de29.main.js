"use strict";function initialize(){var a={backgroundColor:"#005b41",zoom:16};map=new google.maps.Map(document.getElementById("location-map-canvas"),a),navigator.geolocation?navigator.geolocation.getCurrentPosition(function(a){var b=new google.maps.LatLng(a.coords.latitude,a.coords.longitude),c=new google.maps.InfoWindow({content:"Here you are!"}),d=new google.maps.Marker({map:map,position:b});map.setCenter(b),map.set("styles",[{stylers:[{hue:"#005b41"}]}]),google.maps.event.addListener(d,"click",function(){c.open(map,d)})},function(){handleNoGeolocation(!0)}):handleNoGeolocation(!1)}function handleNoGeolocation(a){var b;b=a?"Allow location information to display it on this map":"Your browser doesn't support geolocation :(";{var c={map:map,position:new google.maps.LatLng(60,105),content:b};new google.maps.InfoWindow(c)}map.setCenter(c.position)}var map,google;google.maps.event.addDomListener(window,"load",initialize);