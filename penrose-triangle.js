'use strict';


class PenroseTrinagle {
  
  
  constructor(canvas, {
      triangleEdge = 300,
      cubeEdge = 30,
      cubesPerTriangleEdge = 6,
      padding = [ 50.5, 0.5 ],
      loopFrames = 100,
      lineWidth = 3,
      lineColor = '#0041a3',
      cubeColors = [ '#4f9bf7', '#c0d8fc', '#87b7ff' ]
    } = {}) {
      
    // set options
    this.triangleEdge = triangleEdge;
    this.cubeEdge = cubeEdge;
    this.cubesPerTriangleEdge = cubesPerTriangleEdge;
    this.padding = [ padding[0], padding[1] ];
    this.loopFrames = loopFrames;
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;
    this.cubeColors = [ cubeColors[0], cubeColors[1], cubeColors[2] ];
    
    // prepare graphics context
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.context.lineJoin = 'round';
    this.context.lineWidth = this.lineWidth;
    this.context.strokeStyle = this.lineColor;
    
    // precalculate lengths and cube coordinates
    this.triangleHeight = this.triangleEdge * Math.sqrt(3) / 2;
    this.ch = this.cubeEdge * Math.sqrt(3) / 2;
    this.chb = this.cubeEdge / 2;
    this.calculateCubesCoords();
    
    // start at frame 0
    this.frame = 0;
  }
  
  
  // calcultes coordinates for the cubes with the established parameters
  calculateCubesCoords() {
    // triangle vertices
    let va = [                                           // bottom-left
        this.padding[0], 
        this.triangleEdge + this.padding[1] 
      ];                      
    let vb = [                                           // bottom-right
        this.triangleEdge + this.padding[0], 
        this.triangleEdge + this.padding[1] 
      ];  
    let vc = [                                           // top
        this.triangleEdge / 2.0 + this.padding[0], 
        this.triangleEdge - this.triangleHeight + this.padding[1] 
      ];  
  
    let minc = this.cubesPerTriangleEdge * this.loopFrames;
    this.finc = this.triangleEdge / minc;   // length increment for a frame
    this.vinc1 = [                          // increment vector along the right edge
        (vc[0] - vb[0]) / minc, 
        (vc[1] - vb[1]) / minc 
      ];
    this.vinc2 = [                          // vector increment along the left edge
        (va[0] - vc[0]) / minc, 
        (va[1] - vc[1]) / minc 
      ];
    
    // cubes' coordinates
    this.cubeMid = ((this.cubesPerTriangleEdge - 1) / 2) | 0;         // the 1st cube to draw
    let inc = this.triangleEdge / this.cubesPerTriangleEdge;          // separation between cubes
    this.v = new Float64Array(6 * this.cubesPerTriangleEdge);         // coordinates array
    this.vt = new Float64Array(6 * this.cubesPerTriangleEdge);        // coords array for render
    let j = 0;
    for (let i = this.cubeMid; i < this.cubesPerTriangleEdge; ++i) {  // bottom-right
      this.v[j++] = va[0] + inc * i;
      this.v[j++] = va[1];
    }
    let vdir = [                                                      // right edge Euclidean vector
        (vc[0] - vb[0]) / this.cubesPerTriangleEdge, 
        (vc[1] - vb[1]) / this.cubesPerTriangleEdge 
      ];
    for (let i = 0; i < this.cubesPerTriangleEdge; ++i) {             // right edge
      this.v[j++] = vb[0] + vdir[0] * i;
      this.v[j++] = vb[1] + vdir[1] * i;  
    }
    vdir = [                                                          // left edge vector
        (va[0] - vc[0]) / this.cubesPerTriangleEdge, 
        (va[1] - vc[1]) / this.cubesPerTriangleEdge 
      ];
    for (let i = 0; i < this.cubesPerTriangleEdge; ++i) {             // left edge
      this.v[j++] = vc[0] + vdir[0] * i;
      this.v[j++] = vc[1] + vdir[1] * i;
    }
    for (let i = 0; i < this.cubeMid; ++i) {                          // bottom-left
      this.v[j++] = va[0] + inc * i;
      this.v[j++] = va[1];
    }
  }
  
  
  render() {
    // calculate cube positions 
    this.updateCubesPositions();
    
    // clear canvas and draw
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawTriangle();
    
    // increment current frame
    if (++this.frame == this.loopFrames) this.frame = 0;
  }
  
  // 'renderLoop()' is invoked at every repaint
  renderLoop = timestamp => {
    this.render();
    requestAnimationFrame(this.renderLoop);
  }
  
  // call 'start()' to begin the animation
  start() {
    requestAnimationFrame(this.renderLoop);
  }
  
  
  // calculate cubes' positions for the current frame
  updateCubesPositions() {
    // length increments for current frame
    let inc = this.finc * this.frame;
    let inc1X = this.vinc1[0] * this.frame;
    let inc1Y = this.vinc1[1] * this.frame;
    let inc2X = this.vinc2[0] * this.frame;
    let inc2Y = this.vinc2[1] * this.frame;
    
    let j = 0;
    for (let i = this.cubeMid; i < this.cubesPerTriangleEdge; ++i) {  // bottom-right
      this.vt[j] = this.v[j++] + inc;
      this.vt[j] = this.v[j++];
    }
    for (let i = 0; i < this.cubesPerTriangleEdge; ++i) {             // right edge
      this.vt[j] = this.v[j++] + inc1X;
      this.vt[j] = this.v[j++] + inc1Y;
    }
    for (let i = 0; i < this.cubesPerTriangleEdge; ++i) {             // left edge
      this.vt[j] = this.v[j++] + inc2X;
      this.vt[j] = this.v[j++] + inc2Y;   
    }  
    for (let i = 0; i < this.cubeMid; ++i) {                          // bottom-left
      this.vt[j] = this.v[j++] + inc;
      this.vt[j] = this.v[j++];          
    }
  }
  
  
  // draw face 0
  drawCubePart1(x, y) {
    this.drawCubeSide(
        x, y, 
        x + this.chb, y - this.ch,
        x + this.cubeEdge, y,
        x + this.chb, y + this.ch,
        this.cubeColors[0]
      );
  }
  
  // draw faces 1 and 2
  drawCubePart2(x, y) {
    this.drawCubeSide(
        x, y, 
        x - this.cubeEdge, y,
        x - this.chb, y - this.ch,
        x + this.chb, y - this.ch,
        this.cubeColors[1]
      );
    this.drawCubeSide(
        x, y, 
        x + this.chb, y + this.ch,
        x - this.chb, y + this.ch,
        x - this.cubeEdge, y,
        this.cubeColors[2]
      );
  }
  
  drawCubeSide(x0, y0, x1, y1, x2, y2, x3, y3, color) {
    this.context.beginPath();
    this.context.moveTo(x0, y0);
    this.context.lineTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.lineTo(x3, y3);
    this.context.closePath();
    this.context.fillStyle = color;
    this.context.stroke();
    this.context.fill();
  }

  
  // draw the whole cube, centered at (x, y)
  drawCube(x, y) {
    this.drawCubePart1(x, y);
    this.drawCubePart2(x, y);
  }
  
  // draw the triangle
  drawTriangle() {
    this.drawCubePart1(this.vt[0], this.vt[1]);
    let j = 2;
    while (j < this.vt.length) {
      this.drawCube(this.vt[j++], this.vt[j++]);
    }
    this.drawCubePart2(this.vt[0], this.vt[1]);
  }
  
}






