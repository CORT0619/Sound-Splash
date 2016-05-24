function initMap(){

	var mapDiv = document.getElementById('googleMapsBox');

	var map = new google.maps.Map(mapDiv, {

		center: {lat: 27.6648, lng: -81.5158},
		zoom: 7
	});

	/*var pointer = new google.maps.Marker({
		position: {lat: 28.7450, lng: -81.3080},
		map: map,
		title: "Wherever"
	});*/
}

var userInput;
var href;
var videoid;
var youtubeSearch;
var eventsAPI = "https://api.bandsintown.com/artists/";
var events = [];

//var youtubeSearch = "https://www.youtube.com/playlist?list=PLnhejVhDwjcwjYUVMG1KTL3Oc7rB80H38"; //url for playlists

//var youtubeSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&kind=playlist&maxResults=1&q="+ userInput + "&type=video&videoCaption=closedCaption&key=AIzaSyAzU3_r7MMhIb1Hrp6V79ilLOc9nASDhc0"; // youtube search for playlists

//var youtubeSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&kind=playlist&maxResults=1&q=" + userInput + "&type=video&videoCaption=closedCaption&key=AIzaSyAzU3_r7MMhIb1Hrp6V79ilLOc9nASDhc0"; // youtube search for single video




$('#searchButton').on('click', function(){

	userInput = $('#search').val().trim();

	console.log(youtubeSearch);

	if(userInput == ""){
		$('#search').val('');
		// display some sort of dialog box telling the user to input something in the field

	} else {

		//var youtubeSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&kind=playlist&maxResults=1&videoEmbeddable=true&videoSyndicated=true&q=" + userInput + "&type=video&videoCaption=closedCaption&videoCategoryId=10&key=AIzaSyAzU3_r7MMhIb1Hrp6V79ilLOc9nASDhc0"; // youtube search for single video when embedding

		youtubeSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&kind=playlist&maxResults=1&q=" + userInput + "&type=video&videoCaption=closedCaption&videoCategoryId=10&key=AIzaSyAzU3_r7MMhIb1Hrp6V79ilLOc9nASDhc0"; // youtube search for single video
		eventsAPI += userInput + "/events.json?api_version=2.0&app_id=sound_splash";
		console.log(eventsAPI);


		$.ajax({
			url: youtubeSearch,
			method: 'GET'

		}).done(function(response){

			console.log(response);

			videoid = response.items[0].id.videoId;

			//$('#youPlayer').attr('src', 'http://www.youtube.com/embed/' +videoid + '?enablejsapi=1');

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

		$.ajax({ //bandsintown api
			url: eventsAPI,
			method: 'GET',
			dataType: 'jsonp'

		}).done(function(retrieved){

			console.log(retrieved);

			var eventLon;
			var eventLat;

			var map = new google.maps.Map(document.getElementById('googleMapsBox'),{

				center: {lat: retrieved[0].venue.latitude, lng: retrieved[0].venue.longitude},
				zoom: 4
			});

			for(var i=0; i < retrieved.length; i++){

				eventLon = retrieved[i].venue.longitude;
				eventLat = retrieved[i].venue.latitude;

				event = {eventLat, eventLon};

				events.push(event);


				var pointer = new google.maps.Marker({
					position: {lat: eventLat, lng: eventLon},
					map: map,
					title: retrieved[i].venue.name
				});

			}
			console.log(events);

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

















