
var g_map;
var g_geocoder;

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
}

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
            
            // Create info window
            p_marker.infoWindow = new google.maps.InfoWindow({
                content: p_marker.infoContent
            });
            
            // Add listener so info window opens when marker is clicked
            p_marker.mapMarker.addListener('click', function() {
                openInfoWindowByMarker(p_marker);
            });
        } 
        else {
            // TODO: better error handling in message box under title
            //alert('Geocode was not successful for the following reason: ' + p_status);
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
        if (g_markersArray[i] != p_marker)
            g_markersArray[i].infoWindow.close();    
    }
    
    // Open info window and center on marker
    p_marker.infoWindow.open(g_map, p_marker.mapMarker);
    g_map.setCenter(p_marker.geoLocation);
}