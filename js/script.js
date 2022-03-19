createPad("number-pad", [9,8,7,6,5,4,3,2,1,0], "30");
createPad("operator-pad",["DEL","CLEAR","*","/","+","-","="], "45");

const screen = document.getElementById("calculator-screen");

function createPad(padId, dataForButtons, porcentageLength){
    const pad = document.getElementById(padId);

    for(const data of dataForButtons){
        const button = document.createElement("button");
        button.style.width = porcentageLength + "%";
        button.textContent = data;
        button.addEventListener("click", () =>{
            if(data === "DEL"){
                screen.textContent = screen.textContent.slice(0,-1);
            }else if(data === "CLEAR"){
                clearScreen();
            }else{
                screen.textContent += data;
            }
        });
        pad.appendChild(button);
    }
}

function clearScreen(){
    screen.textContent = "";
}