var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

var serverUrl = 'https://www.skybooker.com/';

window.stop = 1;

//focus flights from city input box
$('#startPoint input').focus();

var startDate, endDate, startInstance, endInstance;
var fillInputs = function() {
    startInstance.$elem.val(startDate ? startDate.locale(startInstance.config.format).format(startInstance.config.format) : "");
    endInstance.$elem.val(endDate ? endDate.locale(endInstance.config.format).format(endInstance.config.format) : "");
};

var startDate, endDate, startInstance, endInstance;
var fillInputs = function() {
    startInstance.$elem.val(startDate ? startDate.locale(startInstance.config.format).format(startInstance.config.format) : "");
    endInstance.$elem.val(endDate ? endDate.locale(endInstance.config.format).format(endInstance.config.format) : "");
};




// check login & multi city


(function() {


    if (localStorage.getItem('user_details')) {

        $('.login-user').show();
        $('.signin').hide();

        var userDetails = JSON.parse(localStorage.getItem('user_details'));

        $('.login-user .nav-link').html('<img src="' + userDetails.profilePicture + '" /> ' + userDetails.firstName);
    } else {
        $('.signin').show();
    }

    $('.login-user .nav-link').click(function(item) {

        localStorage.removeItem('user_details');
        $('.login-user').hide();
        $('.signin').show();
    });







})();



$('#multiTrip').click(function() {


    $('.multi-city-container').css('display', 'inherit');
    $('.round-trip').hide();

    $(".datepicker").caleran({
        singleDate: true,
        calendarCount: 1,
        showHeader: true,
        showFooter: false,
        autoCloseOnSelect: true,

        format: 'MMM D, YYYY'

    });

    $('.add-stop, #stops').show();

});

$('#oneTrip, #roundTrip').click(function() {
    $('.multi-city-container').css('display', 'none');
    $('.round-trip').show();
    $('.add-stop,.remove-stop,#stops').hide();
})


$('.add-stop').click(function() {


    window.stop++;



    $('.multi-city-container').append('   <div class="checkin multi-city-row"  >' + $('.multi-city-row').html() + '</div>');

    $(".datepicker").caleran({
        singleDate: true,
        calendarCount: 1,
        showHeader: true,
        showFooter: false,
        autoCloseOnSelect: true,

        format: 'MMM D, YYYY'

    });

    loadAutoSuggest();


    $('.remove-stop').show();
    $('.add-stop').show();

    if (window.stop > 3) {
        $('.add-stop').hide();

    } else if (window.stop < 2) {
        $('.remove-stop').hide();
    }


});

$('.remove-stop').click(function() {


    $('.multi-city-row').last().remove();
    window.stop--;



    $('.remove-stop').show();
    $('.add-stop').show();

    if (window.stop > 3) {
        $('.add-stop').hide();
    } else if (window.stop < 2) {
        $('.remove-stop').hide();
    }


});



function initilizeDateRangePicker(tab) {





    if (tab == 3 || tab == 2 || tab == 1) {


        if (tab == 3 || tab == 1) {

            var startClass = '#flightStart';
            var endClass = '#flightEnd';
        } else if (tab == 2) {
            var startClass = '#hotelsStart';
            var endClass = '#hotelsEnd';

        }


        if (tab == 1) {
            $('.tripsTab').hide();
            $('#flights .Title').html('Find best deals for Flights + Tours');



        } else {
            $('.tripsTab').show();
            $('#flights .Title').html('Find cheap flight deals &amp; packages');
        }


        $(startClass).caleran({
            // startEmpty: $(startClass).val() === "",
            startDate: moment().add(30, 'days'),
            endDate: moment().add(36, 'days'),
            minDate: moment(),

            format: 'MMM D, YYYY',
            enableKeyboard: false,
            showFooter: false,
            showHeader: true,
            oninit: function(instance) {
                startInstance = instance;
                if (!instance.config.startEmpty && instance.config.startDate) {
                    instance.$elem.val(instance.config.startDate.locale(instance.config.format).format(instance.config.format));
                    startDate = instance.config.startDate.clone();
                }
            },
            onbeforeshow: function(instance) {
                if (startDate) {
                    startInstance.config.startDate = startDate;
                    endInstance.config.startDate = startDate;
                }
                if (endDate) {
                    startInstance.config.endDate = endDate.clone();
                    endInstance.config.endDate = endDate.clone();
                }
                fillInputs();
                instance.updateHeader();
                instance.reDrawCells();
            },
            onfirstselect: function(instance, start) {
                startDate = start.clone();
                startInstance.globals.startSelected = false;
                startInstance.hideDropdown();
                endInstance.showDropdown();
                endInstance.config.minDate = startDate.clone();
                endInstance.config.startDate = startDate.clone();
                endInstance.config.endDate = null;
                endInstance.globals.startSelected = true;
                endInstance.globals.endSelected = false;
                endInstance.globals.firstValueSelected = true;
                endInstance.setDisplayDate(start);
                if (endDate && startDate.isAfter(endDate)) {
                    endInstance.globals.endDate = endDate.clone();
                }
                endInstance.updateHeader();
                endInstance.reDrawCells();
                fillInputs();
            }
        });


        $(endClass).caleran({
            // startEmpty: $(endClass).val() === "",
            startDate: $(startClass).val(),
            endDate: moment().add(36, 'days'),


            format: 'MMM D, YYYY',
            showFooter: false,
            showHeader: true,
            autoCloseOnSelect: true,
            oninit: function(instance) {
                endInstance = instance;
                if (!instance.config.startEmpty && instance.config.endDate) {
                    instance.$elem.val(instance.config.endDate.locale(instance.config.format).format(instance.config.format));
                    endDate = instance.config.endDate.clone();
                }
            },
            onbeforeshow: function(instance) {
                if (startDate) {
                    startInstance.config.startDate = startDate;
                    endInstance.config.startDate = startDate;
                }
                if (endDate) {
                    startInstance.config.endDate = endDate.clone();
                    endInstance.config.endDate = endDate.clone();
                }
                fillInputs();
                instance.updateHeader();
                instance.reDrawCells();
            },
            onafterselect: function(instance, start, end) {
                startDate = start.clone();
                endDate = end.clone();
                endInstance.hideDropdown();
                startInstance.config.endDate = endDate.clone();
                startInstance.globals.firstValueSelected = true;
                fillInputs();
                endInstance.globals.startSelected = true;
                endInstance.globals.endSelected = false;
            }
        });






    }


}



$('.search-step').click(function(v) {

    initilizeDateRangePicker($(this).data('active'));

});


// initial load for flights (Default option)

initilizeDateRangePicker(3);




// tabs active     
$(".search-step").click(function() {
    $('.search-step.active').removeClass('active');
    $(this).addClass('active');
});
$(".tripsTab ul li").click(function() {
    $('.tripsTab ul li.active').removeClass('active');
    $(this).addClass('active');
});

// hide the calendar
$('#oneTrip').on('click', function() {
    $('#twoWay').hide();
    $('#oneWay').css('border','none');
    // $('#oneWay input').removeClass('caleran-ex-6-5-start');
    // $('#oneWay input').addClass('caleran-ex-6-2');
    // $(".caleran-ex-6-2").caleran({
    //     singleDate: true,
    //     calendarCount: 1,
    //     showHeader: false,
    //     showFooter: false,
    //     autoCloseOnSelect: true
    //   });  


    $('#flightStart').data('caleran').config.singleDate = true;
    $('#flightStart').data('caleran').config.autoCloseOnSelect = true;
});
$('#roundTrip').on('click', function() {
    $('#twoWay').show();
    $('#oneWay').css('border-right','rgba(0,0,0, 0.2) 2px solid');
    // $('#oneWay input').removeClass('caleran-ex-6-2');
    // $('#oneWay input').addClass('caleran-ex-6-5-start');

    $('#flightStart').data('caleran').config.singleDate = false;
    $('#flightStart').data('caleran').config.autoCloseOnSelect = false;

});

$('.dropdown-menu li').on('click', function() {
    var getValue = $(this).text();
    $('.dropdown-select').text(getValue);
});


$('input, select').focus(function() {

    $(this).next("span.arrow").addClass("rotate");
});
$('input, select').focusout(function() {

    $(this).next("span.arrow").removeClass("rotate");
});

$('input, select').keyup(function() {
    $(this).next('span.error').hide();
});





$('#popular-hotels,#popular-tours').carousel({
    pause: true,
    interval: false,
});






// deep link url for flights

$("#flightSubmit").on('click', function() {
    var from = $('#startPoint .autosuggest').val().split("-");


    var to = $('#fromPoint .autosuggest').val().split("-");
    var adult = $("#adult_r option:selected").val();
    var child = $("#child_r option:selected").val();
    var infant = $("#infant_r option:selected").val();
    var cabin = $("#cabin_r option:selected").val();

    var oneWayDepart = moment($('#flightStart').val(), 'MMM D, YYYY').format('D-MMM-YYYY');
    var twoWayDepart = moment($('#flightEnd').val(), 'MMM D, YYYY').format('D-MMM-YYYY');


    if (from[1] && from[1].replace(' ', '').length == 3 && !$('.multi-city-container').is(':visible')) {
        from = from[1].replace(' ', '').toUpperCase();
    } else if (from[0].replace(' ', '').length == 3 && !$('.multi-city-container').is(':visible')) {
        from = from[0].replace(' ', '').toUpperCase();

    } else if (!$('.multi-city-container').is(':visible')) {
        $('#startPoint input').after('<span class="error">Please select the origin</span>');

        console.log('in here');
        return false;
    }




    if (to[1] && to[1].replace(' ', '').length == 3 && !$('.multi-city-container').is(':visible')) {
        to = to[1].replace(' ', '').toUpperCase();
    } else if (to[0].replace(' ', '').length == 3 && !$('.multi-city-container').is(':visible')) {
        to = to[0].replace(' ', '').toUpperCase();

    } else if (!$('.multi-city-container').is(':visible')) {
        $('#fromPoint input').after('<span class="error">Please select the departure</span>');

        console.log('in here');
        return false;

    }




    if ($('.multi-city-container').is(':visible')) {



        var from = '';
        var to = '';
        var depart = '';

        $('.multi-city-row').each(function(k, v) {


            var f = $(v).find('.from').val().split('-');

            if (f[1] && f[1].replace(/\s/g, '').length == 3) {
                from += f[1].replace(/\s/g, '').toUpperCase() + ',';
            } else if (f[0].replace(/\s/g, '').length == 3) {
                from += f[0].replace(/\s/g, '').toUpperCase() + ',';

            }


            var t = $(v).find('.to').val().split('-');

            if (t[1] && t[1].replace(/\s/g, '').length == 3) {
                to += t[1].replace(/\s/g, '').toUpperCase() + ',';
            } else if (t[0].replace(/\s/g, '').length == 3) {
                to += t[0].replace(/\s/g, '').toUpperCase() + ',';

            }



            depart += moment($(v).find('.datepicker').val(), 'MMM D, YYYY').format('D-MMM-YYYY') + ',';


        });


        from = from.substr(0, (from.length - 1));
        depart = depart.substr(0, (depart.length - 1));
        to = to.substr(0, (to.length - 1));



        if (from.length == 0) {
            $('.from').after('<span class="error">Please select the origin</span>');
            return;
        } else if (to.length == 0) {
            $('.to').after('<span class="error">Please select the origin</span>');
            return;
        }


        var link = "https://www.skybooker.com/flights/?from=" + from + "&to=" + to + "&depart=" + depart + "&adult=" + adult + "&child=" + child + "&infant=" + infant + "&cabin=" + cabin





    } else {



        if ($('#flightStart').data('caleran').config.singleDate == true) {
            var link = "https://www.skybooker.com/flights/?from=" + from + "&to=" + to + "&depart=" + oneWayDepart + "&adult=" + adult + "&child=" + child + "&infant=" + infant + "&cabin=" + cabin

        } else {
            var link = "https://www.skybooker.com/flights/?from=" + from + ',' + to + "&to=" + to + ',' + from + "&depart=" + oneWayDepart + "," + twoWayDepart + "&adult=" + adult + "&child=" + child + "&infant=" + infant + "&cabin=" + cabin
        }



    }




    console.log(link);
    if (window.location.search) {
        link += '&' + window.location.search.replace('?', '');

    }



    window.location = link;


});


$('#find-tours').click('click', function() {



    var d = $('#tours input').val().replace(' ', '').split('-');




    if (d[1] && d[1].replace(' ', '').length == 3) {
        d = d[1].replace(' ', '').toUpperCase();
    } else if (d[0].replace(' ', '').length == 3) {
        d = d[0].replace(' ', '').toUpperCase();

    } else {

        $('#tours input').after('<span class="error">Please enter a destination</span>');

        return false;

    }


    $(this).attr('disabled', true);
    var l = 'https://www.skybooker.com/tours/list?destination=' + d;

    window.location.href = l;


});


function loadAutoSuggest() {

    $('.autosuggest').autocomplete({
        serviceUrl: function(query) {},
        minChars: 2,
        noCache: false,
        onSelect: function(s, a) {

        },
        formatResult: function(suggestion, currentValue) {
            var returnHtml = '';

            if (suggestion.countryName) {
                returnHtml += '<div class="main-suggestion"><img src="https://www.skybooker.com/img/flags/' + suggestion.countryName + '.png" /> ' + suggestion.cityName + ', ' + (suggestion.stateName.length > 0 ? suggestion.stateName : suggestion.countryName) + '<span>' + suggestion.iata + '</span></div>';

            } else {
                returnHtml += '<div class="sub-suggestion">' + suggestion.cityName + ' <span>' + suggestion.iata + '</span></div>';
            }
            return returnHtml;

        },
        lookup: function(query, done) {
            // Do Ajax call or lookup locally, when done,
            // call the callback and pass your results:

            $.get(serverUrl + 'ajax/autocomplete_q.php?q=' + query, function(r) {

                var response = { suggestions: [] };
                $.each(r, function(k, v) {
                    response.suggestions.push(v);

                    if (v.subset && v.subset[1]) {

                        $.each(v.subset, function(key, val) {

                            response.suggestions.push(val);

                        });
                    }
                })
                done(response);
            })
        },
    });

}

loadAutoSuggest();

(function(w, d, t, c, l, s, p) {
    w[c] = w[c] || function() {
        w[c].query = w[c].query || [];
        w[c].query.push(arguments);
    };
    s = d.createElement(t);
    s.src = l;
    s.async = true;
    p = d.getElementsByTagName(t)[0];
    p.parentNode.insertBefore(s, p);
})(window, document, "script", "_WINCB", "//static.metarail.com/load");
_WINCB(79359, {
    "subid": "",
    "campaign": "",
    "keyword": "",
    "targeting": {}
}, 0, null, document.querySelector("#metarail").parentNode.parentNode);



//Sojern Pixel Code starts here  
        
(function () {
    var params = {};
    /* Please do not modify the below code. */
    var cid = [];
    var paramsArr = [];
    var cidParams = [];
    var pl = document.createElement('script');
    var defaultParams = {"vid":"air"};
    for(key in defaultParams) { params[key] = defaultParams[key]; };
    for(key in cidParams) { cid.push(params[cidParams[key]]); };
    params.cid = cid.join('|');
    for(key in params) { paramsArr.push(key + '=' + encodeURIComponent(params[key])) };
    pl.type = 'text/javascript';
    pl.async = true;
    pl.src = 'https://beacon.sojern.com/pixel/p/192487?f_v=v6_js&p_v=1&' + paramsArr.join('&');
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(pl);
    })();
    
//Sojern Pixel Code ends here