"use strict";
exports.__esModule = true;
exports.getContext = function (width, height) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    return canvas.getContext('2d');
};
exports.getImageData = function (src, scale) {
    if (scale === void 0) { scale = 1; }
    var img = new Image();
    src = src || img.src;
    // Can't set cross origin to be anonymous for data url's
    // https://github.com/mrdoob/three.js/issues/1305
    if (src.startsWith('data'))
        img.crossOrigin = 'Anonymous';
    return new Promise(function (resolve, reject) {
        img.onload = function () {
            var width = img.width * scale;
            var height = img.height * scale;
            var context = exports.getContext(width, height);
            context.drawImage(img, 0, 0, width, height);
            var data = context.getImageData(0, 0, width, height).data;
            resolve(data);
        };
        var errorHandler = function () { return reject('An error occurred attempting to load image'); };
        img.onerror = errorHandler;
        img.onabort = errorHandler;
        img.src = src;
    });
};
exports.getCounts = function (data, ignore) {
    var color = '';
    var countMap = {};
    var rgbComponents = [];
    var alpha;
    for (var i = 0; i < data.length; i += 4 /* 4 gives us r, g, b, and a*/) {
        rgbComponents = Array.from(data).splice(i, 3);
        alpha = data[i + 3];
        // skip FULLY transparent pixels
        if (alpha === 0)
            continue;
        color = alpha && alpha !== 255
            ? "rgba(" + rgbComponents.concat([alpha]).join(',') + ")"
            : "rgb(" + rgbComponents.join(',') + ")";
        // skip undefined data
        if (rgbComponents.indexOf(undefined) !== -1)
            continue;
        // skip colors in the ignore list
        if (ignore.indexOf(color) !== -1)
            continue;
        countMap[color] = countMap[color]
            ? { color: color, count: countMap[color].count + 1 }
            : { color: color, count: 1 };
    }
    var counts = Object.values(countMap);
    return counts.sort(function (a, b) { return b.count - a.count; });
};
