/**
 * HSV to RGB color conversion from http://snipplr.com/view/14590/hsv-to-rgb/
 *
 * H runs from 0 to 360 degrees
 * S and V run from 0 to 100
 *
 * Ported from the excellent java algorithm by Eugene Vishnevsky at:
 * http://www.cs.rit.edu/~ncs/color/t_convert.html
 *
 * @param {number} h
 * @param {number} s
 * @param {number} v
 * @return {number} int representation
 */
function hsvToRgb(h, s, v) {
  var r; // Red
  var g; // Green
  var b; // Blue
  var i;
  var f;
  var p;
  var q;
  var t;

  // Make sure our arguments stay in-range
  h = Math.max(0, Math.min(360, h));
  s = Math.max(0, Math.min(100, s));
  v = Math.max(0, Math.min(100, v));

  // We accept saturation and value arguments from 0 to 100 because that's
  // how Photoshop represents those values. Internally, however, the
  // saturation and value are calculated from a range of 0 to 1. We make
  // That conversion here.
  s /= 100;
  v /= 100;

  if (s === 0) {
    // Achromatic (grey)
    r = g = b = v;
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  h /= 60; // sector 0 to 5
  i = Math.floor(h);
  f = h - i; // factorial part of h
  p = v * (1 - s);
  q = v * (1 - s * f);
  t = v * (1 - s * (1 - f));

  switch (i) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;

    case 1:
      r = q;
      g = v;
      b = p;
      break;

    case 2:
      r = p;
      g = v;
      b = t;
      break;

    case 3:
      r = p;
      g = q;
      b = v;
      break;

    case 4:
      r = t;
      g = p;
      b = v;
      break;

    default: // case 5:
      r = v;
      g = p;
      b = q;
  }

  return ColorUtils.rgbToHex(Math.floor(r * 255), Math.floor(g * 255),
                             Math.floor(b * 255));
}
var ColorUtils = {
  // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  componentToHex: function(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  },
  rgbToHex: function(r, g, b) {
    return ColorUtils.componentToHex(r) + ColorUtils.componentToHex(g) +
           ColorUtils.componentToHex(b);
  },
  // http://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
  randomPastel: function() {
    var mix = [255, 255, 255];
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);

    // mix the color
    red = Math.floor((red + 3 * mix[0]) / 4);
    green = Math.floor((green + 3 * mix[1]) / 4);
    blue = Math.floor((blue + 3 * mix[2]) / 4);

    return parseInt(ColorUtils.rgbToHex(red, green, blue), 16);
  },
  fromHue: function(hue) {
    return parseInt(hsvToRgb(hue, 100, 50), 16);
  }
};
