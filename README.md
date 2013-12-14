# <img src="https://rawgithub.com/briangonzalez/rgbaster.js/master/demo/baster.svg" width=25 style="margin-right: 10px"> RGBaster

A dead simple javascript library for extracting the dominant color from an image.

### Usage

Usage is simple. Create an image, then get its dominant color & palette.

```javascript
var img = document.getElementById('image');
var colors = RGBaster.colors(img, function(payload){
  // You now have the payload.
});
```

Author
-------
| ![twitter/brianmgonzalez](http://gravatar.com/avatar/f6363fe1d9aadb1c3f07ba7867f0e854?s=70](http://twitter.com/brianmgonzalez "Follow @brianmgonzalez on Twitter") |
|---|
| [Brian Gonzalez](http://briangonzalez.org) |