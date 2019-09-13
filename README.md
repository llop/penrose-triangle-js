penrose-triangle-js
===================

Drawing inspiration from the [Penrose triangle](https://en.wikipedia.org/wiki/Penrose_triangle), 
this project provides an optical illusion consisting of several cubes that move along an impossible triangular path.

## Getting started

A `canvas` is required to display the animation.

```
<canvas id='penrose-canvas' width='400' height='350'></canvas>
```

To use `penrose-triangle-js`, just import the script and set up the animation loop.

```
<script src='penrose-triangle.js'></script>
<script>
  var penroseTriangle;
  // render the triangle 1 frame at a time
  function renderLoop() {
    penroseTriangle.render();
    requestAnimationFrame(renderLoop);
  } 
  // start the animation when the page loads
  window.onload = () => {
    let canvas = document.getElementById('penrose-canvas');
    penroseTriangle = new PenroseTrinagle(canvas);
    renderLoop();
  };
</script>
```

## Advanced use

It is possible to customize the animation by providing an `options` object to the `PenroseTriangle` constructor. 
The default options are:

```
{
  triangleEdge: 300,        // length of triangle's edge in pixels
  cubeEdge: 30,             // length of cube's edge in pixels
  cubesPerTriangleEdge: 6,  // # of cuber per triangle edge
  padding: [ 50.5, 0.5 ],   // top and left padding in pixels
  loopFrames: 100,          // # of frames per loop
  lineWidth: 3,             // cube line's width in pixels
  lineColor: '#0041a3',     // cube line's color
  cubeColors: [             // colors for the cube's visible faces
    '#4f9bf7', 
    '#c0d8fc', 
    '#87b7ff' 
  ]
}
```

## License

`penrose-triangle-js` is resealsed under the MIT License. See [LICENSE](LICENSE) for details.