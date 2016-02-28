
var g_map;
var g_geocoder;

function initMap() {
 
    // Create a map object and specify the DOM element for display.
    g_map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15
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
        if (p_status == google.maps.GeocoderStatus.OK) {
            // Set the center to this latest marker
            g_map.setCenter(p_results[0].geometry.location);
            
            // Create the new marker on the map
            p_marker.marker = new google.maps.Marker({
                position: p_results[0].geometry.location,
                map: g_map,
                title: p_marker.title
            });
        } 
        else {
            // TODO: better error handling in message box under title
            alert('Geocode was not successful for the following reason: ' + p_status);
        }
    });
}