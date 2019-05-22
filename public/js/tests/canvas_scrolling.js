let sessionId = socket.id;
let my_tile;
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



// this sketch answers the question of 
// how do i scroll a position on a canvas
// using touch/mouse coordinates

function setup() {
    console.log('we are in setup');

    // Make the canvas the size of the mobile device screen
    mainCanvas = createCanvas(2000, 2000);
    mainCanvas.parent('mainCanvas-div');
    mainCanvas.style('display', 'block');

    txt = createDiv('gestureDiv');
    txt.elt.innerText = 'touch me';

    coords = createDiv('coordsDiv');
    coords.style('color', 'red');

    // create a new Layer to load these Images onto
    gridCanvas = createGraphics(2000, 2000);
    // generate a 2D array to hold the state of each grid cell
    grid = create2DArray(grid_cols, grid_rows, false);

    drawGrid();
    
    // things that happen when you gesture on the canvas
    myElement = document.getElementById('mainCanvas-div');

    // create a simple instance
    // by default, it only adds horizontal recognizers
    var mc = new Hammer(myElement);

    // Tap recognizer with minimal 2 taps
    mc.get('doubletap').set({
        enable: true
    });

    // let the pan gesture support all directions.
    // this will block the vertical scrolling on a touch-device while on the element
    mc.get('pan').set({
        direction: Hammer.DIRECTION_ALL
    });

    mc.get('pinch').set({
        enable: true
    });

    mc.get('rotate').set({
        enable: true
    });


    mc.add(new Hammer.Tap());

    mc.on("doubletap panleft panright panu tap press pinch rotate", function(ev) {
        txt.elt.innerText = ev.type + " gesture detected.";
        txt.position(touches[touches.length - 1].x, touches[touches.length - 1].y);
        coords.elt.innerText = '(' + touches[touches.length - 1].x + ',' + touches[touches.length -1].y + ')';
        coords.position(touches[touches.length - 1].x, touches[touches.length - 1].y - 32);
    });
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


