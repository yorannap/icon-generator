// selectors
const colorPrimary = document.querySelector('#primary-color');
const iconGrid = document.querySelector('#icon-grid');
const iconsG = document.querySelectorAll('.icon-container svg g');
const downloadButton = document.querySelector('button');


// event listeners
downloadButton.addEventListener('click', downloadIcons);

// download svgs
function downloadIcons() {
    let icons = document.querySelector('.icon-container svg');
    let iconWidth = icons.getBoundingClientRect().width;
    let iconHeight = icons.getBoundingClientRect().height;
    
    let outerHTML = icons.outerHTML;
    let blob = new Blob([outerHTML],{type:'image/svg+xml'});
    let blobURL = URL.createObjectURL(blob);
    let image = document.createElement('img');

    // canvas
    image.addEventListener('load', () => URL.revokeObjectURL(blobURL), {once: true});
    image.src = blobURL;

    image.onload = () => {
      let canvas = document.createElement('canvas');

      canvas.width = iconWidth;
      canvas.height = iconHeight;

      let context = canvas.getContext('2d');
      // draw image in canvas starting left-0 , top - 0  
      context.drawImage(image, 0, 0, iconWidth, iconHeight );
      //  downloadImage(canvas); need to implement
      let png = canvas.toDataURL();
      let jpeg = canvas.toDataURL('image/jpg');
      let webp = canvas.toDataURL('image/webp');


      //zip 
      function getBase64String(dataURL) {
        var idx = dataURL.indexOf('base64,') + 'base64,'.length;
        return dataURL.substring(idx);
     }

      let jsZip = new JSZip();
      let folder = jsZip.folder("images");
      let baseString = getBase64String(png);
      folder.file("image1.png", baseString, {base64 : true});
      let baseString2 = getBase64String(webp);
      folder.file("image2.webp", baseString2, {base64 : true});
      jsZip.generateAsync({type:"blob"}).then(function (content) {
        content = URL.createObjectURL(content);
        let name = `JSJeep.zip`;
        download(content, name); // already written above
      });


      var download = function(href, name){
        var link = document.createElement('a');
        link.download = name;
        link.style.opacity = "1";
        link.href = href;
        link.click();
        link.remove();
      }
      // download(png, "image.png");
    }
}




  




// listen to color value change
colorPrimary.addEventListener('input', updateColor);

// update color when value changed
function updateColor() {
  const iconsArr = Array.from(iconsG);
  iconsArr.forEach(icon => {
    icon.setAttribute('fill', colorPrimary.value);
  });
};





