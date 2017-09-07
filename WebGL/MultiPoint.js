var g_points = [];

var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main(){\n' +
    'gl_Position = a_Position;\n' +
    'gl_PointSize = a_PointSize;\n' +
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main(){\n' +
    'gl_FragColor = u_FragColor;\n' +
    '}\n';

function myDrawMultiPoint(gl) {
    var a_PositionInJS = gl.getAttribLocation(gl.program, 'a_Position');
    var a_PointSizeInJS = gl.getAttribLocation(gl.program, 'a_PointSize');
    var u_FragColorInJS = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (a_PositionInJS < 0 || a_PointSizeInJS < 0) {
        console.log('Failed to getAttribLocation');
        return;
    }
    if (!u_FragColorInJS) {
        console.log('Failed to getUniformLocation');
        return;
    }
    gl.vertexAttrib1f(a_PointSizeInJS, 10);
    gl.uniform4f(u_FragColorInJS, 1.0, 0.0, 0.0, 1.0);
    //buffer and draw
    var num = initVertexBuffers(gl);
    if (num < 0) {
        console.log('Failed to initVertexBuffers');
        return;
    }
    //skip s point
    gl.drawArrays(gl.POINTS, 1, num - 1);
}

function initVertexBuffers(gl, a_PositionInJS) {
    var numForPoint = 2;
    var vertices = new Float32Array([0.0, 0.0, 0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to createBuffer');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_PositionInJS, numForPoint, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_PositionInJS);

    return vertices.length / numForPoint;
}

function main() {
    var canvas = document.getElementById("glcanvas");
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log("initWebGL Failed");
        return;
    }
    //init shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed initShaders');
        return;
    }
    // set gray
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    myDrawMultiPoint(gl);
}