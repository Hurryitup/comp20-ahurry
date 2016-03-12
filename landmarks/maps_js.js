// TODO: change back to 0 0 when back on campus
var myLat = 42.4039095;
var myLng = -71.12095409999999;
var xmlRequest = new XMLHttpRequest();
var request_url = "https://defense-in-derpth.herokuapp.com/sendLocation"
var me = {lat: myLat, lng: myLng};
var mapOptions = {
        zoom: 13,
        center: me,
        mapTypeId: google.maps.MapTypeId.ROADMAP
};
var def_map;
var infowindow = new google.maps.InfoWindow();
var landmark_icon = "images/landmark.png";
var person_icon = "images/person.png";

function openInfo() {
        infowindow.setContent(this.title);
        infowindow.open(def_map, this);
}

function setMarkers(data, category) {
        for (i = 0; i < data.length; i++) {
                var image;
                var name;
                var pos;
                if (category == "landmarks") {
                        image = {
                                url: landmark_icon,
                                size: new google.maps.Size(91,90),
                                origin: new google.maps.Point(0,0),
                                anchor: new google.maps.Point(27, 55)
                        };
                        name = data[i].properties.Location_Name;
                        pos = new google.maps.LatLng(data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]);
                }
                else if (category == "people") {
                        image = {
                                url: person_icon,
                                size: new google.maps.Size(53, 38),
                                origin: new google.maps.Point(0,0),
                                anchor: new google.maps.Point(19, 53)
                        }
                        name = data[i].login;
                        pos = new google.maps.LatLng(data[i].lat, data[i].lng);
                        console.log("parsing people");
                }
                var marker = new google.maps.Marker({
                        position: pos,
                        title: name,
                        map: def_map,
                        icon: image
                });
                // Open info window on click of marker
                marker.addListener("click", openInfo);
                        // infowindow.setContent(marker.title);
                        // infowindow.open(def_map, marker);
        }
}

function parse_data(data) {
        if (xmlRequest.readyState == 4 && xmlRequest.status == 200) {
                var parsed_data = JSON.parse(xmlRequest.responseText);
                var landmarks = parsed_data.landmarks;
                var people = parsed_data.people;
                setMarkers(landmarks, "landmarks");
                setMarkers(people, "people");
        }
}

function init(){
        def_map = new google.maps.Map(document.getElementById("map"), mapOptions);
        // getMyLocation();
        renderMap();
        console.log("mylat:"+myLat+" myLng:"+myLng);
        var params = "login=LUCINDA_BOYER&lat="+myLat+"&lng="+myLng;
        xmlRequest.open("POST", request_url, true);
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
        console.log("in renderMap - mylat:"+myLat+" myLng:"+myLng);
        
        me = new google.maps.LatLng(myLat, myLng);
        
        // Update map and go there...
        def_map.panTo(me);

        
}


