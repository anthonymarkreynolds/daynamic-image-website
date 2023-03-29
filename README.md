# Single Image Site
This is a simple Node.js web app that generates a single image that seamlessly fits the viewport.
## Live Demo
You can see a live demo of this app at https://limitless-ocean-66544.herokuapp.com/
## Inspiration
The inspiration for this project came from a brochure website that I saw, which used a series of static images to display information. I started thinking about how I could take that concept further by making the images dynamically generated.

By using the Sharp image processing library and an SVG template, I was able to create a single image that seamlessly fits the viewport, with details such as image width, height, and time generated displayed in a table. I also added an "Enter" button on a landing page that sends a request with the current viewport width and height.

## Image Composition
The image includes multiple layers, including a background gradient, a site heading, and a table with image details. I'm using SVG markup to create these layers and composite them together using Sharp's composite function.

In addition to creating dynamic images, I'm also using fetch to randomly download a placeholder image from Lorem Picsum, and adding it to the generated image using Sharp's composite function.

All of this is done in real-time based on user requests

## Performance
Because the images are generated dynamically using the Sharp image processing library, response times may be slower than for a typical static website. Depending on the size of the image and the server load, it may take several seconds for the image to be generated and displayed in the browser.

It's recommended that users be patient and avoid refreshing the page while the image is being generated. If you experience long wait times or other issues with the app, please let me know and I will do my best to address them.

Response times may take several seconds due
## Notes
I hope that this project demonstrates how a simple concept can be expanded upon with a little bit of creativity and technical know-how.