
 //this block of code needs to happen first so that the page will go to google maps first
 //dont move it before ready function
 

 //--------------------------------GOOGLE MAPS STUFF GOES HERE------------------------------------------
      var map;
      var infowindow;

      function initMap() {
        var phoenix = {lat: 33.4484, lng: -112.0740};

        map = new google.maps.Map(document.getElementById('map'), {
          center: phoenix,
          zoom: 10
        });

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

     function initMapWithUserInput(serviceType) {
        var phoenix = {lat: 33.4484, lng: -112.0740};

        map = new google.maps.Map(document.getElementById('map'), {
          center: phoenix,
          zoom: 10
        });

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: phoenix,
          radius: 70000,
          type: [serviceType]
        }, callback);
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
      console.log("submit")

      event = $("#eventtext").val().trim();
      city = $("#City").val().trim();
      date = $("#Date").val().trim();

      initMapWithUserInput(event
      	)
      // console.log(name);
      database.ref().push({
        event: event,
        city: city,
        date: date,
      	});

      });
      database.ref().on("child_added", function(childSnapshot) {

            console.log(childSnapshot.val());
      console.log(childSnapshot.val().event);
      console.log(childSnapshot.val().city);
      console.log(childSnapshot.val().date);

      $("#historytable").append(
        "<div class='text-center'><span id='historyevent'> " +
        childSnapshot.val().event + "" +
        "<div class='role'><span id='historycity'> " +
        childSnapshot.val().city + "" +
        "<div class='text-center'><span id='historydate'> " +
        childSnapshot.val().date
        );

    });



	$("button").on("click", function() {
	      // Grabbing and storing the data-animal property value from the button
	    
	    var search = $("#eventtext");
	    var location = $("#City");
	    var when = $("#Date");


	      // Constructing a queryURL using the animal name
	      var queryURL = "http://api.eventful.com/json/events/search?=" +
	      search + "&location=" + location + "&date=" + when + "&app_key=3vZmP9bm5J8X7ffg";


	      // Performing an AJAX request with the queryURL
	      $.ajax({
	          url: queryURL,
	          method: "GET"
	        })
	        // After data comes back from the request
	        .done(function(response) {
	          console.log(queryURL);

	          console.log(response);
	          // storing the data from the AJAX request in the results variable
	          var results = response.data;
	 		});
	 	});
// setTimeout(function(){
// 	initMapWithUserInput()
// },5000)



});



