let VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    'gl_Position = a_Position;\n' +
    'gl_PointSize = 10.0;\n' +
    'v_Color = a_Color;\n' +
    '}\n';

let FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    'gl_FragColor = v_Color;\n' +
    '}\n';

function myDrawTriangle(gl) {
    let aPositionInJS = gl.getAttribLocation(gl.program, 'a_Position');
    let aColorInJS = gl.getAttribLocation(gl.program, 'a_Color');
    if (aPositionInJS < 0 || aColorInJS < 0) {
        console.log('Failed to getAttribLocation');
        return;
    }

    // buffer and draw
    let num = initVertexBuffers(gl, aPositionInJS, aColorInJS);
    if (num < 0) {
        console.log('Failed to initVertexBuffers');
        return;
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, num);
}

function initVertexBuffers(gl, aPositionInJS, aColorInJS) {
    let numForPoint = 5;
    let vertices = new Float32Array([
        -0.5, -0.5, 1.0, 0.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0,
        0.5, 0.5, 0.0, 1.0, 0.0,
        -0.5, 0.5, 1.0, 1.0, 1.0,
    ]);
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to createBuffer');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    let eLength = vertices.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(aPositionInJS, 2, gl.FLOAT, false, eLength * 5, 0);
    gl.vertexAttribPointer(aColorInJS, 3, gl.FLOAT, false, eLength * 5, eLength * 2);
    gl.enableVertexAttribArray(aPositionInJS);
    gl.enableVertexAttribArray(aColorInJS);

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
