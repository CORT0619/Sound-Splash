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

			$('#youTubeBox').html(newA);


		});

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

});