$(document).ready(function(){



function initMap(){

	var mapDiv = document.getElementById('googleMapsBox');

	var map = new google.maps.Map(mapDiv, {

		center: {lat: 27.6648, lng: -81.5158},
		zoom: 7
	});
}

function showNoArtistDiag(){

	$('#errNoArtist').dialog({
		buttons: {'OK': function(){$(this).dialog('close');}},
		resizeable: false,
		modal: true,
		draggable: false
	});
}

var userInput;
var href;
var videoid;
var youtubeSearch;
var events = [];
//var youtubeSearch = "https://www.youtube.com/playlist?list=PLnhejVhDwjcwjYUVMG1KTL3Oc7rB80H38"; //url for playlists

//var youtubeSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&kind=playlist&maxResults=1&q="+ userInput + "&type=video&videoCaption=closedCaption&key=AIzaSyAzU3_r7MMhIb1Hrp6V79ilLOc9nASDhc0"; // youtube search for playlists

//var youtubeSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&kind=playlist&maxResults=1&q=" + userInput + "&type=video&videoCaption=closedCaption&key=AIzaSyAzU3_r7MMhIb1Hrp6V79ilLOc9nASDhc0"; // youtube search for single video

var fireUrl = "https://sound-splash.firebaseio.com/searches";
var dataBaseRef = new Firebase(fireUrl);
var recentSearch = [];

var wikiApi;

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
	var str = userInput;
	str = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
	return letter.toUpperCase();
	});
	// alert(str); //Displays "Bobby Brown"
	userInput = str;

	if(userInput == ""){
		$('#search').val('');
		// display some sort of dialog box telling the user to input something in the field

	} else {

		//var youtubeSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&kind=playlist&maxResults=1&videoEmbeddable=true&videoSyndicated=true&q=" + userInput + "&type=video&videoCaption=closedCaption&videoCategoryId=10&key=AIzaSyAzU3_r7MMhIb1Hrp6V79ilLOc9nASDhc0"; // youtube search for single video when embedding

		//youtubeSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&kind=playlist&maxResults=1&q=Kierra+Sheard&type=playlist&key=AIzaSyAzU3_r7MMhIb1Hrp6V79ilLOc9nASDhc0"; // youtube search for playlist

		youtubeSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&kind=playlist&maxResults=1&q=" + userInput + "&type=video&videoCaption=closedCaption&videoCategoryId=10&key=AIzaSyAzU3_r7MMhIb1Hrp6V79ilLOc9nASDhc0"; // youtube search for single video
		var eventsAPI = "https://api.bandsintown.com/artists/" + userInput + "/events.json?api_version=2.0&app_id=sound_splash";

		console.log(eventsAPI);

    

		$.ajax({
			url: youtubeSearch,
			method: 'GET'

		}).done(function(response){

			videoid = response.items[0].id.videoId;

			//$('#youPlayer').attr('src', 'http://www.youtube.com/embed/' +videoid + '?enablejsapi=1');

			videoid = response.items[0].id.videoId;

			href = "https://www.youtube.com/watch?v=" + videoid;

			var newA = $('<a>');
			newA.attr({
				'href': href,
				'target': 'window'
				});
			newA.html($("<img src=\"assets/images/youtubegrey1b.png\">"));

			$('#youTubeBox').html(newA);


		});

		$.ajax({ //bandsintown api
			url: eventsAPI,
			method: 'GET',
			dataType: 'jsonp'

		}).done(function(retrieved){

			console.log(retrieved);

			if(retrieved == null || retrieved == ""){

				showNoArtistDiag();

			} else {

				$('#main').hide();
				$('#pg2').show();


			}

			var artistImg = $('<img>').attr('src', retrieved[0].artists[0].thumb_url);
			$('#artistPic').html(artistImg);

			var eventLon;
			var eventLat;

			var map = new google.maps.Map(document.getElementById('googleMapsBox'),{

				center: {lat: retrieved[0].venue.latitude, lng: retrieved[0].venue.longitude},
				zoom: 4
			});



			for(var i=0; i < retrieved.length; i++){

				eventLon = retrieved[i].venue.longitude;
				eventLat = retrieved[i].venue.latitude;

				var content = "<h5>" + retrieved[i].venue.name + "</h5><p class=\"mapText\">" + retrieved[i].venue.city + ", " + retrieved[i].venue.region + "</p>";

				content+= "<p class=\"mapText\">"+ retrieved[i].formatted_datetime +"</p>";

				addMarker(retrieved[i]);

			}

			function addMarker(mark){

				var pointer = new google.maps.Marker({
					position: {lat: mark.venue.latitude, lng: mark.venue.longitude},
					map: map,
					title: mark.venue.name
				});

				var eventInfo = new google.maps.InfoWindow({

					content: content
				});

				google.maps.event.addListener(pointer, 'mouseover', function(){

					eventInfo.open(pointer.get('map'), pointer);

				});

				google.maps.event.addListener(pointer, 'mouseout', function(){

					eventInfo.close(pointer.get('map', pointer));
				});

			}

				if(retrieved.length > 10){

					for (var i = 0; i < 10; i++){
						var anchor = $('<a>');
						var para = $('<p>');
						anchor.attr({
							'href' : retrieved[i].ticket_url,
							'target': 'window' 
						});
						para.addClass('ticketLinks')
						anchor.html(retrieved[i].title);
						para.html(anchor);
						$(wikiBody).append(para);
					}

				}
				else if(retrieved < 10){

					for(var i = 0; i < retrieved.length; i++){
						var anchor = $('<a>');
						var para = $('<p>');
						anchor.attr({
							'href' : retrieved[i].ticket_url,
							'target': 'window' 
						});
						para.addClass('ticketLinks')
						anchor.html(retrieved[i].title);
						para.html(anchor);
						$(wikiBody).append(para);						

					}

				}

		});


					// firebase 
				dataBaseRef.push({
					
					name: userInput,

				});
			// firebase ^^^^^


	}
		// clears search input for next input
		$('#search').val('');
		// return false, so the page doesnt refresh everytime the submit button is clicked
		return false;
});



var mostRecentSearch = function(){
	// generates 5 buttons.
	var arrayIndex = 4;

	if(recentSearch.length > 5){
		recentSearch.splice(0, 1);
		console.log(recentSearch);
	}

	$('#contentBody').empty(); // << so it will always be 5 buttons.

	for(var i = 0; i < recentSearch.length; i++){

		var daButton = $('<button>');
		daButton.addClass('btn btn-default recentButton'); // class subject to change.
		daButton.attr('data-name', recentSearch[arrayIndex]);
		daButton.html(recentSearch[arrayIndex]);
		$('#contentBody').append(daButton);
		arrayIndex--;

	}
};

// executes code when data base is populated with new data or when page is loaded
// takes the 5 most recent searches (subject to change)
dataBaseRef.limitToLast(5).on('child_added', function(dataSnap){
	// stores the object into a variable.
	var searchName = dataSnap.val();
//	console.log(searchName.name);
	recentSearch.push(searchName.name);

	if(recentSearch.length >= 5){
		mostRecentSearch();
		
	}
});

});

// everything below makes recent search buttons functional 

$(document).on('click', '.recentButton', function(){

	var buttonName = $(this).attr('data-name');
	console.log(buttonName);

		youtubeSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&kind=playlist&maxResults=1&q=" + buttonName + "&type=video&videoCaption=closedCaption&videoCategoryId=10&key=AIzaSyAzU3_r7MMhIb1Hrp6V79ilLOc9nASDhc0"; // youtube search for single video
		var eventsAPI = "https://api.bandsintown.com/artists/" + buttonName + "/events.json?api_version=2.0&app_id=sound_splash";


		$.ajax({
			url: youtubeSearch,
			method: 'GET'

		}).done(function(response){

			videoid = response.items[0].id.videoId;

			//$('#youPlayer').attr('src', 'http://www.youtube.com/embed/' +videoid + '?enablejsapi=1');

			videoid = response.items[0].id.videoId;

			href = "https://www.youtube.com/watch?v=" + videoid;
			
			var newA = $('<a>');
			newA.attr({
				'href': href,
				'target': 'window'
				});
			newA.html($("<img src=\"assets/images/youtubegrey1b.png\">"));

			$('#youTubeBox').html(newA);


		});

		$.ajax({ //bandsintown api
			url: eventsAPI,
			method: 'GET',
			dataType: 'jsonp'

		}).done(function(retrieved){

			console.log(retrieved);

			if(retrieved == null || retrieved == ""){

				showNoArtistDiag();

			} else {

				$('#main').hide();
				$('#pg2').show();


			}



			var artistImg = $('<img>').attr('src', retrieved[0].artists[0].thumb_url);
			$('#artistPic').html(artistImg);

			var eventLon;
			var eventLat;

			var map = new google.maps.Map(document.getElementById('googleMapsBox'),{

				center: {lat: retrieved[0].venue.latitude, lng: retrieved[0].venue.longitude},
				zoom: 4
			});



			for(var i=0; i < retrieved.length; i++){

				eventLon = retrieved[i].venue.longitude;
				eventLat = retrieved[i].venue.latitude;

				var content = "<h5>" + retrieved[i].venue.name + "</h5><p class=\"mapText\">" + retrieved[i].venue.city + ", " + retrieved[i].venue.region + "</p>";

				content+= "<p class=\"mapText\">"+ retrieved[i].formatted_datetime +"</p>";

				addMarker(retrieved[i]);

			}

			function addMarker(mark){

				var pointer = new google.maps.Marker({
					position: {lat: mark.venue.latitude, lng: mark.venue.longitude},
					map: map,
					title: mark.venue.name
				});

				var eventInfo = new google.maps.InfoWindow({

					content: content
				});

				google.maps.event.addListener(pointer, 'mouseover', function(){

					eventInfo.open(pointer.get('map'), pointer);

				});

				google.maps.event.addListener(pointer, 'mouseout', function(){

					eventInfo.close(pointer.get('map', pointer));
				});

			}

				if(retrieved.length > 10){

					for (var i = 0; i < 10; i++){
						var anchor = $('<a>');
						var para = $('<p>');
						anchor.attr({
							'href' : retrieved[i].ticket_url,
							'target': 'window' 
						});
						para.addClass('ticketLinks')
						anchor.html(retrieved[i].title);
						para.html(anchor);
						$(wikiBody).append(para);
					}

				}
				else if(retrieved < 10){

					for(var i = 0; i < retrieved.length; i++){
						var anchor = $('<a>');
						var para = $('<p>');
						anchor.attr({
							'href' : retrieved[i].ticket_url,
							'target': 'window' 
						});
						para.addClass('ticketLinks')
						anchor.html(retrieved[i].title);
						para.html(anchor);
						$(wikiBody).append(para);						

					}

				}

		});



});












