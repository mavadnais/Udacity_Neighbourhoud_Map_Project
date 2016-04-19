
'use strict';

var g_map;
var g_geocoder;
var g_mapInitialized = false;
var g_displayedMapInitError = false;

function initMap() {
    // Create a map object and specify the DOM element for display.
    g_map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16
    });
    
    // Create geocoder for converting addresses to longitude/latitude
    g_geocoder = new google.maps.Geocoder();
    
    // Add markers to the map
    for (var i = 0;  i < g_markersArray.length; i++) {
        addMarkerToMap(g_markersArray[i]);
    }
    
    g_mapInitialized = true;
}

function initMapError() {
    g_displayedMapInitError = true;
    displayMessage('Could not initialize Google Map.', 'negative');  
}

// In 3 seconds check if map has been initialized
window.setTimeout(function() {
    if (! g_mapInitialized && ! g_displayedMapInitError) {
        displayMessage('Could not initialize Google Map.', 'negative');
    }
}, 3000);

function addMarkerToMap(p_marker) {
    g_geocoder.geocode( { 'address': p_marker.address}, function(p_results, p_status) {
        if (p_status == google.maps.GeocoderStatus.OK && !g_testFailures.testGeocodeFailure) {
            // Set the center to this latest marker
            p_marker.geoLocation = p_results[0].geometry.location;
            g_map.setCenter(p_marker.geoLocation);
            
            // Create the new marker on the map
            p_marker.mapMarker = new google.maps.Marker({
                position: p_marker.geoLocation,
                map: g_map,
                title: p_marker.title
            });
            
            generateInfoContent(p_marker);
            
            // Create info window
            p_marker.infoWindow = new google.maps.InfoWindow({
                content: p_marker.infoContent
            });
            
            // Add listener so info window opens when marker is clicked
            p_marker.mapMarker.addListener('click', function() {
                openInfoWindowByMarker(p_marker);
                // TODO REMOVE: toggleAnimationByMarker(p_marker);
                animateMarkerByMarker(p_marker);
            });
        } 
        else {
            displayMessage('ERROR: Geocode was not successful for the following reason: ' + p_status, 'negative');
        }
    });
}

function openInfoWindowByIndex(p_markerIndex) {
    var marker = g_markersArray[p_markerIndex];
    openInfoWindowByMarker(marker);
}

function openInfoWindowByMarker(p_marker) {
     // Close all other info windows
    for (var i = 0;  i < g_markersArray.length; i++) {
        if (g_markersArray[i] != p_marker) {
            closeInfoWindowByMarker(g_markersArray[i]);
        }   
    }
    
    // Open info window
    p_marker.infoWindow.open(g_map, p_marker.mapMarker);
}

function closeInfoWindowByMarker(p_marker) {
    p_marker.infoWindow.close();
}

function closeAllInfoWindows() {
    for (var i = 0;  i < g_markersArray.length; i++) {
        closeInfoWindowByMarker(g_markersArray[i]);  
    }    
}

function animateMarkerByIndex(p_markerIndex) {
    var marker = g_markersArray[p_markerIndex];
    animateMarkerByMarker(marker);
}

function animateMarkerByMarker(p_marker) {
    if (p_marker.mapMarker.getAnimation() == null) {
        p_marker.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
        
        window.setTimeout(function() {
            p_marker.mapMarker.setAnimation(null);
        }, 700);
    }
}

function setAllMapMarkersVisible(p_isVisible) {
    for (var i = 0;  i < g_markersArray.length; i++) {
        g_markersArray[i].mapMarker.setVisible(p_isVisible);  
    } 
}

/* TODO REMOVE
function selectMarkerByIndex(p_markerIndex) {
    var marker = g_markersArray[p_markerIndex];
    
    SelectMarkerByMarker(marker);
}

function selectMarkerByMarker(p_marker) {  
    // Animate marker
    p_marker.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
}

function deselectAllMarkers() {  
    // Stop all animations
    for (var i = 0;  i < g_markersArray.length; i++) {
        g_markersArray[i].mapMarker.setAnimation(null);  
    }
}

function toggleAnimationByMarker(p_marker) {
    if (p_marker.mapMarker.getAnimation() !== null) {
        p_marker.mapMarker.setAnimation(null);
    }
    else {
        p_marker.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
    }
}
*/