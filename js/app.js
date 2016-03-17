
var g_markersArray = [
    {
        title: "Schwartz's Deli",
        address: '3895 Boul St-Laurent, Montréal, QC H2W 1X9',
        infoContent: 'Test',
        mapMarker: null,
        geoLocation: null,
        infoWindow: null
    }, 
    {
        title: 'Vol De Nuit',
        address: '14 Rue Prince Arthur E, Montréal, QC H2X 1S3',
        infoContent: 'Test',
        mapMarker: null,
        geoLocation: null,
        infoWindow: null
    }, 
    {
        title: 'Café Saint Laurent Frappé',
        address: '3900 Boul St-Laurent, Montréal, QC H2W 1Y2',
        infoContent: 'Test',
        mapMarker: null,
        geoLocation: null,
        infoWindow: null
    }, 
    {
        title: 'Bar Bifteck St-Laurent',
        address: '3702 Boul St-Laurent, Montréal, QC H2X 2V4',
        infoContent: 'Test',
        mapMarker: null,
        geoLocation: null,
        infoWindow: null
    }, 
    {
        title: 'La Belle Province',
        address: '3608, boul Saint-Laurent, Montréal, QC H2X 2V4',
        infoContent: 'Test',
        mapMarker: null,
        geoLocation: null,
        infoWindow: null
    }      
];

var g_testFailures = {
    testGeocodeFailure: false  
};

$(function(){
    // Set map container width and height relative to the window width and height
    // Couldn't figure out how to do it with css percentages.
    var mapWidth = $(window).width() * 0.85;
    var mapHeight = $(window).height() * 0.9;
    $('#map').width(mapWidth + 'px');
    $('#map').height(mapHeight + 'px');
    
    // Populate the menu of markers 
    for (var i = 0; i < g_markersArray.length; i++) {
        $('#main_menu').append(
            '<div class="menu_item pointer_cursor" onclick="openInfoWindowByIndex(' + i + ')"> - ' + g_markersArray[i].title + '</div>'  
        );
    }
});

function toggleMenuContainer() {
    $('#menu_container').toggle()
}

function updateFilter() {
    console.log('in updateFilter: ' + $('#filter_text_field').val());
}

function displayMessage(p_message, p_messageType) {
    // Display the message
    var messageDisplay = $('#message_display');
    messageDisplay.show()
    messageDisplay.text(p_message);
    
    // Change text color depending on type of message
    switch (p_messageType) {
        case 'negative':
            messageDisplay.addClass('negative_message');
            break;
        case 'positive':
            messageDisplay.addClass('positive_message');
            break;
        default:
            messageDisplay.addClass('neutral_message');
    }
    
    // In 10 seconds hide the message
    window.setTimeout(function() {
        messageDisplay.hide()
        messageDisplay.text('');
        messageDisplay.removeClass('negative_message');
        messageDisplay.removeClass('positive_message');
        messageDisplay.removeClass('neutral_message');
    }, 10000);
}

