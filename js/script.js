createPad("number-pad", [7,8,9,4,5,6,1,2,3,0,".","+/-"], "30");
createPad("operator-pad",["DEL","CLEAR","*","/","+","-",["=",2]], "45");

const upperScreen = document.getElementById("upper-screen")
const lowerScreen = document.getElementById("lower-screen");
let firstNumber = null, secondNumber = null, operator = "", clear = false;

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

        if(button.textContent === "DEL"){
            button.addEventListener("click", pushedDelete);
        }else if(button.textContent === "CLEAR"){
            button.addEventListener("click", clearScreen);
        }else if(button.textContent === "="){
            button.addEventListener("click", pushedEquals);
        }else if(!isNaN(button.textContent)){
            button.addEventListener("click", pushedNumber);
        }else if(button.textContent === "."){
            button.addEventListener("click", pushedDot);
        }else if(button.textContent === "+/-"){
            button.addEventListener("click", pushedNegate);
        }else{
            button.addEventListener("click", pushedOperator);
        }

        pad.appendChild(button);
    }
}

function pushedNumber(){
    if(lowerScreen.textContent.length < 12){
        if(lowerScreen.textContent === "0" || lowerScreen.textContent === "-0" || clear){
            lowerScreen.textContent = this.textContent;
            clear = false;
        }else{
            lowerScreen.textContent += this.textContent;
        }
    }
}

function pushedOperator(){
    if(!operator){
        upperScreen.textContent = `${lowerScreen.textContent} ${this.textContent} `;
        operator = this.textContent;
        firstNumber = Number(lowerScreen.textContent);
        lowerScreen.textContent = "0";
    }else{
        secondNumber = Number(lowerScreen.textContent);
        firstNumber = operate(firstNumber, operator, secondNumber);
        operator = this.textContent;
        upperScreen.textContent = `${firstNumber} ${operator} `;
        lowerScreen.textContent = firstNumber;
        clear = true;
    }
}

function pushedEquals(){
    if(operator && firstNumber !== null){
        secondNumber = Number(lowerScreen.textContent);
        lowerScreen.textContent = operate(firstNumber, operator, secondNumber);
        upperScreen.textContent += `${secondNumber} = `;
        firstNumber = null, secondNumber = null, operator = "", clear = false; 
    }
}

function pushedDot(){
    if(!lowerScreen.textContent.includes(".")){
        lowerScreen.textContent += ".";
    }
}

function pushedNegate(){
    if(!lowerScreen.textContent.includes("-")){
        lowerScreen.textContent = "-" + lowerScreen.textContent;
    }else{
        lowerScreen.textContent = lowerScreen.textContent.replace("-","");
    }
}

function pushedDelete(){
    lowerScreen.textContent = lowerScreen.textContent.slice(0,-1);
    if(lowerScreen.textContent === ""){
        lowerScreen.textContent = "0";
    }
    clear = false;
}

function clearScreen(){
    upperScreen.textContent = "";
    lowerScreen.textContent = "0";
    firstNumber = null, secondNumber = null, operator = "", clear = false;
}

function operate(num1,operator,num2){
    let result = 0;

    switch(operator){
        case "+": result = Math.round((num1 + num2 + Number.EPSILON) * 100) / 100;
            break; 
        case "-": result = Math.round((num1 - num2 + Number.EPSILON) * 100) / 100;
            break;
        case "*": result = Math.round((num1 * num2 + Number.EPSILON) * 100) / 100;
            break;
        case "/": result = Math.round((num1 / num2 + Number.EPSILON) * 100) / 100;
            break;
    }

    return result;
}