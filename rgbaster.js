;(function(window, undefined){

  // Helper functions.
  var getContext = function(){
    return document.createElement("canvas").getContext('2d');
  };

  var getImageData = function(img){
    var imgObj = new Image();
    imgObj.src = img.src

    var context = getContext()
    context.drawImage(img, 0, 0);

    var imageData = context.getImageData(0, 0, img.width, img.height);
    return imageData.data;
  };

  var makeRGB = function(name){
    return ['rgb(', name, ')'].join('');
  };

  var mapPalette = function(palette){
    return palette.map(function(c){ return makeRGB(c.name) })
  }

  /**
  *     RGBaster Object
  *     
  *     @method colors     
  *
  */
  var BLOCKSIZE = 5; 
  var PALETTESIZE = 10; 

  var RGBaster = {};

  RGBaster.colors = function(img){
    var data      = getImageData(img),
        length    = data.length,
        count     = 0,
        i         = -(BLOCKSIZE-1);

    var colorCounts   = {},
        rgbString     = '',
        rgb           = [],
        colors        = { 
          dominant: { name: '', count: 0 },
          palette:  Array.apply(null, Array(PALETTESIZE)).map(Boolean).map(function(a){ return { name: '0,0,0', count: 0 } }) 
        };

    // Loop over all pixels, in BLOCKSIZE iterations.
    while ( (i += BLOCKSIZE * 4) < length ) {
      ++count;
      rgb[0] = data[i];
      rgb[1] = data[i+1];
      rgb[2] = data[i+2];
      rgbString = rgb.join(",");

      // Keep track of counts.
      if ( rgbString in colorCounts ) {
        colorCounts[rgbString] = colorCounts[rgbString] + 1; 
      } 
      else{
        colorCounts[rgbString] = 1;
      }

      // Find dominant and palette, ignoring black pixels.
      if ( rgbString !== "0,0,0" ) {
        var colorCount = colorCounts[rgbString]
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

    }

    return {
      dominant: makeRGB(colors.dominant.name),
      palette:  mapPalette(colors.palette)
    };
  }

  window.RGBaster = window.RGBaster || RGBaster;

})(window);