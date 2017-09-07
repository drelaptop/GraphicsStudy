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

function myDrawPoint(gl, canvas) {
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
    var firstPosition = new Float32Array([0.0, 0.5, 1.0, 1.0]);
    gl.vertexAttrib4fv(a_PositionInJS, firstPosition);
    //mouse click
    canvas.onmousedown = function(ev) {
        click(ev, gl, canvas, a_PositionInJS, a_PointSizeInJS, u_FragColorInJS);
    };

    //Draw
    gl.drawArrays(gl.POINTS, 0, 1);
}

function click(ev, gl, canvas, a_PositionInJS, a_PointSizeInJS, u_FragColorInJS) {
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    g_points.push(x);
    g_points.push(y);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //show RGB values
    console.log('RGB:' + x.toFixed(1) + ',' + y.toFixed(1) + ',' + (x * y).toFixed(1));

    var len = g_points.length;
    for (var i = 0; i < len; i += 2) {
        gl.vertexAttrib3f(a_PositionInJS, g_points[i], g_points[i + 1], 0.0);
        gl.vertexAttrib1f(a_PointSizeInJS, i > 10 ? 15 : i + 5);
        //color RGBA
        gl.uniform4f(u_FragColorInJS, g_points[i], g_points[i + 1], g_points[i] * g_points[i + 1], 1.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
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
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    myDrawPoint(gl, canvas);
}