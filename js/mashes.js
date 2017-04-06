var map;
var infowindow;

function initMap() {
  var initial = {lat: 0, lng: 0};

  map = new google.maps.Map(document.getElementById('map'), {
    center: initial,
    zoom: 2
  });
  initMarker();
  autocomplete();
}

function autocomplete(){
  var card = document.getElementById('pac-card');

  var input = document.getElementById('pac-input');

   map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

   var autocomplete = new google.maps.places.Autocomplete(input);

   autocomplete.bindTo('bounds', map);

   var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    clearOverlays();
    search(place.geometry.location.lat(),place.geometry.location.lng(), true)
});
}


function createMarker(place) {
console.log("testhere");
  console.log(place);
  var infowindow = new google.maps.InfoWindow();
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  markersArray.push(marker);
  var self = this;
  infowindow.setContent(place.name);
  this.infowindowArray.push(infowindow);
  google.maps.event.addListener(marker, 'click', function() {
  	self.closeInfoWindows(infowindowArray);
  
  	infowindow.open(map, this);
});
}

function closeInfoWindows(listofWindows) {
	for (var i = 0; i<listofWindows.length; i++) {
		listofWindows[i].close();
	}
}

var markersArray = [];
var infowindowArray = [];
function clearOverlays() {
    for (var i = 0; i < markersArray.length; i++ ) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
  }



function initMarker() {
  //var placeLoc = place.geometry.location;
  var markerLoc = {lat: 0, lng: 0};

  var marker = new google.maps.Marker({
    map: map,
    // position: markerLoc
  });
  markersArray.push(marker);
  google.maps.event.addListener(map, 'click', function(e) {
    clearOverlays();
    var positionClick = e.latLng;
    marker.setPosition(positionClick);
    var lat = marker.getPosition().lat()
    var lng = marker.getPosition().lng()
    map.setZoom(8);
    map.panTo(marker.position);
    //infowindow.setContent(place.name);
    //infowindow.open(map, this);
	var placeSearch = false 
    search(lat,lng, placeSearch)
  })
}

function reset_zoom(){
  map.setZoom(2);
}


function getNews(search){
	 $(function() {

       $.ajax({
           url: "https://api.cognitive.microsoft.com/bing/v5.0/news/search?q=" + search,
           beforeSend: function(xhrObj){
               // Request headers
               xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","49d88cbf439d4f25b30e9a7b702058bd");
           },
           type: "GET",
           // Request body
           data: "{#news}",
       })
       .done(function(data) {
           //alert("success");
           console.log(data);
             $('#news').empty();
           var arr = data.value;
           for(let i=0; i < arr.length; i++){

           $("#news").append("<a href='" + arr[i].url + "' target='_blank'><p>"+arr[i].name+"</p></a>")
         }
       })
       .fail(function() {
           alert("error, try again");
       });
   });
 } 
 

function search(lat, lng, placeSearch){
  
 var service = new google.maps.places.PlacesService(map);
 var request = {
   location: new google.maps.LatLng(lat,lng),
   radius: 50000,
   //rankBy: google.maps.places.RankBy.DISTANCE,
   //type: ['restaurant']
 };

 if (placeSearch){
	 getNews(document.getElementById('pac-input').value);
	 service.search(request, function(results){
   console.log(results);
   var lt = results[0].geometry.location.lat();
   var lg = results[0].geometry.location.lng();
   for( i = 0; i < results.length; i++) {
     createMarker(results[i]);
  }
 })
 } else{service.search(request, function(results){
   console.log(results);
   var lt = results[0].geometry.location.lat();
   var lg = results[0].geometry.location.lng();
   for( i = 0; i < results.length; i++) {
     createMarker(results[i]);
  }
   $.getJSON('https://search.mapzen.com/v1/reverse?api_key=mapzen-6RKL9V5&point.lat=' + lt + '&point.lon=' + lg + '&layers=locality', function(data) {
   var x = Math.floor((Math.random() * 6));
   console.log(data.features[x]);
   var search = data.features[x].properties.label;
	getNews(search);
  
});
  
 
  
 }) }
 
 
}






