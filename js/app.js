
var g_markersArray = [
    {
        index: 0,
        title: "Schwartz's Deli",
        address: '3895 Boul St-Laurent, Montréal, QC H2W 1X9',
        description: 'World Famous Original Smoked Meat! Over 80 years of tradition - A Montreal classic. The oldest deli in Canada. A true Montreal landmark situated on the historic "Main".',
        website: 'http://www.schwartzsdeli.com', 
        infoContent: '',
        mapMarker: null,
        geoLocation: null,
        infoWindow: null
    }, 
    {
        index: 1, 
        title: 'Vol De Nuit',
        address: '14 Rue Prince Arthur E, Montréal, QC H2X 1S3',
        description: 'Good bar with a juke box, TVs and video gampbling machines. Student hangout.',
        website: '',
        infoContent: '',
        mapMarker: null,
        geoLocation: null,
        infoWindow: null
    }, 
    {
        index: 2, 
        title: 'Café Saint Laurent Frappé',
        address: '3900 Boul St-Laurent, Montréal, QC H2W 1Y2',
        description: 'Spacious sports bar featuring pool tables, foosball & a patio, plus straightforward pub grub.',
        website: 'http://www.barstlaurentfrappe.com',
        infoContent: '',
        mapMarker: null,
        geoLocation: null,
        infoWindow: null
    }, 
    {
        index: 3, 
        title: 'Bar Bifteck St-Laurent',
        address: '3702 Boul St-Laurent, Montréal, QC H2X 2V4',
        description: 'Good student/hipster bar with pool tables and TVs',
        website: '',
        infoContent: '',
        mapMarker: null,
        geoLocation: null,
        infoWindow: null
    }, 
    {
        index: 4, 
        title: 'La Belle Province',
        address: '3608, boul Saint-Laurent, Montréal, QC H2X 2V4',
        description: 'La Belle Province is a well-known fast food restaurant chain in the province of Quebec, Canada. It is also known as La Belle Pro, Belle Pro, or La Belle as nicknames. Each location is independently franchised; some are open 24 hours a day.',
        website: 'http://restaurantlabelleprovince.com/fr/accueil/',
        infoContent: '',
        mapMarker: null,
        geoLocation: null,
        infoWindow: null
    }      
];

var g_infoTitleHTMLBase = '<div class="info_title">%info_title%</div>';
var g_infoAddressHTMLBase = '<div class="info_address">%info_address%</div>';
var g_infoDescriptionHTMLBase = '<div class="info_description">%info_description%</div>';
var g_infoWebsiteHTMLBase = '<div class="info_website"><a href="%info_website%">%info_website%</a></div>';
var g_infoImageHTMLBase = '<div class="info_image"><img src="http://maps.googleapis.com/maps/api/streetview?size=300x200&location=%info_image_location%"/></div>'

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

