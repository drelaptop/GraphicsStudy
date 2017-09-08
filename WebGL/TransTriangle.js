var g_points = [];

var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_Matrix;\n' +
    'void main(){\n' +
    'gl_Position =  u_Matrix * a_Position;\n' +
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main(){\n' +
    'gl_FragColor = u_FragColor;\n' +
    '}\n';

function myDrawTriangle(gl) {
    var a_PositionInJS = gl.getAttribLocation(gl.program, 'a_Position');
    var u_FragColorInJS = gl.getUniformLocation(gl.program, 'u_FragColor');
    var u_MatrixInJS = gl.getUniformLocation(gl.program, 'u_Matrix');
    if (a_PositionInJS < 0) {
        console.log('Failed to getAttribLocation');
        return;
    }
    if (!u_FragColorInJS) {
        console.log('Failed to getUniformLocation');
        return;
    }
    gl.uniform4f(u_FragColorInJS, 1.0, 0.0, 0.0, 1.0);
    //add trans vector data
    var angle = 45.0;
    var radian = Math.PI * angle / 180.0;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);
    var u_MatrixPrepare = new Float32Array([
        cosB, sinB, 0.0, 0.0, 
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    gl.uniformMatrix4fv(u_MatrixInJS, false, u_MatrixPrepare);

    //buffer and draw
    var num = initVertexBuffers(gl);
    if (num < 0) {
        console.log('Failed to initVertexBuffers');
        return;
    }
    //skip s point
    gl.drawArrays(gl.TRIANGLE_FAN, 0, num);
}

function initVertexBuffers(gl, a_PositionInJS) {
    var numForPoint = 2;
    var vertices = new Float32Array([-0.5, -0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5]);
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

    myDrawTriangle(gl);
}