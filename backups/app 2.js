// selectors
const colorPrimary = document.querySelector('#primary-color');
const iconGrid = document.querySelector('#icon-grid');
const iconsG = document.querySelectorAll('.icon-container svg g');
const icons = document.querySelector('.icon-container svg');




var text = icons.outerHTML;
text.wrap = 'off';
let svg = null;

var div = document.getElementById('d');
div.innerHTML= text.value;
svg = icons;
console.log(svg);

document.getElementById('l').addEventListener('click', function () {
  var canvas = document.getElementById('c');
  svg.setAttribute('width', 500);
  svg.setAttribute('height', 500);
  canvas.width = svg.width;
  canvas.height = svg.height;
  var data = new XMLSerializer().serializeToString(svg);
  var win = window.URL || window.webkitURL || window;
  var img = new Image();
  var blob = new Blob([data], { type: 'image/svg+xml' });
  var url = win.createObjectURL(blob);
  img.onload = function () {
    canvas.getContext('2d').drawImage(img, 0, 0);
    win.revokeObjectURL(url);
    var uri = canvas.toDataURL('image/png').replace('image/png', 'octet/stream');
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = uri
    a.download = (svg.id || svg.svg.getAttribute('name') || svg.getAttribute('aria-label') || 'untitled') + '.png';
    a.click();
    window.URL.revokeObjectURL(uri);
    document.body.removeChild(a);
  };
  img.src = url;
});
  




// listen to color value change
colorPrimary.addEventListener('input', updateColor);

// update color when value changed
function updateColor() {
  const iconsArr = Array.from(iconsG);
  iconsArr.forEach(icon => {
    icon.setAttribute('fill', colorPrimary.value);
  });
};





