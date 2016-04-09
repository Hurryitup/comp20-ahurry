var landmark_icon = "images/landmark.png";
var person_icon = "images/person.png";
var me_icon = "images/me_icon.png";
var request_url = "https://aqueous-wildwood-79601.herokuapp.com/sendLocation";
var me = {
        name:"LUCINDA_BOYER",
        lat: 0,
        lng: 0,
        nearest_landmark: {name:"", lat: 0, lng: 0, distance:0},
        image: {
                url: me_icon,
        }
};
var xmlRequest = new XMLHttpRequest();
var gmap;
var infowindow = new google.maps.InfoWindow();
var mapOptions = {
        zoom: 20,
        center: {lat: me.lat, lng: me.lng},
        mapTypeId: google.maps.MapTypeId.ROADMAP
};

function openInfo() {
        infowindow.setContent(this.label);
        infowindow.open(gmap, this);
        if (this.title == "LUCINDA_BOYER") {
                polyLine = new google.maps.Polyline({
                        path: [
                        this.position,
                        {lat:me.nearest_landmark.lat, lng:me.nearest_landmark.lng}],
                        geodesic: true,
                        strokeColor: "#FF0000",
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                });
                polyLine.setMap(gmap);
        }
}

function calc_distance (lat, lng){
        Number.prototype.toRad = function() {
                return this * Math.PI / 180;
        }

        var R = 6371; // km 
        var x1 = lat-me.lat;
        var dLat = x1.toRad();  
        var x2 = lng-me.lng;
        var dLon = x2.toRad();  
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                        Math.cos(me.lat.toRad()) * Math.cos(lat.toRad()) * 
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
                                anchor: new google.maps.Point(26, 53)
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
                                anchor: new google.maps.Point(19, 30)
                        }
                        name = data[i].login;
                        pos = new google.maps.LatLng(data[i].lat, data[i].lng);
                }
                var marker = new google.maps.Marker({
                        position: pos,
                        title: name,
                        map: gmap,
                        icon: image,
                });
                if (category == "landmarks") {
                        marker.setLabel(landmark_label);
                        curr_distance = calc_distance(pos.lat(), pos.lng());
                        if (i == 0) {me.nearest_landmark.distance = curr_distance;}
                        if (curr_distance <= me.nearest_landmark.distance){
                                me.nearest_landmark.distance = curr_distance;
                                me.nearest_landmark.name = marker.title;
                                me.nearest_landmark.lat = pos.lat();
                                me.nearest_landmark.lng = pos.lng();
                        }
                }
                else if (marker.title != me.name)
                        marker.setLabel(marker.title);
                else {
                        marker.setLabel("<b>Name: LUCINDA_BOYER</b>, and the closest landmark is <b>"+me.nearest_landmark.name+"</b> and it is <b>"+(Math.round(me.nearest_landmark.distance*100))/100+"</b> kilometers away");
                        marker.setIcon(me.image);
                }
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

function sendRequest() {
        var params = "login="+me.name+"&lat="+me.lat+"&lng="+me.lng;
        xmlRequest.open("POST", request_url, true);
        xmlRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlRequest.onreadystatechange = parse_data;
        xmlRequest.send(params);
}

function init(){
        gmap = new google.maps.Map(document.getElementById("map"), mapOptions);
        getMyLocation();
}

function getMyLocation() {
        if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser

                navigator.geolocation.getCurrentPosition(function(position) {
                                me.lat = position.coords.latitude;
                                me.lng = position.coords.longitude;
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
        gmap.panTo({lat: me.lat, lng:me.lng});
        sendRequest();
}