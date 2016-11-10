(function ($) {
    // Get some variables
    var googleapi, googlekey, class_data, baseurl, DayOfWeek, dayIndex, day, screenWidth, lastWidth;
    googleapi = 'https://maps.googleapis.com/maps/api';
    googlekey = 'AIzaSyAbNE0YwjOz0AU_USrIgSMYzl7DhZb185Q';
    DayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    lastWidth = 0;

    // Grab some data from a hidden input fields
    class_data = JSON.parse( $('#class_data').val() );

    // TODO : Review whether baseurl is still required.  Remove from main.hbs as well if not.
    baseurl    = $('#baseurl').val();
    day        = $('h2').text();
    dayIndex   = DayOfWeek.indexOf(day);


    $('#product-grid').mixItUp({
        load: {
            filter: '.' + day
        }
    });

    // Swipe Code
    $('#wrap').swipe({
        swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
            switch(direction) {
                case 'left':
                    // Scroll UP the weekdays Mon > Sun
                    (dayIndex < 6) ? dayIndex +=1 : dayIndex = 0;
                    break;

                case 'right':
                    // Scroll DOWN the weekdays Sun > Mon
                    (dayIndex > 0) ? dayIndex -=1 : dayIndex = 6;
                    break;
            }

            $('h2').text(DayOfWeek[dayIndex]);
            $('#product-grid').mixItUp('filter', '.' + DayOfWeek[dayIndex]);
        }
    });


    /**
     * This section of code modifies the class listings based on screen size.
     *
     * Mobile  (width < 635px) : Show a list of classes in a collapsed accordion.
     *
     * Desktop (width > 635px) : Show an expanded set of classes and
     *                           remove the accordion collapse feature
     */
    $(window).bind('resize load', function() {
        screenWidth = $(this).width();

        // this first 'if' removes an annoying feature where scrolling down a mobile
        // view would cause a resize event and collapse the accordions.
        if (screenWidth !== lastWidth) {
            if (screenWidth > 635) {
                $('.collapse').collapse('show');
                $('.panel-title').removeAttr('data-toggle');
            } else {
                $('.collapse').collapse('hide');
                $('.panel-title').attr('data-toggle', 'collapse');
            }
        }
        lastWidth = screenWidth;
    });



    // Download streetview image only when class details are shown
    $('.panel').on('show.bs.collapse', function(e) {
        var hdg    = '';
        var street = $(e.target).find('.street_view');
        var pos    = street.attr('data-latlon');

        if( street.attr('data-heading') != 'null' && street.attr('data-heading') != 0.00 )
            hdg = '&heading=' + street.attr('data-heading');

        var url ='https://maps.google.com/maps?q=' + pos;
        var img='<img src="' + googleapi + '/streetview?size=250x250&location=' + pos + hdg + '&key=' + googlekey + '" class="img-rounded" />';

        street.replaceWith('<a target="_blank" href="' + url + '">' + img + '</a>');
    });


    // Let's find our location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(gotPos, gotError, {
            maximumAge: 0,
            timeout: 5000,
            enableHighAccuracy: true
        });
    } else {
        $('#gps-status').removeClass().addClass('fa fa-times');
        $('#map_canvas').html('<p>Your browser does not support geo-location</p>');
    }

    function gotPos(position) {
        var latitude, longitude;
        latitude  = position.coords.latitude;
        longitude = position.coords.longitude;

        console.log('LonLat: ' + longitude + ', ' + latitude);
        $('#gps-status').removeClass().addClass('fa fa-map-marker');

        var myLatLng = new google.maps.LatLng(latitude, longitude);

        // Lets try and find our distance from each class
        var destinations = [];
        for (i=0; i<class_data.length; i++) {
            destinations.push( str = class_data[i].address.loc.coordinates[1] + ',' + class_data[i].address.loc.coordinates[0] );
        }

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [ myLatLng ],
            destinations: destinations,
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.IMPERIAL
        }, displayTravelInfo);


        function displayTravelInfo(data, status) {
            var i, travel, duration;

            if (status === 'OK') {
                i=0;
                console.log('DistanceMatrix: ' + status);
                $('.travel-info').each(function() {
                    travel   = data.rows[0].elements[i].distance.text;
                    duration = data.rows[0].elements[i].duration.text;

                    $(this).html('Distance from you: ' + travel + ' (' + duration + ')');
                    i++
                });

            } else {
                console.log('getDistanceMatrix Error: ' + status);
            }
        }
    }


    function gotError(msg) {
        console.log(msg);
        $('#gps-status').removeClass().addClass('fa fa-times');
    }

}) (jQuery);