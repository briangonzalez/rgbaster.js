(function rgbasterWrapper(window) {
  'use strict';

  // Helper functions.
  const getContext = function getContext(width, height) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    return canvas.getContext('2d');
  };

  const getImageData = function getImageData(img, loaded) {
    const imgObj = new Image();
    const imgSrc = img.src || img;

    // Can't set cross origin to be anonymous for data url's
    // https://github.com/mrdoob/three.js/issues/1305
    if (imgSrc.substring(0, 5) !== 'data:') {
      imgObj.crossOrigin = 'Anonymous';
    }

    imgObj.onload = function onload() {
      const context = getContext(imgObj.width, imgObj.height);
      context.drawImage(imgObj, 0, 0);

      const imageData = context.getImageData(0, 0, imgObj.width, imgObj.height);
      if (loaded) {
        loaded(imageData.data);
      }
    };

    imgObj.src = imgSrc;
  };
  function makeRGB(name) {
    return ['rgb(', name, ')'].join('');
  }

  function frmtPobj(a, b) {
    return { name: makeRGB(a), count: b };
  }

  function mapPalette(palette) {
    const arr = [];
    for (const prop in palette) {
      if (palette.hasOwnProperty(prop)) {
        arr.push(frmtPobj(prop, palette[prop]));
      }
    }

    arr.sort((a, b) => b.count - a.count);
    return arr;
  }

  function fitPalette(arr, fitSize) {
    if (arr.length > fitSize) {
      return arr.slice(0, fitSize);
    }
    for (let i = arr.length - 1; i < fitSize - 1; i += 1) {
      arr.push(frmtPobj('0,0,0', 0));
    }
    return arr;
  }

  // RGBaster Object
  // ---------------
  //
  const PALETTESIZE = 10;

  const RGBaster = {};

  RGBaster.colors = function colors(img, userOptions) {
    const opts = userOptions || {};
    // for example, to exclude white and black:  [ '0,0,0', '255,255,255' ]
    const exclude = opts.exclude || [];
    const paletteSize = opts.paletteSize || PALETTESIZE;

    getImageData(img, (data) => {
      const colorCounts = {};
      let rgbString = '';
      const rgb = [];

      for (let i = 0; i < data.length; i += 4) {
        rgb[0] = data[i];
        rgb[1] = data[i + 1];
        rgb[2] = data[i + 2];
        rgbString = rgb.join(',');
        // skip undefined data and transparent pixels
        if (rgb.indexOf(undefined) !== -1 || data[i + 3] === 0) {
          continue;
        }

        // Ignore those colors in the exclude list.
        if (exclude.indexOf(makeRGB(rgbString)) === -1) {
          if (rgbString in colorCounts) {
            colorCounts[rgbString] += 1;
          } else {
            colorCounts[rgbString] = 1;
          }
        }
      }

      if (opts.success) {
        const palette = fitPalette(mapPalette(colorCounts), paletteSize + 1);
        opts.success({
          dominant: palette[0].name,
          secondary: palette[1].name,
          palette: palette.map(c => c.name).slice(1),
        });
      }
    });
  };

  window.RGBaster = window.RGBaster || RGBaster;
}(window));
