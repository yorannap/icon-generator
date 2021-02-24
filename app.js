// variables
let body = document.querySelector('body');
let fileType = 'png';
let zipName = 'icons';
let zipFolderName = zipName;
let initialised = false;
let imageQuality = 3;
let svgBorder;
let customBorderColourSet = false;
let LinkCount;
let svgList;
let svgFilenames = [];
let iconsInjected;
let iconsFetched;

let iconGrid = document.querySelector('#icon-grid');
let downloadButton = document.querySelector('#options-download');

// fetch svg count and titles
iconsFetched = new Promise(function(resolve) {
    body.style.display = 'none';
    fetch('/files/icons')
      .then(response => response.text())
      .then(text => {
        let parser = new DOMParser();
        let htmlDocument = parser.parseFromString(text, "text/html");
        let LinkListArr = Array.from(htmlDocument.documentElement.querySelectorAll("li a"));
        LinkListArr.splice(0, 1);
        LinkCount = LinkListArr.length;
        // loop through links and push titles to array
        LinkListArr.forEach((link, index) => {
          let title = link.getAttribute('title');
          svgFilenames.push(title);
          if (index === LinkCount - 1) {
            setTimeout(() => {
              resolve();
            }, 100);
          }
        });
      });
});

iconsInjected = new Promise(function(resolve) {
  iconsFetched.then(function() {
      svgFilenames.forEach((file, index) => {
        fetch(`/files/icons/${file}`)
          .then(response => response.text())
          .then(text => {
            let div = document.createElement('div');
            div.setAttribute('class','icon-container');
            div.id = file.replace(".svg","");
            div.innerHTML = text;
            iconGrid.appendChild(div);
          });
        if(index === LinkCount -1) {
          setTimeout(() => {
            resolve();
          }, 100);
        }
      });
    });
  });

iconsInjected.then(function() { // launch app
  body.style.display = 'block';
  // selectors colour
  let colorSecondary = document.querySelector('#secondary-color');
  let colorSecondaryValue = document.querySelector('#secondary-value');
  let colorPrimary = document.querySelector('#primary-color');
  let colorPrimaryValue = document.querySelector('#primary-value');
  // selectors stroke
  let strokeWidth = document.querySelector('#stroke-width');
  let strokeTypes = Array.from(document.getElementsByName('stroke-type'));
  // selectors border
  let borderStyle = document.querySelector('#border-style');
  let borderRadius = document.querySelector('#border-radius');
  let borderColour = document.querySelector('#border-color');
  let borderColourValue = document.querySelector('#border-color-value');
  let borderOpaque = document.querySelector('#border-opaque');
  // selectors other
  let svgIcons = Array.from(document.querySelectorAll('#icon-grid svg'));

  let svgPrimary = Array.from(document.querySelectorAll('svg .cls-1'));
  let svgSecondary = Array.from(document.querySelectorAll('svg .cls-2'));
  let svgTertiary = Array.from(document.querySelectorAll('svg .cls-3'));
  let svgPaths = [...svgPrimary, ...svgSecondary];


  // listen to download button click
  downloadButton.addEventListener('click', downloadIcons);
  // listen to color value change
  colorPrimary.addEventListener('input', updateColor);
  colorSecondary.addEventListener('input', updateColor);
  // listen to stroke width slider
  strokeWidth.addEventListener('input', updateStroke);
  // listen for custom colour input value
  colorPrimaryValue.addEventListener('input', updateColorValue);
  colorSecondaryValue.addEventListener('input', updateColorValue);
  // listen to stroke type change
  strokeTypes.forEach(type => {
    type.addEventListener('input', updateStroke);
  });
  // listen to border style input
  borderStyle.addEventListener('input', updateBorders);
  // listen to border radius input
  borderRadius.addEventListener('input', updateBorders);
  // listen to border colour value
  borderColour.addEventListener('input', updateBorders);
  // listen to border hex colour value
  borderColourValue.addEventListener('input', updateBorderColorValue);
  // listen to custom border colour being set
  borderColour.addEventListener('click', () => customBorderColourSet = true);
  borderColourValue.addEventListener('click', () => customBorderColourSet = true);
  // listen to border opaque
  borderOpaque.addEventListener('input', updateBorders);

  // initialise and set defaults
  function init() {
    colorPrimaryValue.value = '#008cb4';
    colorSecondaryValue.value = '#17aacc';
    borderColourValue.value = colorPrimaryValue.value;
    strokeWidth.value = '8';
    updateStroke();
    updateColorValue();
    createBorders();
  }
  init();
  // create borders
  function createBorders() {
    svgIcons.forEach(svg => {
      newBorder = document.createElementNS('http://www.w3.org/2000/svg','rect');
      newBorder.setAttribute('width','450');
      newBorder.setAttribute('height','450');
      newBorder.setAttribute('x','25');
      newBorder.setAttribute('y','25');
      newBorder.setAttribute('class','svg-border');
      svg.insertBefore(newBorder, svg.firstChild);
      updateBorderColorValue();
    });   
  }

  // update borders for icons
  function updateBorders(text) {
    if (text !== 'no') { // don't sync input values for custom hex
      borderColourValue.value = borderColour.value;
    }
    if(borderOpaque.checked) {
      opacity = 0.1; // set opaque opacity
    }
    else {
      opacity = 1.0;
    }
      svgIcons.forEach(svg => {
        svgBorder = svg.firstChild;
        if (borderStyle.value === 'outline') {
          svgBorder.setAttribute('fill', 'transparent');
          svgBorder.setAttribute('stroke', borderColour.value);
          svgBorder.setAttribute('stroke-opacity', opacity);
          svgBorder.setAttribute('stroke-width', strokeWidth.value);
          
        }
        else if (borderStyle.value === 'fill') {
          svgBorder.setAttribute('fill', borderColour.value);
          svgBorder.setAttribute('fill-opacity', opacity);
          svgBorder.setAttribute('stroke-width', '0');
          
        }
        else if (borderStyle.value === 'none') {
          svgBorder.setAttribute('stroke-width', '0');
          svgBorder.setAttribute('fill', 'transparent');
        }
        svgBorder.setAttribute('rx', borderRadius.value);
      });
  }

  // update border colour hex value
  function updateBorderColorValue() {
    if (customBorderColourSet) {
      borderColour.value = borderColourValue.value;
      updateBorders('no');
    }
    else {
      borderColour.value = colorPrimary.value;
      updateBorders();
    }
  }

  // update colour value
  function updateColorValue() {
    colorPrimary.value = colorPrimaryValue.value;
    colorSecondary.value = colorSecondaryValue.value;
    updateColor('no');
  }

  // update colour when input changed
  function updateColor(text) {
    if (text !== 'no') { // don't sync input values for custom hex
      colorSecondaryValue.value = colorSecondary.value;
      colorPrimaryValue.value = colorPrimary.value;
    }
    svgTertiary.forEach(path => {
      path.style.fill = colorPrimary.value;
    });
    svgPrimary.forEach(path => {
      path.style.stroke = colorPrimary.value;
    });
    svgSecondary.forEach(path => {
      path.style.stroke = colorSecondary.value;
    });
    updateBorders();
    updateBorderColorValue();
  };

  // update stroke when input changed
  function updateStroke() {
    let strokeType = 'round';
    // find selected stroke type
    strokeTypes.forEach(type => {
      if (type.checked) {
        strokeType = type.value;
      }
    });
    // update each path
    svgPaths.forEach(path => {
      path.style.strokeWidth = strokeWidth.value;
      path.style.strokeLinecap = strokeType;
    });
    updateBorders();
  }

  // declare zip file structure
  let jsZip = new JSZip();
  let folder = jsZip.folder(zipName);

  // download icons
  function downloadIcons(e) {
      e.preventDefault;
      downloadButton.innerHTML = 'Packaging...';
      // select icon elements
      let icons = Array.from(document.querySelectorAll('.icon-container'));
      // wait time before download initiates - milliseconds
      let downloadDelay = 100;
      // return promise once loop is complete
      let zipComplete = new Promise(resolve => {
        // loop through each svg
        icons.forEach((div, index) => {
          icon = div.firstChild;
          // set variables
          let iconWidth = icon.getBoundingClientRect().width * imageQuality;
          let iconHeight = icon.getBoundingClientRect().height * imageQuality;
          let outerHTML = icon.outerHTML;
          let blob = new Blob([outerHTML], { type: 'image/svg+xml' });
          let blobURL = URL.createObjectURL(blob);
          let canvasUrl;
          let image = document.createElement('img');
          image.src = blobURL;
          
          // set image blob url
          image.addEventListener('load', () => URL.revokeObjectURL(blobURL), { once: true });
          // create canvas for each icon, choose file type and add to zip
          image.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = iconWidth;
            canvas.height = iconHeight;
            let context = canvas.getContext('2d');
            // draw image in canvas 
            context.drawImage(image, 0, 0, iconWidth, iconHeight);
            // find file type and assign canvas data url
            if (fileType === 'jpeg') { // jpeg
              canvasUrl = canvas.toDataURL('image/jpg');
            }
            else { // png
              canvasUrl = canvas.toDataURL(); 
            } 
            // convert canvas to binary
            let baseString = getBase64String(canvasUrl);
            // function to get binary string from canvas url
            function getBase64String(dataURL) {
              var idx = dataURL.indexOf('base64,') + 'base64,'.length;
              return dataURL.substring(idx);
            }
            // append image to zip download
            folder.file(`${div.id}.${fileType}`, baseString, { base64: true });
          }
          // check if loop is complete and add download delay for ux
          if (index + 1 === icons.length) {
            setTimeout(() => { resolve(); }, downloadDelay);
          }
        });
      });
    // download zip
    zipComplete.then(() => {
        // initialise zip
        jsZip.generateAsync({ type: "blob" }).then(function (content) {
          content = URL.createObjectURL(content);
          let name = zipName;
          downloadZip(content, name);
        }); 
        // auto download
        function downloadZip(href, name) {
          var link = document.createElement('a');
          link.download = name;
          link.style.opacity = "0";
          link.href = href;
          link.click();
          link.remove();
          downloadButton.innerHTML = 'Done!';
          setTimeout(() => {
            downloadButton.innerHTML = 'Download';
          }, 2000);
        }
        
      }
    );
  }
});