
function fillIn() {
    $.get(
			{
				dataType: "json",
				url:"TwitterTweets17.json",
				success: buildPage
				
			});
}

// Read the file of tweets first and set items in the carousel
function buildPage(result) {
	var carouselBox = document.createElement("section");
    carouselBox.setAttribute("class", "carousel slide");
    carouselBox.setAttribute("data-ride", "carousel");
    carouselBox.setAttribute("id", "tweetbox");
    var mainElem = document.createElement("div");
    mainElem.setAttribute("class","carousel-inner");
    mainElem.setAttribute("roll", "listbox");
    tweets = result
    // Place 5 at a time into a carousel item
	var i = 0;
	var item = null;
    item = document.createElement("div");
    item.className = "item";
        
	while (i < tweets.length) {
		if (i != 0 && i%5 == 0) {
			mainElem.appendChild(item);
			item = null;
            item = document.createElement("div");
            item.className = "item";
            
		}
        var tweet = document.createElement("div");
        tweet.setAttribute("class", "tweet");
        
        // Set the user info first
        var figure = document.createElement("figure");
        var img = document.createElement("img");
        try {
            imgtest = tweets[i].user.profile_image_url_https
            img.setAttribute("src", "notFound.png");
            //Test one for whether or not it exists. Works, but still throws errors
            /* $.get(imgtest).done(function () {
                alert("success");
                img.setAttribute("src", tweets[i].user.profile_image_url_https);
            }).fail(function () {
               
            }); 
            // Doesnt work, throws errors
            var request = new XMLHttpRequest();  
            request.open('GET', imgtest, true);
            request.onreadystatechange = function(){
                if (request.readyState === 4){
                    if (request.status === 200) {
                        img.setAttribute("src", tweets[i].user.profile_image_url_https);
                    }
                }
            };
            request.send();
            */
        } catch(err) {
            img.setAttribute("src", "notFound.png");
        }
                    
        var cap = document.createElement("caption");
        try {
            cap.innerHTML = tweets[i].user.name;
        } catch(err) {
            cap.innerHTML = "Undefined";
        }
        figure.appendChild(img);
        figure.appendChild(cap);
        figure.setAttribute("class", "userInfo");
        tweet.appendChild(figure);
        
        // Set the tweet data and hashtag information
        var para = document.createElement("p");
        para.innerHTML = tweets[i].text;
        tweet.appendChild(para);
        var hashList = tweets[i].entities;
        try {
            var hashNum = hashList.length;
            while (hashNum-1 >= 0) {
                var hashTags = document.createElement("p");
                hashTags.setAttribute("class", "hashes");
                hashTags.innerHTML = hashList[hashNum];
                tweet.appendChild(hashtags);
            }
        } catch(err) {
            
        }
        item.appendChild(tweet);
		
        i += 1
	}
	if (item != null) {
		mainElem.appendChild(item);
	}
    mainElem.childNodes[0].setAttribute("class", "item active");
    //i = 1;
    //while (i < mainElem.childNodes.length) {
    //    mainElem.childNodes[i-1].setAttribute("data-slide-to", i.toString());
    //    i += 1;
    // }
    //i = 0;
    //mainElem.childNodes[mainElem.childNodes.length-1].setAttribute("data-slide-to", i.toString());
    carouselBox.appendChild(mainElem);
    document.body.appendChild(carouselBox);
    
    $('#tweetbox').carousel({
                interval: 3000
    });
	
}

$('#tweetbox').carousel({
    interval: 3000
});
// Set up the change function
