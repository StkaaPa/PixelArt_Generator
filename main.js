let container = document.querySelector(".container");
let gridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range")
let gridHeight = document.getElementById("height-range")
let colorButton = document.getElementById("color-input")
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");


let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup",
    },
    touch: {
        down: "touchstart",
        move: "touchmove",
        up: "touchend",
    },
};

let deviceType = "";

//Initially draw and erase would be false
let draw = false;
let erase = false;


//Detect touch device
const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};

isTouchDevice();

//Create Grid
gridButton.addEventListener('click', () => {
    //Initially clear the grid (old grids cleared)
    container.innerHTML = "";
    //count variable for generating unique ids
    let count = 0;

    //Loop for creating rows
    for(let i=0; i<gridHeight.value; i++) {
        //Incrementing count by 2
        count += 2;

        //Create row div
        let div = document.createElement("div");
        div.classList.add("gridRow");
        
        //Create Colums
        for(let j = 0; j < gridWidth.value; j++) {
            count += 2;
            let col = document.createElement("div");
            col.classList.add("gridCol");

            //We need unique ids for all columns {for touch screen specifically}
            col.setAttribute("id", `gridCol${count}`);

            col.addEventListener(events[deviceType].down, () => {
                draw = true;
                if(erase) {
                    col.style.backgroundColor = "transparent";
                } else {
                    col.style.backgroundColor = colorButton.value;
                }
            })

            col.addEventListener(events[deviceType].move, (e) => {
                let elementId = document.elementFromPoint(
                    !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                    !isTouchDevice() ? e.clientY : e.touches[0].clientY
                ).id
                checker(elementId);
            })

            //Stop Drawing
            col.addEventListener(events[deviceType].up, () => {
                draw = false;
            })
            //append Columns
            div.appendChild(col);
        }

        //append grid to container
        container.appendChild(div);
    }
});

function checker(elementId){
    let gridColumns = document.querySelectorAll(".gridCol");
    gridColumns.forEach((element) => {
        if(elementId == element.id) {
            if(draw && !erase) {
                element.style.backgroundColor = colorButton.value;
            }else if (draw && erase) {
                element.style.backgroundColor = "transparent"
            }
        }
    });
}

//Clear Grid
clearGridButton.addEventListener("click", () => {
    container.innerHTML = "";
});

//Erase Button
eraseBtn.addEventListener("click", () =>{
    erase = true;
});

//Paint Button
paintBtn.addEventListener("click", () => {
    erase = false;
});

//Display grid with and heigth
gridWidth.addEventListener("input", () => {
    widthValue.innerHTML = gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value;
});

gridHeight.addEventListener("input", () => {
    heightValue.innerHTML = gridHeight.value < 9 ? `0${gridHeight.value}` : gridHeight.value;
});

window.onload = () => {
    gridWidth.value = 0;
    gridHeight.value = 0;
}