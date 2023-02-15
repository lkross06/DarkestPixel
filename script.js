//DOM objects
let input = document.getElementById("input")
let canvas = document.getElementById("canvas")
let context = canvas.getContext("2d") //get canvas context (lets us edit canvas)

let numPoints = 2 //amount of points left to put onto the canvas

function readURL(input) {
    if (input.files && input.files[0]) { // if the files exist
      var reader = new FileReader()
      //read the file contents, copy the image url to the <img> element
      reader.onload = function (e) {
        updateCanvas(e.target.result)
      };
      // read the contents of the Blob (in this case the input URL)
      reader.readAsDataURL(input.files[0])
    }
  }

function updateCanvas(url) { //adds the image to the canvas
    console.log("update canvas")
    let image = new Image()
    image.src = url
    image.onload = function(){ //once the image has loaded, paste it onto the canvas
        context.drawImage(image, 0, 0)
        //update the canvas's size to fit the image
        w = this.width // dimensions of img are stored in Image object
        h = this.height
        canvas.setAttribute("width", w)
        canvas.setAttribute("height", h)

        //draw the image
        context.drawImage(image, 0, 0)

        minimum = findDarkestPixel(context.getImageData(0, 0, w, h).data)
        updateDarkest(minimum)
    }
    
}

function findDarkestPixel(id){ //parses the image data into rgba pixels and finds the darkest one
    let min = 255 //avg pixel vals are on range from 0-255
    let minrgbvals = [255, 255, 255] //(255, 255, 255) = white (the lightest color)
    for (let i = 0; i < id.length; i+=4){
        r = id[i]
        g = id[i + 1]
        b = id[i + 2]
        avg = (r + g + b)/3
        
        if (min > avg){
            min = avg
            minrgbvals = [r,g,b]
        }
    }
    return minrgbvals
}

function updateDarkest(pixel){
    console.log(pixel)
    document.getElementById("darkest").innerText = pixel
}