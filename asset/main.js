//this block of code needs to happen first so that the page will go to google maps first
//dont move it before ready function


//--------------------------------GOOGLE MAPS STUFF GOES HERE------------------------------------------
var map;
var infowindow;
var phoenix = { lat: 33.4484, lng: -112.0740 };
var flagstaff = { lat: 35.198284, lng: -111.651302 };



function initMap() {
    var phoenix = { lat: 33.4484, lng: -112.0740 };

    map = new google.maps.Map(document.getElementById('map'), {
        center: phoenix,
        zoom: 10
    });

    //This stuff is mostly from google maps API. It exists mostly as a place holder at this point -- the real
    // function gets called upon user input down below in the button click

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: phoenix,
        radius: 70000,
        type: ['night_club']
    }, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {

    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}



//--------------------------------GOOGLE MAPS STUFF ENDS HERE------------------------------------------


// ------------------------------------- USER INPUT VALIDATION GOES HERE ---------------------------


// ------------------------------------- USER INPUT VALIDATION ENDS HERE ---------------------------
$(document).ready(function() {
    $("eventtext").val("")
    var config = {
        apiKey: "AIzaSyC4xOsfX76n77JrzIEeg140MLnegIqDylg",
        authDomain: "searchhistory-7a413.firebaseapp.com",
        databaseURL: "https://searchhistory-7a413.firebaseio.com",
        projectId: "searchhistory-7a413",
        storageBucket: "",
        messagingSenderId: "175527416461"
    };
    firebase.initializeApp(config);



    //--------------------------------TICKETMASTER API SECTION------------------------------------------

    //This variable gets api information from the ticketmaster database.
    function Ticketmastersearchevent(search, location, pregame) {
        // body...    
        var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + search + "&city=" + location + "&apikey=cPtQ0EDTtDP6C6L6NpXOzIopjAPr4ANG";
        console.log(queryURL)
        $.ajax({
                url: queryURL,
                method: "GET"
            })

            .done(function(response) {





                console.log(response)

                //This is the beginning of the Ticketmaster API section
                //this section pulls the specific information we are seeking from ticketmaster and pushes that information to firebase.
                var results = response._embedded.events;

                var lat = results[0]._embedded.venues[0].location.latitude;


                var long = results[0]._embedded.venues[0].location.longitude;


                var location2 = {
                    lat: parseFloat(lat),
                    lng: parseFloat(long)
                }





                initMapWithUserInput(pregame, location2);


            });
    }

    function initMapWithUserInput(serviceType, serviceLocation) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: serviceLocation,
            zoom: 11
        });


        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        // console.log("service", service)

        service.nearbySearch({
            location: serviceLocation,
            radius: 7000,
            type: [serviceType]
        }, callback);
        console.log("service", service)


    }


    $("#submit").on("click", function(click) {
        click.preventDefault();
        var isValid = true;
        $('#eventtext,#search,#city,#date').each(function() {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).css({
                    "border": "1px solid red",
                    "background": "#FFCECE"
                });
            } else {
                $(this).css({
                    "border": "",
                    "background": ""
                });
            }

            if (!isValid)
                return;
        });



        var database = firebase.database();
        var pregame = $("#eventtext").val().trim();
        var search = $("#search").val().trim();
        var location = $("#city").val().trim();
        var date = $("#date").val().trim();
        var isValid = true
        //this is for firebase no touchie - Landon
        var newSearch = {
            pregame: pregame,
            search: search,
            location: location,
            date: date,
        }


        database.ref().on("child_added", function(childSnapshot, prevChildKey) {

            var pregame = childSnapshot.val().pregame;
            var location = childSnapshot.val().location;
            var search = childSnapshot.val().search;
            var date = childSnapshot.val().date;

            $("#search-table > tbody").append("<tr><td>" + search + "</td><td>" +
                location + "</td><td>" + pregame + "</td><td>" + date + "</td></tr>");

        })


        database.ref().push({
            pregame: pregame,
            search: search,
            location: location,
            date: date,

        });
        // ------------------------------------- USER INPUT VALIDATION GOES HERE ---------------------------


        $('#eventtext,#search,#city,#date').each(function() {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).css({
                    "border": "1px solid red",
                    "background": "#FFCECE"
                });
            } else {
                $(this).css({
                    "border": "",
                    "background": ""
                });
            }

            if (!isValid)
                return;
        });



        // ------------------------------------- USER INPUT VALIDATION ENDS HERE ---------------------------




        Ticketmastersearchevent(search, location, pregame);

        //clears that shit out
        $("#search").val("");
        $("#city").val("");
        $("#date").val("");
        $("eventtext").val("")




    });
});






//    });  
//  })