
function toggleView (e) {
    var allTalks = document.getElementById('talks');
    var yourTalks = document.getElementById('yours');

    if (allTalks.style.display === "block") {
        document.getElementById('all').classList.toggle("active");
        document.getElementById('your').classList.toggle("active");
        allTalks.style.display = "none";
        yourTalks.style.display = "block";
    } else {
        document.getElementById('all').classList.toggle("active");
        document.getElementById('your').classList.toggle("active");
        allTalks.style.display = "block";
        yourTalks.style.display = "none";
    }
}

function addCollapse() {
    var coll = document.getElementsByClassName("collapsible");
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.parentNode.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}

function renderWatched () {
    var watched = getWatched();
    var coll = document.getElementsByTagName('input');
    console.log(coll);
    for (var i = 0; i < coll.length; i++) {
        var url = coll[i].parentNode.previousElementSibling.previousElementSibling.href;
        for (var j = 0; j < watched.length; j++) {
            if (watched[j] == url) {
                console.log("check");
                coll[i].checked = true;
            }
        }
    }
}


function getYours () {
    var yours = localStorage.getItem('yourTalks');
    if (!yours) {
        yours = [];
        localStorage.setItem('yourTalks', JSON.stringify(yours));
    } else {
        yours = JSON.parse(yours);
    }
    return yours;
}

function getWatched () {
    var yours = localStorage.getItem('watchedTalks');
    if (!yours) {
        yours = [];
        localStorage.setItem('watchedTalks', JSON.stringify(yours));
    } else {
        yours = JSON.parse(yours);
    }
    return yours;
}


function fetchTalks () {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            displayTalks(this.responseText);
        }
    };
    xmlhttp.open("GET", "talks.json", true);
    xmlhttp.send();

    var yourTalks = document.getElementById('yours');
    renderTalks(getYours(), yourTalks, false);
}

function displayTalks (json) {
    var talks = JSON.parse(json);
    var talkList = document.getElementById('talks');
    renderTalks(talks, talkList, true);
}


function renderTalks (talks, node, state) {
    if (!state) {
        node.innerHTML = '';
    }

    for (var i = 0; i < talks.length; i++) {
        var name = talks[i].name;
        var descr = talks[i].description;
        var url = talks[i].url;
        var btn;
        if (state) {
            btn = '<a type="button" onclick="addTalk(this)">Add</a>  ';
        } else {
            btn = '<a type="button" onclick="removeTalk(this)">Remove</a>  ';
        }

        node.innerHTML +=
            '<div> <h5 class="collapsible">' + name + '</h5>' +
            '<a href="' + url +'" target="_blank">Watch</a> ' +
            btn +
            ' <label class="form-checkbox">' +
            '<input type="checkbox">' +
            '<i class="form-icon" onclick=watchedTalk(this)></i>Watched' +
            '</label>' +
            '</div>' +
            '<div class="content"><p>' + descr + '</p></div>';
    }
    addCollapse();
    renderWatched();
}

function addTalk (e) {
    var yours = getYours();
    var name = e.previousElementSibling.previousElementSibling.innerText;
    var url = e.previousElementSibling.href;
    var descr = e.parentNode.nextElementSibling.lastChild.innerText;
    var talk = {"name" : name, "description" : descr, "url" : url};
    yours.push(talk);
    localStorage.setItem('yourTalks', JSON.stringify(yours));
    renderTalks(yours, document.getElementById('yours'), false);
}

function removeTalk (e) {
    var yours = getYours();
    var url = e.previousElementSibling.href;
    console.log(url);
    for (var i = 0; i < yours.length; i++) {
        if (url == yours[i].url) {
            yours.splice(i,1);
            console.log("sliced");
        }
    }
    console.log(yours);
    localStorage.setItem('yourTalks', JSON.stringify(yours));
    renderTalks(yours, document.getElementById('yours'), false);
}

function watchedTalk (e) {
    var watched = getWatched();
    var url = e.parentNode.previousElementSibling.previousElementSibling.href;
    if (!e.previousElementSibling.checked) { // now watched
        watched.push(url);
        localStorage.setItem('watchedTalks', JSON.stringify(watched));
    } else {
        for (var i = 0; i < watched.length; i++) {
            if (url == watched[i]) {
                watched.splice(i,1);
            }
        }
        localStorage.setItem('watchedTalks', JSON.stringify(watched));
    }
}
