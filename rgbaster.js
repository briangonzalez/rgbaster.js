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

  /**
  *     RGBaster Object
  *     
  *     @method colors     
  *
  */
  var BLOCKSIZE = 5; 

  var RGBaster = {};

  RGBaster.colors = function(img){
    var data      = getImageData(img),
        length    = data.length,
        count     = 0,
        i         = -(BLOCKSIZE-1);

    var colorCounts   = {},
        rgbString     = '',
        rgb           = [],
        dominant      = { name: '', count: 0 };

    // Loop over all pixels.
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

      // Find maximum, ignoring black pixels.
      if ( colorCounts[rgbString] > dominant['count'] && rgbString !== "0,0,0" ) {
        dominant['name']  = rgbString;
        dominant['count'] = colorCounts[rgbString];
      }
    }

    return {
      dominant: makeRGB(dominant['name'])
    };
  }

  window.RGBaster = window.RGBaster || RGBaster;

})(window);