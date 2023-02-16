//DOM objects
let imgdim = document.getElementById("imgdim")
let input = document.getElementById("input")
let canvas = document.getElementById("canvas")
let context = canvas.getContext("2d") //get canvas context (lets us edit canvas)

let hold = false //tracks if mouse button is held or not

//top left
x1 = 0
y1 = 0
//bottom right
x2 = 0
y2 = 0

//the image itself!!
let image = new Image()

class Pixel{
    constructor(r, g, b, x = null, y = null){
        //colors
        this.r = r
        this.g = g
        this.b = b
        this.avg = (r + g + b)/3

        //position (only important if we need to show it)
        this.x = x
        this.y = y
    }

    toString(){
        return "(" + this.r + ", " + this.g + ", " + this.b + ")"
    }
}

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
    hold = true

    //clear and redraw image
    drawImg(image)
})

canvas.addEventListener("mouseup", (e)=>{
    x2 = e.offsetX
    y2 = e.offsetY
    hold = false

    //check to make sure (x1,y1) is top-left and (x2,y2) is bottom-right
    //check if point 1 is top-right, point 2 is bottom-left
    if (x1 > x2){
        //swap x vals
        let temp = x1
        x1 = x2
        x2 = temp
    }
    //check if point 1 is bottom-left, point 2 is top-right
    if (y1 > y2){
        //swap y vals
        let temp = y1
        y1 = y2
        y2 = temp
    }

    //now draw a box between (x1,y1) to (x2, y2)
    drawBox(x1, y1, x2, y2)

    //find the darkest pixel again
    let darkest = findDarkestPixel(context.getImageData(0, 0, w, h).data, x1, y1, x2, y2)
    updateDarkest(darkest)  
})

function drawBox(xmin, ymin, xmax, ymax, color = "blue"){
    context.beginPath()
    //create a 1px border, so that none of the pixels in the selection are part of the box
    context.rect(xmin - 1, ymin - 1, xmax - xmin + 2, ymax - ymin + 2)
    context.strokeStyle = color
    context.stroke()
}

//parses the image data (in a given box) into rgba pixels and finds the darkest one
//by default, it just checks the entire image
function findDarkestPixel(id, xmin = 0, ymin = 0, xmax = image.width, ymax = image.height){
    pixels = [] //1 dimensional array of pixels

    for (let i = 0; i < id.length; i+= 4){
        r = id[i]
        g = id[i + 1]
        b = id[i + 2]

        pixels.push(new Pixel(r, g, b))
    }

    pixels2d = [] //2 dimensional array of pixels
    index = 0 //allows us to access correctly from 1d array
    for (let i = 0; i < image.height; i++){ //rows
        row = []
        for (let j = 0; j < image.width; j++){ //columns
            row.push(pixels[index])
            index++
        }
        pixels2d.push(row)
    }

    let min = new Pixel(255, 255, 255) //avg pixel vals are on range from 0-255, maximum is (255, 255, 255)
    for (let i = ymin; i < ymax; i++){ //rows
        for (let j = xmin; j < xmax; j++){ //cols
            if (pixels2d[i][j].avg < min.avg){
                min = pixels2d[i][j]
                min.x = j
                min.y = i
            }
        }
    }
    return min
}

function updateDarkest(pixel){ //takes a Pixel object
    document.getElementById("darkest").innerText = pixel.toString()
    alert(pixel.toString())

    //draw box around the pixel
    drawBox(pixel.x, pixel.y, pixel.x, pixel.y, "green")
}