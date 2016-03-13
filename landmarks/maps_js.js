// TODO: change back to 0 0 when back on campus
var myLat = 42.4039095;
var myLng = -71.22095409999999;
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
var haversine_distance;
var closest_landmark;

function openInfo() {
        infowindow.setContent(this.label);
        infowindow.open(def_map, this);
}

function calc_distance (lat, lng){
        Number.prototype.toRad = function() {
                return this * Math.PI / 180;
        }

        var R = 6371; // km 
        //has a problem with the .toRad() method below.
        var x1 = lat-myLat;
        var dLat = x1.toRad();  
        var x2 = lng-myLng;
        var dLon = x2.toRad();  
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                        Math.cos(myLat.toRad()) * Math.cos(lat.toRad()) * 
                        Math.sin(dLon/2) * Math.sin(dLon/2);  
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; 
        return d;
}

function setMarkers(data, category) {
        for (i = 0; i < data.length; i++) {
                var image;
                var name;
                var pos;
                var landmark_label = "";
                if (category == "landmarks") {
                        image = {
                                url: landmark_icon,
                                size: new google.maps.Size(91,90),
                                origin: new google.maps.Point(0,0),
                                anchor: new google.maps.Point(27, 55)
                        };
                        name = data[i].properties.Location_Name;
                        pos = new google.maps.LatLng(data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]);
                        landmark_label = data[i].properties.Details;
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
                }
                var marker = new google.maps.Marker({
                        position: pos,
                        title: name,
                        map: def_map,
                        icon: image,
                });
                if (category == "landmarks") {
                        marker.setLabel(landmark_label);
                        curr_distance = calc_distance(pos.lat(), pos.lng());
                        console.log(curr_distance);
                        if (i == 0) haversine_distance = curr_distance;
                        if (curr_distance < haversine_distance){
                                haversine_distance = curr_distance;
                                closest_landmark = marker.title;
                        }
                }
                else if (marker.title != "LUCINDA_BOYER")
                        marker.setLabel(marker.title);
                else 
                        marker.setLabel("<b>Name:</b> LUCINDA_BOYER and the closest landmark is <b>"+closest_landmark+"</b> and it is <b>"+haversine_distance+"</b> kilometers away");

                marker.addListener("click", openInfo);
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
        me = new google.maps.LatLng(myLat, myLng);
        def_map.panTo(me);
}