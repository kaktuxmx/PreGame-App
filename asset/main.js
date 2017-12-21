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
    console.log('I am a callback and I am called');
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    console.log('Merpy merp',createMarker)
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
    var config = {
        apiKey: "AIzaSyAPGxBQiwM2ZU2q6pt0w4CLxZUg7oSEFhA",
        authDomain: "test-team-project.firebaseapp.com",
        databaseURL: "https://test-team-project.firebaseio.com",
        projectId: "test-team-project",
        storageBucket: "",
        messagingSenderId: "587543488777"
    };
    firebase.initializeApp(config);
    //simple initalization
    var database = firebase.database();
    var search = "";
    // var location = "";
    // var when = "";

    // var latlong = [];
    // navigator.geolocation.getCurrentPosition(function(position) {
    //    var lat = position.coords.latitude;
    //    var lon = position.coords.longitude;
    //    array.push(lat, lon); 
    //    locationCode()  
    // });

    // function locationCode() {
    //    alert(array); 


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
                console.log(lat);
                // database.ref().push(lat);

                var long = results[0]._embedded.venues[0].location.longitude;
                console.log(long);
                // database.ref().push(long);

                var location2 = {
                    lat: parseFloat(lat),
                    lng: parseFloat(long)
                }





                initMapWithUserInput(pregame, location2);

                // console.log(initMapWithUserInput)


                // for (var i = 0; i < results.length; i++) {


                // var name = results[i].name;
                // console.log(name);
                // database.ref().push(name);

                // var date = results[i].dates.start.localDate;
                // console.log(date);
                // database.ref().push(date);


                // var venue = results[i]._embedded.venues[0].name;
                // console.log(venue);
                // database.ref().push(venue);

                // var address = results[i]._embedded.venues[0].address.line1;
                // console.log(address);
                // database.ref().push(address);

                // var city = results[i]._embedded.venues[0].city.name;
                // console.log(city);
                // database.ref().push(city);

                // var state = results[i]._embedded.venues[0].state.stateCode;
                // console.log(state);
                // database.ref().push(state);

                // var zipCode = results[i]._embedded.venues[0].postalCode;
                // console.log(zipCode);
                // database.ref().push(zipCode);

                // var lat = results[i]._embedded.venues[0].location.latitude;
                // console.log(lat);
                // database.ref().push(lat);

                // var long = results[i]._embedded.venues[0].location.longitude;
                // console.log(long);
                // database.ref().push(long);

                // }
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
        console.log("servicetype", serviceType)
        console.log("servicelocation", serviceLocation)
        console.log("search", search)
        console.log('callback', callback);
        service.nearbySearch({
            location: serviceLocation,
            radius: 7000,
            type: [serviceType]
        }, callback);
                 console.log("service", service)


    }
  

    $("#submit").on("click", function(click) {
        click.preventDefault();
        // console.log("submit")


        var pregame = $("#eventtext").val().trim();
        var search = $("#search").val().trim();
        var location = $("#city").val().trim();
        var isValid = true

        // ------------------------------------- USER INPUT VALIDATION GOES HERE ---------------------------


          $('#eventtext,#search,#city,#date').each(function() {
                if ($.trim($(this).val()) == '') {
                    isValid = false;
                    $(this).css({
                        "border": "1px solid red",
                        "background": "#FFCECE"
                    });
                }
                else {
                    $(this).css({
                        "border": "",
                        "background": ""
                    });
                }
            
            if (isValid == false)
                click.preventDefault();
        });

        

// ------------------------------------- USER INPUT VALIDATION ENDS HERE ---------------------------




        Ticketmastersearchevent(search, location, pregame);
        // console.log(name);
        //  var newSearch = {
        //      search: search,
        //      location: location,
        //      when: when   
        // };


        // database.ref().push(newSearch);


        // $("#search").val("");
        // $("#city").val("");
        // $("#date").val("");




    });
});
//  database.ref().on("child_added", function(childSnapshot, prevChildKey) {

//  // console.log(childSnapshot.val());

//  var name = childSnapshot.val().name;
//  var address = childSnapshot.val().address;
//  var city = childSnapshot.val().city;
//  var state = childSnapshot.val().state;
//  var date = childSnapshot.val().date;
//  var lat = childSnapshot.val().location.latitude
//  var long = childSnapshot.val().location.longitude





// $("#search-table > tbody").append("<tr><td>" + name + "</td><td>" + address + "</td><td>" +
//  city + "</td><td>" + state + "</td><td>" + date + "</td></tr>");

//    });  
//  })