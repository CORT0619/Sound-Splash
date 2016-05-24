function initMap(){

	var mapDiv = document.getElementById('googleMapsBox');

	var map = new google.maps.Map(mapDiv, {

		center: {lat: 44.540, lng: -78.546},
		zoom: 8
	});
}

var userInput;
var href;
var videoid;
var fireUrl = "https://sound-splash.firebaseio.com/searches";
var dataBaseRef = new Firebase(fireUrl);
var recentSearch = [];
//var youtubeSearch = "https://www.youtube.com/playlist?list=PLnhejVhDwjcwjYUVMG1KTL3Oc7rB80H38"; //url for playlists

//var youtubeSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&kind=playlist&maxResults=1&q="+ userInput + "&type=video&videoCaption=closedCaption&key=AIzaSyAzU3_r7MMhIb1Hrp6V79ilLOc9nASDhc0"; // youtube search for playlists

//var youtubeSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&kind=playlist&maxResults=1&q=" + userInput + "&type=video&videoCaption=closedCaption&key=AIzaSyAzU3_r7MMhIb1Hrp6V79ilLOc9nASDhc0"; // youtube search for single video




$('#searchButton').on('click', function(){

	userInput = $('#search').val().trim();

// button validation >> makes certain that the user cannot make two of the same button.=======================
for(var i = 0; i < recentSearch.length; i++){

	if(userInput.toUpperCase() == recentSearch[i].toUpperCase()){
		$('#search').val('');
		return false;
	}
	
}
// ^^button validation =============================================^^
	console.log(youtubeSearch);

	if(userInput == ""){
		$('#search').val('');
		// display some sort of dialog box telling the user to input something in the field

	} else {

		var youtubeSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&kind=playlist&maxResults=1&q=" + userInput + "&type=video&videoCaption=closedCaption&key=AIzaSyAzU3_r7MMhIb1Hrp6V79ilLOc9nASDhc0"; // youtube search for single video

		$.ajax({
			url: youtubeSearch,
			method: 'GET'

		}).done(function(response){

			console.log(response);

			console.log(response.items[0].id.videoId);

			videoid = response.items[0].id.videoId;

			href = "https://www.youtube.com/watch?v=" + videoid;

			var newA = $('<a>').attr('href', href).html($("<img src=\"assets/images/placeholder.png\">"));

			// you probably want to change this to html instead of append so if the user searches multiple times, it wont populate the div with every video.
			$('#youTubeBox').html(newA);



			// firebase 
				dataBaseRef.push({
					
					name: userInput,

				});
			// firebase ^^^^^


		});



	}
		// clears search input for next input
		$('#search').val('');
		// return false, so the page doesnt refresh everytime the submit button is clicked
		return false;
});


var mostRecentSearch = function(){
	// generates 5 buttons.
	var arrayIndex = recentSearch.length - 1;

	$('#contentBody').empty(); // << so it will always be 5 buttons.

	for(var i = 0; i < 5; i++){

		var daButton = $('<button>');
		daButton.addClass('btn btn-default'); // class subject to change.
		daButton.attr('data-index', recentSearch[arrayIndex]);
		daButton.html(recentSearch[arrayIndex]);
		$('#contentBody').append(daButton);
		arrayIndex--;

	}
};

var dynamicSeach = function(){

};



// executes code when data base is populated with new data or when page is loaded
// takes the 5 most recent searches (subject to change)
dataBaseRef.limitToLast(5).on('child_added', function(dataSnap){
	// stores the object into a variable.
	var searchName = dataSnap.val();
	console.log(searchName.name);
	recentSearch.push(searchName.name);

	if(recentSearch.length >= 5){
		mostRecentSearch();
		
	}
});


// function that generates 5 buttons on page load
// function that appends new search button and deletes first button dynamically on user search.
// function that validates user search so they cant search something that has been already searched.
// make database info an array so i can refer to each search with an index #. 
// Will 'set' the new searches and delete the current searches, so we always have five searches.















