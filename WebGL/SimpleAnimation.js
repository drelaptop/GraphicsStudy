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

let ANGLE_STEP = 1.0;

function drawTriangle(gl) {
    let aPositionInJS = gl.getAttribLocation(gl.program, 'a_Position');
    let uFragColorInJS = gl.getUniformLocation(gl.program, 'u_FragColor');
    let uMatrixInJS = gl.getUniformLocation(gl.program, 'u_Matrix');
    if (aPositionInJS < 0) {
        console.log('Failed to get a_Position');
        return;
    }
    if (!uFragColorInJS) {
        console.log('Failed to get u_FragColor');
        return;
    }
    if (!uMatrixInJS) {
        console.log('Failed to get u_Matrix');
        return;
    }
    gl.uniform4f(uFragColorInJS, 1.0, 0.0, 0.0, 1.0);

    let uMatrixTrans = new Matrix4();
    // buffer and draw
    let num = initVertexBuffers(gl);
    if (num < 0) {
        console.log('Failed to initVertexBuffers');
        return;
    }
    let currentAngle = 0.0;
    let tick = function() {
        currentAngle = calcAngle(currentAngle);
        draw(gl, num, currentAngle, uMatrixTrans, uMatrixInJS);
        requestAnimationFrame(tick);
        uMatrixTrans = uMatrixTrans;
    };
    tick();
}

function draw(gl, n, currentAngle, uMatrixTrans, uMatrixInJS) {
    // amazing
    uMatrixTrans.translate(0.005, 0.005, 0.0);
    uMatrixTrans.rotate(currentAngle, 0, 0, 1);
    gl.uniformMatrix4fv(uMatrixInJS, false, uMatrixTrans.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

let gLast = Date.now();

function calcAngle(angle) {
    let now = Date.now();
    let dela = now - gLast;
    gLast = now;
    let newAngle = angle + (ANGLE_STEP * dela) / 1000.0;
    console.log('fps:' + (1.0 / dela * 1000).toFixed(0));
    return newAngle %= 360;
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

    drawTriangle(gl);
}