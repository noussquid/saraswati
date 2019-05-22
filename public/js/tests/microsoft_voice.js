let sessionId = socket.id;
let my_tile;
let txt;
// status fields and start button in UI
var phraseDiv;
var startRecognizeOnceAsyncButton;

// subscription key and region for speech services.
var subscriptionKey, serviceRegion;
var authorizationToken;
var SpeechSDK;
var recognizer;

document.addEventListener("DOMContentLoaded", function() {
    startRecognizeOnceAsyncButton = document.getElementById("startRecognizeOnceAsyncButton");
    subscriptionKey = {
        id: 'subscriptionKey',
        value: 'f94f9f7638554a1da4f61cedda978d9f',
        disabled: false
    };

    serviceRegion = {
        id: 'serviceRegion',
        value: 'westus',
        disabled: false
    };
    phraseDiv = document.getElementById("mainCanvas-div");
    console.log('subscriptionKey serviceRegion ', subscriptionKey, serviceRegion);

    startRecognizeOnceAsyncButton.addEventListener("click", function() {
        startRecognizeOnceAsyncButton.disabled = true;
        phraseDiv.innerHTML = "";

        // if we got an authorization token, use the token. Otherwise use the provided subscription key
        var speechConfig;
        if (authorizationToken) {
            speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(authorizationToken, serviceRegion.value);
        } else {
            if (subscriptionKey.value === "" || subscriptionKey.value === "subscription") {
                alert("Please enter your Microsoft Cognitive Services Speech subscription key!");
                return;
            }
            speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey.value, serviceRegion.value);
        }

        speechConfig.speechRecognitionLanguage = "en-US";
        var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizeOnceAsync(
            function(result) {
                startRecognizeOnceAsyncButton.disabled = false;
                phraseDiv.innerHTML += result.text;
                window.console.log(result);

                recognizer.close();
                recognizer = undefined;
            },
            function(err) {
                startRecognizeOnceAsyncButton.disabled = false;
                phraseDiv.innerHTML += err;
                window.console.log(err);

                recognizer.close();
                recognizer = undefined;
            });
    });

    if (!!window.SpeechSDK) {
        SpeechSDK = window.SpeechSDK;
        startRecognizeOnceAsyncButton.disabled = false;

        console.log(window.SpeechSDK);

        // in case we have a function for getting an authorization token, call it.
        if (typeof RequestAuthorizationToken === "function") {
            RequestAuthorizationToken();
        }
    }
});

// Note: Replace the URL with a valid endpoint to retrieve
//       authorization tokens for your subscription.
var authorizationEndpoint = "token.php";

function RequestAuthorizationToken() {
    if (authorizationEndpoint) {
        var a = new XMLHttpRequest();
        a.open("GET", authorizationEndpoint);
        a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        a.send("");
        a.onload = function() {
            console.log(this.responseText);
            var token = JSON.parse(atob(this.responseText.split(".")[1]));
            serviceRegion.value = token.region;
            authorizationToken = this.responseText;
            subscriptionKey.disabled = true;
            subscriptionKey.value = "using authorization token (hit F5 to refresh)";
            console.log("Got an authorization token: " + token);
        }
    }
}

let myFont;

// this sketch answers the question of 
// does the socket.id change
// during the duration of my tappin :) 
function preload() {
    myFont = loadFont('knewave-outline.otf');
}

function setup() {
    console.log('we are in setup');

    // Make the canvas the size of the mobile device screen
    mainCanvas = createCanvas(640, 480);
    mainCanvas.parent('mainCanvas-div');
    mainCanvas.style('display', 'block');

    // create a tile
    // make the div id socket.id
    my_tile = createTile(socket.id);
    my_tile.position(0, 0);
    my_tile.size(width, height);
    my_tile.elt.innerText = socket.id;

    el = document.getElementById(socket.id);

    let mc_el = new Hammer.Manager(el);
    mc_el.add(new Hammer.Tap());
    mc_el.on("tap", function(ev) {
        console.log('tap', ev);
        console.log(socket);
        my_tile.style('color', 'blue');
        my_tile.elt.innerText = socket.id;

    });
}

function draw() {
    background(50);
    strokeWeight(2);
    fill(255);
    textFont(myFont);
    textSize(12 + (mouseX / width) * 72);
    text("Attention, please.", 50, 200);
}

function createTile(id) {
    let tile = createDiv();
    tile.parent('mainCanvas-div');
    tile.elt.id = id;
    tile.style("stroke", "red");
    tile.style("fill", "blue");
    tile.textContent = ' Do Something ';
    tile.style("outline-color", "pink");
    tile.style("outline-width", 2);
    tile.style("outline-style", "solid");
    return tile;
}
