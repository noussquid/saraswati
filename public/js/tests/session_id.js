let sessionId = socket.id;
let my_tile;
let txt;

// this sketch answers the question of 
// does the socket.id change
// during the duration of my tappin :) 

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
