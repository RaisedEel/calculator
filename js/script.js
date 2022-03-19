createPad("number-pad", [9,8,7,6,5,4,3,2,1,0], "30");
createPad("operator-pad",["DEL","CLEAR","*","/","+","-",["=",2]], "45");

const screen = document.getElementById("calculator-screen");

function createPad(padId, dataForButtons, porcentageLength){
    const pad = document.getElementById(padId);

    for(const data of dataForButtons){
        const button = document.createElement("button");
        if(Array.isArray(data)){
            button.style.width = porcentageLength * data[1] + "%";
            button.textContent = data[0];
        }else{
            button.style.width = porcentageLength + "%";
            button.textContent = data;
        }
        button.addEventListener("click", () =>{
            if(button.textContent === "DEL"){
                screen.textContent = screen.textContent.slice(0,-1);
            }else if(button.textContent === "CLEAR"){
                clearScreen();
            }else{
                screen.textContent += button.textContent;
            }
        });
        pad.appendChild(button);
    }
}

function clearScreen(){
    screen.textContent = "";
}