let G_POINTS = [];

let VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main(){\n' +
    'gl_Position = a_Position;\n' +
    'gl_PointSize = a_PointSize;\n' +
    '}\n';

let FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main(){\n' +
    'gl_FragColor = u_FragColor;\n' +
    '}\n';

function myDrawPoint(gl, canvas) {
    let aPositionInJS = gl.getAttribLocation(gl.program, 'a_Position');
    let aPointSizeInJS = gl.getAttribLocation(gl.program, 'a_PointSize');
    let uFragColorInJS = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (aPositionInJS < 0 || aPointSizeInJS < 0) {
        console.log('Failed to getAttribLocation');
        return;
    }
    if (!uFragColorInJS) {
        console.log('Failed to getUniformLocation');
        return;
    }
    // mouse click
    canvas.onmousedown = function(ev) {
        click(ev, gl, canvas, aPositionInJS, aPointSizeInJS, uFragColorInJS);
    };
}

function click(ev, gl, canvas, aPositionInJS, aPointSizeInJS, uFragColorInJS) {
    let x = ev.clientX;
    let y = ev.clientY;
    let rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    G_POINTS.push(x);
    G_POINTS.push(y);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // show RGB values
    console.log('RGB:' + x.toFixed(1) + ',' + y.toFixed(1) + ',' + (x * y).toFixed(1));

    let len = G_POINTS.length;
    for (let i = 0; i < len; i += 2) {
        gl.vertexAttrib3f(aPositionInJS, G_POINTS[i], G_POINTS[i + 1], 0.0);
        gl.vertexAttrib1f(aPointSizeInJS, i > 10 ? 15 : i + 5);
        // color RGBA
        gl.uniform4f(uFragColorInJS, G_POINTS[i], G_POINTS[i + 1], G_POINTS[i] * G_POINTS[i + 1], 1.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
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
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    myDrawPoint(gl, canvas);
}
