$("button").on("click", function() {
      // Grabbing and storing the data-animal property value from the button
    
    var search = $("#Event");
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