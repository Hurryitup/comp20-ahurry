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
                content = "<div class='message_super'><div class='ms2'><hr/><p class='message'>"+data[message]["content"]+"</p></div>";
                content += "<p class='sender'>"+data[message]["username"]+"</p></div>";
                messages_div.innerHTML += content;
        }
        messages_div.innerHTML += "<hr/>"
}
// console.log(response);