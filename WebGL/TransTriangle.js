let VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_Matrix;\n' +
    'void main(){\n' +
    'gl_Position =  u_Matrix * a_Position;\n' +
    '}\n';

let FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main(){\n' +
    'gl_FragColor = u_FragColor;\n' +
    '}\n';

function myDrawTriangle(gl) {
    let aPositionInJS = gl.getAttribLocation(gl.program, 'a_Position');
    let uFragColorInJS = gl.getUniformLocation(gl.program, 'u_FragColor');
    let uMatrixInJS = gl.getUniformLocation(gl.program, 'u_Matrix');
    if (aPositionInJS < 0) {
        console.log('Failed to getAttribLocation');
        return;
    }
    if (!uFragColorInJS) {
        console.log('Failed to getUniformLocation');
        return;
    }
    gl.uniform4f(uFragColorInJS, 1.0, 0.0, 0.0, 1.0);
    // add trans vector data
    let angle = 180.0;
    let radian = Math.PI * angle / 180.0;
    let cosB = Math.cos(radian);
    let sinB = Math.sin(radian);
    // Note: WebGL is column major order
    let uMatrixPrepare = new Float32Array([
        2 * cosB, 2 * sinB, 0.0, 0.0,
        -2 * sinB, 2 * cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
    ]);
    gl.uniformMatrix4fv(uMatrixInJS, false, uMatrixPrepare);

    // buffer and draw
    let num = initVertexBuffers(gl);
    if (num < 0) {
        console.log('Failed to initVertexBuffers');
        return;
    }
    // skip s point
    gl.drawArrays(gl.TRIANGLE_FAN, 0, num);
}

function initVertexBuffers(gl, aPositionInJS) {
    let numForPoint = 2;
    let vertices = new Float32Array([-0.5, -0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5]);
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to createBuffer');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(aPositionInJS, numForPoint, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPositionInJS);

    return vertices.length / numForPoint;
}

function main() {
    let canvas = document.getElementById('glcanvas');
    let gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('initWebGL Failed');
        return;
    }
    // init shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed initShaders');
        return;
    }
    // set gray
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    myDrawTriangle(gl);
}