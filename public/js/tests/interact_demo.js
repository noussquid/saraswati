    var pixelSize = 16;


    interact('.rainbow-pixel-canvas')
        .origin('self')
        .draggable({
            modifiers: [{
                // snap to the corners of a grid
                type: 'snap',
                targets: [
                    interact.snappers.grid({
                        x: pixelSize,
                        y: pixelSize
                    }),
                ],
            }],
        })
        // draw colored squares on move
        .on('dragmove', function(event) {
            var context = event.target.getContext('2d'),
                // calculate the angle of the drag direction
                dragAngle = 180 * Math.atan2(event.dx, event.dy) / Math.PI;

            // set color based on drag angle and speed
            context.fillStyle = 'hsl(' + dragAngle + ', 86%, ' +
                (30 + Math.min(event.speed / 1000, 1) * 50) + '%)';

            // draw squares
            context.fillRect(event.pageX - pixelSize / 2, event.pageY - pixelSize / 2,
                pixelSize, pixelSize);
        })
        // clear the canvas on doubletap
        .on('doubletap', function(event) {
            var context = event.target.getContext('2d');

            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        });

    function resizeCanvases() {
        [].forEach.call(document.querySelectorAll('.rainbow-pixel-canvas'), function(canvas) {
            canvas.width = document.body.clientWidth;
            canvas.height = window.innerHeight * 0.7;
        });
    }

    // interact.js can also add DOM event listeners
    interact(document).on('DOMContentLoaded', resizeCanvases);
   interact(window).on('resize', resizeCanvases);
