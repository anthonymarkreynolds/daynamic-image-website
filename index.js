const http = require('http');
const sharp = require('sharp');
const path = require('path');

const PORT = 3000;

http.createServer((req, res) => {
  if (req.url === '/') {
    // If the request is for the root path, send an HTML response with an "Enter Site" button
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<!DOCTYPE html> <html> <head> <title>My Site</title> <meta name="viewport" content="width=device-width, initial-scale=1"> </head> <body> <button onclick="enterSite()">Enter Site</button> <script> function enterSite() { const screenWidth = window.innerWidth; const screenHeight = window.innerHeight; const url = `/enter?width=${screenWidth}&height=${screenHeight}`; window.location.href = url; } </script> </body> </html> ');
  } else if (req.url.startsWith('/enter')) {
    // If the request is for the /image path, get the user's screen width from the query parameters
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const screenWidth = parseInt(urlParams.get('width'));
    const screenHeight = parseInt(urlParams.get('height'));

    if (!Number.isInteger(screenWidth) || screenWidth <= 0) {
      // If the width is invalid, send a 400 Bad Request response
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid width parameter');
      return;
    }
    // Get the current date and time as a formatted string

    // console.log("about to try async...")
    (async () => {
      // console.log("inside async")
      const now = new Date();
      const timestamp = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      + ' ' + now.toLocaleTimeString('en-US', { hour12: false });
      const leftMargin = 16

      const loremPicsumID = Math.ceil(Math.random() * 500)
    // Get a random lorem picsum image
      const loremPicsumUrl = `https://picsum.photos/id/${loremPicsumID}/${Math.min (Math.max(screenWidth, 300), 300) }/200?grayscale`

      try {
        // Define the SVG string with interpolated text
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${screenWidth}" height="${screenHeight}">
    <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a202c" />
      <stop offset="100%" stop-color="#2d3748" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg-gradient)" fill-opacity="0.5"/>
<text x="${leftMargin}px" y="100px" font-family="Arial" font-size="48" fill="white">
  Page Heading
</text>
<g transform="translate(50%, 20%)">
<text x="${leftMargin}px" y="240px" font-family="Arial" font-size="24" fill="white">Image Details</text>
<text x="${leftMargin}px" y="270px" font-family="Arial" font-size="16" fill="white">Width:</text>
<text x="${leftMargin}px" y="290px" font-family="Arial" font-size="16" fill="white">Height:</text>
<text x="${leftMargin}px" y="310px" font-family="Arial" font-size="16" fill="white">Generated:</text>
<text x="${leftMargin}px" y="330px" font-family="Arial" font-size="16" fill="white">picsumID(banner):</text>
<text x="150px" y="270px" font-family="Arial" font-size="16" fill="white">${screenWidth}</text>
<text x="150px" y="290px" font-family="Arial" font-size="16" fill="white">${screenHeight}</text>
<text x="150px" y="310px" font-family="Arial" font-size="16" fill="white">${timestamp}</text>
<text x="150px" y="330px" font-family="Arial" font-size="16" fill="white">${loremPicsumID}</text>
</g>
<text x="${leftMargin}px" y="380px" font-family="Arial" font-size="16" fill="white">
  Welcome to my dynamic image generation
</text>
<text x="${leftMargin}px" y="400px" font-family="Arial" font-size="16" fill="white">
  Website! Here, I'm using Node.js and 
</text>
<text x="${leftMargin}px" y="420px" font-family="Arial" font-size="16" fill="white">
  Sharp, an image processing library, to 
</text>
<text x="${leftMargin}px" y="440px" font-family="Arial" font-size="16" fill="white">
  generate whole-page images on the fly
</text>
<text x="${leftMargin}px" y="460px" font-family="Arial" font-size="16" fill="white">
  based on user requests.
</text>
</svg>`;
    // console.log("awaiting loremPicsum res...")
    const loremPicsumRes = await fetch(loremPicsumUrl)
    console.log(loremPicsumRes)
    const loremPicsumBuf = Buffer.from(await loremPicsumRes.arrayBuffer());
    await sharp({
      create: {
        width: screenWidth,
        height: screenHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .jpeg()
      .composite([
        {
          input: await sharp(loremPicsumBuf).resize(screenWidth, 200).blur(4).toBuffer(),
          gravity: 'north',
          blend: 'over',
          alpha: 0.5
        }, {
          input: Buffer.from(svgString),
          gravity: 'center',
          blend: 'over'
        }])
      .toBuffer()
      .then((data) => {
        // Return the image as a response
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(data);
      })
      // .catch((err) => {
      //   console.error(err);
      //   res.writeHead(500, { 'Content-Type': 'text/plain' });
      //   res.end('Internal Server Error');
      // });
      } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    })()

  } else {
    // If the request is for an unknown path, send a 404 Not Found response
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

