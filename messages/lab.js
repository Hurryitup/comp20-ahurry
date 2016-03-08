function parse() {
        var myRequest = new XMLHttpRequest();
        myRequest.onreadystatechange = function() {
                if (myRequest.readyState == 4 && myRequest.status == 200){
                        var data = JSON.parse(JSON.parse(JSON.stringify(myRequest.responseText)));
                        parseData(data);
                }
        }
        myRequest.open("GET", "data.json");
        myRequest.send();
}

function parseData(data){
        var messages_div = document.getElementById("messages");
        for (message in data) {
                messages_div.innerHTML += "<h2>"+data[message]["username"]+"</h2>"
                messages_div.innerHTML += "<p class='message'>"+data[message]["content"]+"\n</p>"
                messages_div.innerHTML += "<p></p>"
                messages_div.innerHTML += "<p class='sender'>"+data[message]["username"]+"\n</p>"
        }
}
// console.log(response);