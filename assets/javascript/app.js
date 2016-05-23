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

		var youtubeSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&kind=playlist&maxResults=1&q=" + userInput + "&type=video&videoCaption=closedCaption&videoCategoryId=10&key=AIzaSyAzU3_r7MMhIb1Hrp6V79ilLOc9nASDhc0"; // youtube search for single video

		$.ajax({
			url: youtubeSearch,
			method: 'GET'

		}).done(function(response){

			console.log(response);

			videoid = response.items[0].id.videoId;

			//$('#youPlayer').attr('src', 'http://www.youtube.com/embed/' +videoid + '?enablejsapi=1');

			console.log(response.items[0].id.videoId);

			videoid = response.items[0].id.videoId;

			href = "https://www.youtube.com/watch?v=" + videoid;

			var newA = $('<a>').attr('href', href).html($("<img src=\"assets/images/placeholder.png\">"));

			$('#youTubeBox').html(newA);






		});



	}

});