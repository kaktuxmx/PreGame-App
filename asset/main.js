
 //this block of code needs to happen first so that the page will go to google maps first
 //dont move it before ready function
 

 //--------------------------------GOOGLE MAPS STUFF GOES HERE------------------------------------------
 var map;
 var infowindow;
 var phoenix = {lat: 33.4484, lng: -112.0740};
 var flagstaff = {lat: 35.198284, lng: -111.651302};



 function initMap() {
 	var phoenix = {lat: 33.4484, lng: -112.0740};

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
// /This function serves to get the user input by using service type and setting it equal to user input down below. 
// Radius is a changable variable.
function initMapWithUserInput(serviceType, serviceLocation) {
		map = new google.maps.Map(document.getElementById('map'), {
			center: serviceLocation,
			zoom: 10
		});


		infowindow = new google.maps.InfoWindow();
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			location: serviceLocation,
			radius: 70000,
			type: [serviceType]
		}, callback);

	}

        // map = new google.maps.Map(document.getElementById('map'), {
        //   center: [serviceLocation],
        //   zoom: 10
        // });

        // infowindow = new google.maps.InfoWindow();
        // var service = new google.maps.places.PlacesService(map);
        // service.nearbySearch({
        //   location: [serviceLocation],
        //   radius: 70000,
        //   type: [serviceType]
        // }, callback);
    }

//--------------------------------GOOGLE MAPS STUFF GOES HERE------------------------------------------
$(document).ready(function() {
	var config = {
		apiKey: "AIzaSyD6MGRFxYyOvjvNue4_qEr-L2BPnIsHWaI",
		authDomain: "pregame-app-data-1513043296516.firebaseapp.com",
		databaseURL: "https://pregame-app-data-1513043296516.firebaseio.com",
		projectId: "pregame-app-data-1513043296516",
		storageBucket: "",
		messagingSenderId: "1096452915743"
	};
	firebase.initializeApp(config);
//simple initalization
var database = firebase.database();
var event = "";
var city = "";
var date = "";

$("#submit").on("click",function(click) {
	click.preventDefault();
      // console.log("submit")

      event = $("#eventtext").val().trim();
      city = $("#city").val().trim();
      date = $("#Date").val().trim();

      // initMapWithUserInput(event);

      // console.log(name);
      database.ref().push({
      	event: event,
      	city: city,
      	date: date,
      });

  });
database.ref().on("child_added", function(childSnapshot) {

      //       console.log(childSnapshot.val());
      // console.log(childSnapshot.val().event);
      // console.log(childSnapshot.val().city);
      // console.log(childSnapshot.val().date);

      $("#historytable").append(
      	"<div class='text-center'><span id='historyevent'> " +
      	childSnapshot.val().event + "" +
      	"<div class='role'><span id='historycity'> " +
      	childSnapshot.val().city + "" +
      	"<div class='text-center'><span id='historydate'> " +
      	childSnapshot.val().date
      	);

  });


//--------------------------------TICKETMASTER API SECTION------------------------------------------
$("button").on("click", function() {
	      

	      var search = $("#eventtext");
	      var location = $("#pac-input");
	      var when = $("#Date");


	      //This section is the ticktmaster api url 
	      var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + event + "&city=" + location + "&dates=" + when + "&apikey=cPtQ0EDTtDP6C6L6NpXOzIopjAPr4ANG";
      
           
      $.ajax({
          url: queryURL,
          method: "GET"
            })

   .done(function(response) {
        console.log(response)
          

          var results = response._embedded.events;
             
          //this section runs a for loop to pull the information we want from the api
          for (var i = 0; i < results.length; i++) {
    

                var name = results[i].name;
                
                database.ref().push(name);

                var date = results[i].dates.start.localDate;
                
                database.ref().push(date);


                var venue = results[i]._embedded.venues[0].name;
                
                database.ref().push(venue);

                var address = results[i]._embedded.venues[0].address.line1; 
                
                database.ref().push(address);

                var city = results[i]._embedded.venues[0].city.name;
                
                database.ref().push(city);

                var state = results[i]._embedded.venues[0].state.stateCode;
                
                database.ref().push(state);

                var zipCode = results[i]._embedded.venues[0].postalCode;
                
                database.ref().push(zipCode);

                var lat = results[i]._embedded.venues[0].location.latitude;
                
                database.ref().push(lat);

                var long = results[i]._embedded.venues[0].location.longitude;
                
                database.ref().push(long);
       
 
          }
    });







  });
// setTimeout(function(){
// 	initMapWithUserInput()
// },5000)



});



