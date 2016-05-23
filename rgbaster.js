;(function(window, undefined){

  "use strict";

  // Helper functions.
  var getContext = function(){
    return document.createElement("canvas").getContext('2d');
  };

  var getImageData = function(img, loaded){

    var imgObj = new Image();
    var imgSrc = img.src || img;

    // Can't set cross origin to be anonymous for data url's
    // https://github.com/mrdoob/three.js/issues/1305
    if ( imgSrc.substring(0,5) !== 'data:' )
      imgObj.crossOrigin = "Anonymous";

    imgObj.onload = function(){
      var context = getContext();
      context.drawImage(imgObj, 0, 0);

      var imageData = context.getImageData(0, 0, imgObj.width, imgObj.height);
      loaded && loaded(imageData.data);
    };

    imgObj.src = imgSrc;

  };

  var makeRGB = function(name){
    return ['rgb(', name, ')'].join('');
  };

  var mapPalette = function(palette){
    return palette.map(function(c){ return makeRGB(c.name); });
  };


  // RGBaster Object
  // ---------------
  //
  var BLOCKSIZE = 5;
  var PALETTESIZE = 10;

  var RGBaster = {};

  RGBaster.colors = function(img, opts){

    opts = opts || {};
    var exclude = opts.exclude || [ ], // for example, to exclude white and black:  [ '0,0,0', '255,255,255' ]
        paletteSize = opts.paletteSize || PALETTESIZE;

    getImageData(img, function(data){

              var length        = ( img.width * img.height ) || data.length,
                  colorCounts   = {},
                  rgbString     = '',
                  rgb           = [],
                  colors        = {
                    dominant: { name: '', count: 0 },
                    palette:  Array.apply(null, new Array(paletteSize)).map(Boolean).map(function(a){ return { name: '0,0,0', count: 0 }; })
                  };

              // Loop over all pixels, in BLOCKSIZE iterations.
              var i = 0;
              while ( i < length ) {
                rgb[0] = data[i];
                rgb[1] = data[i+1];
                rgb[2] = data[i+2];
                rgbString = rgb.join(",");

                // skip undefined data
                if (rgb.indexOf(undefined) !== -1) {
                  // Increment!
                  i += BLOCKSIZE * 4;
                  continue;
                }

                // Keep track of counts.
                if ( rgbString in colorCounts ) {
                  colorCounts[rgbString] = colorCounts[rgbString] + 1;
                }
                else{
                  colorCounts[rgbString] = 1;
                }

                // Find dominant and palette, ignoring those colors in the exclude list.
                if ( exclude.indexOf( makeRGB(rgbString) ) === -1 ) {
                  var colorCount = colorCounts[rgbString];
                  if ( colorCount > colors.dominant.count ){
                    colors.dominant.name = rgbString;
                    colors.dominant.count = colorCount;
                  } else {
                    colors.palette.some(function(c){
                      if ( colorCount > c.count ) {
                        c.name = rgbString;
                        c.count = colorCount;
                        return true;
                      }
                    });
                  }
                }

                // Increment!
                i += BLOCKSIZE * 4;
              }

              if ( opts.success ) {
                var palette = mapPalette(colors.palette);
                opts.success({
                  dominant: makeRGB(colors.dominant.name),
                  secondary: palette[0],
                  palette:  palette
                });
              }
    });
  };

  window.RGBaster = window.RGBaster || RGBaster;

})(window);
