
var g_markersArray = [
    {
        index: 0,
        title: "Schwartz's Deli",
        address: '3895 Boul St-Laurent, Montréal, QC H2W 1X9',
        description: 'World Famous Original Smoked Meat! Over 80 years of tradition - A Montreal classic. The oldest deli in Canada. A true Montreal landmark situated on the historic "Main".',
        website: 'http://www.schwartzsdeli.com',
        yelpBusinessID: 'schwartzs-montreal-2',
        yelpInfo: '', 
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
        yelpBusinessID: 'vol-de-nuit-montreal-2',
        yelpInfo: '', 
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
        yelpBusinessID: 'cafe-saint-laurent-frappe-le-montreal-4',
        yelpInfo: '', 
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
        yelpBusinessID: 'st-laurent-bifteck-montreal-4',
        yelpInfo: '', 
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
        yelpBusinessID: 'belle-province-montreal-2',
        yelpInfo: '', 
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
var g_infoImageHTMLBase = '<div class="info_image"><img src="http://maps.googleapis.com/maps/api/streetview?size=150x100&location=%info_image_location%"/></div>'
var g_infoYelpHTMLBase = '<div class="info_yelp">%info_yelp%</div>'

var g_testFailures = {
    testGeocodeFailure: false  
};

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

// Code to get yelp reviews is mainly taken from: https://github.com/levbrie/mighty_marks/blob/master/yelp-business-sample.html
// Although it was adapted to be object-oriented and reusable
var YelpRetriever = function() {
    this.auth = {
        // These secret keys shouldn't be exposed, but since everything in this app is client-side, here they are
        consumerKey : "ER90mCERioR9vSegdPALVg",
		consumerSecret : "gacwUcrNK_0FZX_waSd4UwMwZNI",
		accessToken : "v0lPLknf1qnjY1GP1b8SHybFvtWBMH-a",
		accessTokenSecret : "isyO1TCmRcyBqddfw-0XIdk_nuM",
		serviceProvider : {
		    signatureMethod : "HMAC-SHA1"
		}
	};
    
	this.accessor = {
	    consumerSecret : this.auth.consumerSecret,
		tokenSecret : this.auth.accessTokenSecret
	};
	
    this.parameters = [];
	this.parameters.push(['callback', 'cb']);
	this.parameters.push(['oauth_consumer_key', this.auth.consumerKey]);
	this.parameters.push(['oauth_consumer_secret', this.auth.consumerSecret]);
	this.parameters.push(['oauth_token', this.auth.accessToken]);
	this.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
};

YelpRetriever.prototype.getYelpInfo = function(p_marker) {
    console.log('Get yelp review for: ' + p_marker.title);
    
    var yelpURLBase = 'http://api.yelp.com/v2/business/'
    var message = {
	    'action' : yelpURLBase + p_marker.yelpBusinessID,
		'method' : 'GET',
		'parameters' : this.parameters
	};
    
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, this.accessor);
			
    var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
	console.log('parameterMap:');
    console.log(parameterMap);
    
    // Make the Ajax Call
	$.ajax({
	    'url' : message.action,
		'data' : parameterMap,
		'cache' : true,
		'dataType' : 'jsonp',
		'jsonpCallback' : 'cb',
		'success' : function(data, textStats, XMLHttpRequest) {
            console.log('In yelp ajax success');
		    console.log(data);
            p_marker.yelpInfo = data;
            
            var yelpReview = '<br>Yelp Review: ' + p_marker.yelpInfo.rating + '<br>';
            yelpReview += '<img src="' + p_marker.yelpInfo.rating_img_url + '"/>';
            p_marker.infoContent += g_infoYelpHTMLBase.replace('%info_yelp%', yelpReview);
            p_marker.infoWindow.content = p_marker.infoContent;
		},
        'error' : function(XMLHttpRequest, textStatus, errorThrown) {
            displayMessage('Could not get yelp info for: ' + p_marker.title + 
                ', textStatus: ' + textStatus +
                ', errorThrown: ' + errorThrown, 'negative');
        }
	});
};

// TODO: do something with this if necessary
function cb() {
    console.log('In cb');
}

var g_yelpRetriever = new YelpRetriever();

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

function generateInfoContent(p_marker) {
    // Generate info window content html
    p_marker.infoContent = g_infoTitleHTMLBase.replace('%info_title%', p_marker.title);
    p_marker.infoContent += '<br>';
    p_marker.infoContent += g_infoAddressHTMLBase.replace('%info_address%', p_marker.address);
    p_marker.infoContent += '<br>';
    p_marker.infoContent += g_infoDescriptionHTMLBase.replace('%info_description%', p_marker.description);
    p_marker.infoContent += '<br>';
    if (p_marker.website) {
        p_marker.infoContent += g_infoWebsiteHTMLBase.replace(new RegExp('%info_website%', 'g'), p_marker.website);
        p_marker.infoContent += '<br>';
    }
    p_marker.infoContent += g_infoImageHTMLBase.replace('%info_image_location%', p_marker.address);
    
    g_yelpRetriever.getYelpInfo(p_marker);
}

