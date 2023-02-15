//DOM objects
let imgdim = document.getElementById("imgdim")
let input = document.getElementById("input")
let canvas = document.getElementById("canvas")

let context = canvas.getContext("2d") //get canvas context (lets us edit canvas)

//top left
x1 = 0
y1 = 0
//bottom right
x2 = 0
y2 = 0

//the image itself!!
let image = new Image()

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
    image.src = url
    image.onload = function(){ //once the image has loaded, paste it onto the canvas
        //update the canvas's size to fit the image
        w = this.width // dimensions of img are stored in Image object
        h = this.height
        canvas.setAttribute("width", w)
        canvas.setAttribute("height", h)

        //also update p element with size
        imgdim.innerText = "(" + w + "x" + h + ")"

        //draw the image
        drawImg(image)

        minimum = findDarkestPixel(context.getImageData(0, 0, w, h).data)
        updateDarkest(minimum)
    }
    
}

function drawImg(i){ //clears the canvas and draws the image
    context.clearRect(0, 0, i.width, i.height)
    context.drawImage(i, 0, 0)
}

//get points where mouse enters and exits the drag
canvas.addEventListener("mousedown", (e)=>{
    x1 = e.offsetX
    y1 = e.offsetY
    console.log(x1 + ", " + y1)

    //clear and redraw image
    drawImg(image)
})

canvas.addEventListener("mouseup", (e)=>{
    x2 = e.offsetX
    y2 = e.offsetY

    console.log(x2 + ", " + y2)

    
    //now draw a box between (x1,y1) to (x2, y2)
    context.beginPath()
    context.rect(x1, y1, x2 - x1, y2 - y1)
    context.strokeStyle = "blue"
    context.stroke()
})

//parses the image data (in a given box) into rgba pixels and finds the darkest one
//by default, it just checks the entire image
function findDarkestPixel(id, xmin = 0, ymin = 0, xmax = image.width, ymax = image.height){ 
    pixels = [] //1 dimensional array of pixel brightnesses

    for (let i = 0; i < id.length; i+= 4){
        r = id[i]
        g = id[i + 1]
        b = id[i + 2]
        avg = (r + g + b)/3

        pixels.push(avg)
    }


    let min = 255 //avg pixel vals are on range from 0-255
    let minrgbvals = [255, 255, 255] //(255, 255, 255) = white (the lightest color)
    for (let i = 0; i < id.length; i+=4){
        if (min > avg){
            min = avg
            minrgbvals = [r,g,b]
        }
    }
    return minrgbvals
}

function updateDarkest(pixel){
    document.getElementById("darkest").innerText = pixel
}