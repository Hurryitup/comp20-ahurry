// TODO: change back to 0 0 when back on campus
var myLat = 42.4039095;
var myLng = -71.12095409999999;
var xmlRequest = new XMLHttpRequest();
var url = "https://defense-in-derpth.herokuapp.com/sendLocation"
var me = new google.maps.LatLng(myLat, myLng);
var mapOptions = {
        zoom: 13,
        center: me,
        mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var landmark_icon = "images/landmark_icon.png";

function setMarkers(data, category) {
        console.log(data);
        for (i = 0; i < data.length; data[i]) {
                if (category == "landmarks") {
                        marker_info = {
                                position: google.maps.LatLng(data[i].geometry.coordinates[0], data[i].geometry.coordinates[0]),
                                title: data[i].properties.Location_Name,
                                map: map,
                                icon:landmark_icon
                        };
                        marker = new google.maps.Marker(marker_info);                
                        // Open info window on click of marker
                        google.maps.event.addListener(marker, 'click', function() {
                                infowindow.setContent(marker.title);
                                infowindow.open(map, marker);
                        });
                }
                
        }
}


function parse_data(data) {
        if (xmlRequest.readyState == 4 && xmlRequest.status == 200) {
                landmarks = JSON.parse(xmlRequest.responseText).landmarks;
                setMarkers(landmarks, "landmarks");
        }
}

function init(){
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        // getMyLocation();
        renderMap();
        var params = "login=LUCINDA_BOYER&lat="+myLat+"&lng="+myLng;
        xmlRequest.open("POST", url, true);
        xmlRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlRequest.setRequestHeader("Content-length", params.length);
        xmlRequest.setRequestHeader("Connection", "close");
        xmlRequest.onreadystatechange = parse_data;
        xmlRequest.send(params);
}

function getMyLocation() {
        if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser

                navigator.geolocation.getCurrentPosition(function(position) {
                        myLat = position.coords.latitude;
                        myLng = position.coords.longitude;
                        renderMap();
                        },
                        function(errPos) {
                                console.log("error code: "+errPos.code+" "+errPos.message);
                        }
                );
        }
        else {
                alert("Geolocation is not supported by your web browser.  What a shame!");
        }
}

function renderMap() {
        me = new google.maps.LatLng(myLat, myLng);
                                
        // Update map and go there...
        map.panTo(me);

        
}