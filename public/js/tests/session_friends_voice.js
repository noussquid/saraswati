let sessionId = socket.id;
let my_tile;
let friends_tiles = [];

let txt;
let coords;

// grid settings
let grid;
let grid_cols = 47;
let grid_rows = 38;
let row_height = 32;
let col_width = 32;

// tile size
let boxSize = 128;

let mainCanvas;
let gridCanvas;

let SpeechSDK;
let recorder;
let speechConfig;
let audioConfig;

// this sketch answers the question of 
// does the socket.id change
// during the duration of my tappin :) 

function setup() {
    console.log('we are in setup');

    // Make the canvas the size of the mobile device screen
    mainCanvas = createCanvas(2000, 2000);
    mainCanvas.parent('dragWrapper');
    mainCanvas.style('display', 'block');

    // generate a 2D array to hold the state of each grid cell
    grid = create2DArray(grid_cols, grid_rows, false);
    drawGrid();

    // create a tile
    // make the div id socket.id
    my_tile = createTile(socket.id);
    my_tile.position(displayWidth / 2, displayHeight / 2);
    my_tile.size(boxSize, boxSize);

    if (!!window.SpeechSDK) {
        SpeechSDK = window.SpeechSDK;
        console.log(window.SpeechSDK);
    }

    if (socket.id == undefined) {
        my_tile.elt.innerText = 'tap me'
    } else {
        my_tile.elt.innerText = socket.id;
    }


    el = document.getElementById(socket.id);

    let mc_el = new Hammer.Manager(el);
    mc_el.add(new Hammer.Pan({
        threshold: 0,
        pointers: 0
    }));

    mc_el.add(new Hammer.Swipe()).recognizeWith(mc_el.get('pan'));
    mc_el.add(new Hammer.Rotate({
        threshold: 0
    })).recognizeWith(mc_el.get('pan'));

    mc_el.add(new Hammer.Pinch({
        threshold: 0
    })).recognizeWith([mc_el.get('pan'), mc_el.get('rotate')]);

    mc_el.add(new Hammer.Tap({
        event: 'doubletap',
        taps: 2
    }));
    mc_el.add(new Hammer.Tap());

    mc_el.on("tap", function(ev) {
        my_tile.style('color', 'blue');
        my_tile.elt.innerText = socket.id;

        speechConfig = SpeechSDK.SpeechConfig.fromSubscription('f94f9f7638554a1da4f61cedda978d9f', 'westus');
        speechConfig.speechRecognitionLanguage = "en-US";

        var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizeOnceAsync(
            function(result) {
                my_tile.elt.innerText = result.text;
                window.console.log(result);

                recognizer.close();
                recognizer = undefined;
            },
            function(err) {
                window.console.log(err);

                recognizer.close();
                recognizer = undefined;
            });

        let data = {
            type: ev.type,
            x: my_tile.x,
            y: my_tile.y,
            w: boxSize,
            h: boxSize,
            id: socket.id
        };

        emit('mouse', data, socket.id);

    });

    mc_el.on("panstart panmove panend", function(ev) {

        // snap to grid
        let grid_x;
        let grid_y;
        let found = false;

        for (let col = 0; col < grid_cols; col++) {
            for (let row = 0; row < grid_rows; row++) {
                grid_x = col * col_width;
                grid_y = row * row_height;
                if (grid_x > ev.center.x && grid_y > ev.center.y) {
                    found = true;
                    grid_x = grid_x - col_width;
                    grid_y = grid_y - row_height;
                    break;
                }
            }
            if (found) {
                break;
            }
        }

        my_tile.x = grid_x;
        my_tile.y = grid_y;
        my_tile.elt.innerText = ev.type;
        my_tile.position(grid_x, grid_y);


        for (var i = 0; i < friends_tiles.length; i++) {
            hit = collideRectRect(my_tile.x, my_tile.y, my_tile.width, my_tile.height, friends_tiles[i].x, friends_tiles[i].y, friends_tiles[i].width, friends_tiles[i].height);
            if (hit) {
                friends_tiles[i].elt.style.outlineColor = "yellow";
                my_tile.elt.style.outlineColor = "yellow";

                if (ev.type == 'panend') {
                    console.log('my_tile, friends_tile[i]', my_tile, friends_tiles[i]);
                    if (friends_tiles[i].x < my_tile.x && friends_tiles[i].y < my_tile.y) {
                        my_tile.x = friends_tiles[i].x + my_tile.width;
                        my_tile.y = friends_tiles[i].y;
                        my_tile.position(my_tile.x, my_tile.y);
                    }

                    if (friends_tiles[i].x > my_tile.x) {
                        my_tile.x = friends_tiles[i].x - my_tile.width;
                        my_tile.y = friends_tiles[i].y;
                        my_tile.position(my_tile.x, my_tile.y);
                    }

                    if (my_tile.y > friends_tiles[i].y && my_tile.x >= friends_tiles[i].x) {
                        my_tile.x = friends_tiles[i].x;
                        my_tile.position(my_tile.x, my_tile.y);
                    }
                }

            } else {
                friends_tiles[i].elt.style.outlineColor = 'blue';
                my_tile.elt.style.outlineColor = 'red';
            }

        }

        my_tile.elt.textContent = '(' + my_tile.x + ' ' + my_tile.y + ')\n' + ev.type;

        let data = {
            type: ev.type,
            x: my_tile.x,
            y: my_tile.y,
            w: boxSize,
            h: boxSize,
            id: socket.id
        };


        emit('mouse', data, socket.id);
    });

    socket.on('mouse', function(data, sessionId) {
        let updated = false;
        let tile;
        let hit;
        for (var i = 0; i < friends_tiles.length; i++) {
            if (data.id != my_tile.id) {
                // if a div for this socket.id exists
                // update it
                tile = document.getElementById(data.id);
                if (tile != undefined) {
                    console.log('updating friends tile ');
                    friends_tiles[i].position(data.x, data.y);
                    friends_tiles[i].size(data.w, data.h);
                    updated = true;

                    hit = collideRectRect(my_tile.x, my_tile.y, my_tile.width, my_tile.height, friends_tiles[i].x, friends_tiles[i].y, friends_tiles[i].width, friends_tiles[i].height);

                    friends_tiles[i].elt.textContent = '(' + data.x + ' ' + data.y + ')\n' + data.type + '\n\n\n\n\nfriend';
                    if (hit) {
                        friends_tiles[i].elt.style.outlineColor = "yellow";
                        my_tile.elt.style.outlineColor = "yellow";
                    } else {
                        friends_tiles[i].elt.style.outlineColor = 'blue';
                        my_tile.elt.style.outlineColor = 'red';
                    }
                }
            }

            if (updated)
                break;
        }

        if (!updated) {
            console.log('creating a new friends tile');
            tile = createTile(data.id);
            tile.position(data.x, data.y);
            tile.size(data.w, data.h);
            tile.elt.textContent = '(' + data.x + ' ' + data.y + ')\n' + data.type + '\n\n\n\n\nfriend';
            tile.style("stroke", "red");
            tile.style("fill", "blue");
            tile.style("outline-color", "blue");
            tile.style("outline-width", 2);
            tile.style("outline-style", "solid");
            friends_tiles.push(tile);

            hit = collideRectRect(my_tile.x, my_tile.y, my_tile.width, my_tile.height, tile.x, tile.y, tile.width, tile.height);

            // make big tile
            if (hit) {
                console.log('we have a hit');
                tile.elt.style.outlineColor = "yellow";
                my_tile.elt.style.outlineColor = "yellow";
            } else {
                console.log('we dont have a hit');
                tile.elt.style.outlineColor = 'blue';
                tile.elt.style.outlineColor = 'red';
            }

        }


    });
}

function createTile(id) {
    let tile = createDiv();
    tile.parent('dragWrapper');
    tile.elt.id = id;
    tile.style("stroke", "red");
    tile.style("fill", "blue");
    tile.style("outline-color", "pink");
    tile.style("outline-width", 2);
    tile.style("outline-style", "solid");
    return tile;
}


function emit(eventName, data) {
    socket.emit(eventName, data, socket.id);
}

// init an array cols x rows large
function create2DArray(cols, rows, value) {
    let a = [];
    for (let col = 0; col < cols; col++) {
        a[col] = [];
        for (let row = 0; row < rows; row++) {
            a[col][row] = value;
        }
    }
    return a;
}

// draw grid lines
function drawGrid() {
    stroke(0, 0, 0, 20);
    for (let x = 0; x < width; x += col_width) {
        line(x, 0, x, height);
    }
    for (let y = 0; y < height; y += row_height) {
        line(0, y, width, y);
    }
}
