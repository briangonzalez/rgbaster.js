function onload(){
  var img = document.getElementById('image');
  var colors = RGBaster.colors(img, {
    paletteSize: 30,
    success: function(colors){
      img.style.borderColor = colors.palette[0];

      var makeDivWithClassAndBGColor = function(klass, color){
        var div = document.createElement("div");
        div.className = klass;
        div.style.backgroundColor = color;
        return div;
      };

      console.log("-----------------------------------------------");
      console.log("rgbaster.js");
      console.log("-----------------------------------------------");
      console.log("Dominant color:", colors.dominant);
      console.log("Secondary color:", colors.secondary);
      console.log("Palette length:", colors.palette.length);
      console.log("-----------------------------------------------");

      var palette = document.getElementById('palette');
      palette.appendChild( makeDivWithClassAndBGColor('color', colors.dominant) );

      colors.palette.forEach(function(color){
        palette.appendChild( makeDivWithClassAndBGColor('color', color) );
      });
    }
  });
}
