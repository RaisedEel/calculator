createPad("number-pad", [9,8,7,6,5,4,3,2,1,0], "30");
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
        button.addEventListener("click", () =>{
            if(button.textContent === "DEL"){
                lowerScreen.textContent = lowerScreen.textContent.slice(0,-1);
                if(lowerScreen.textContent === ""){
                    lowerScreen.textContent = "0";
                }
                clear = false;
            }else if(button.textContent === "CLEAR"){
                clearScreen();
            }else if(button.textContent === "="){
                pushedEquals();
            }else if(!isNaN(button.textContent)){
                pushedNumber(button.textContent);
            }else{
                pushedOperator(button.textContent);
            }
        });
        pad.appendChild(button);
    }
}

function pushedOperator(buttonContent){
    if(!operator){
        upperScreen.textContent = `${lowerScreen.textContent} ${buttonContent} `;
        operator = buttonContent;
        firstNumber = Number(lowerScreen.textContent);
        lowerScreen.textContent = "0";
    }else{
        secondNumber = Number(lowerScreen.textContent);
        firstNumber = operate(firstNumber, operator, secondNumber);
        operator = buttonContent;
        upperScreen.textContent = `${firstNumber} ${operator} `;
        lowerScreen.textContent = firstNumber;
        clear = true;
    }
}

function pushedNumber(buttonContent){
    if(lowerScreen.textContent === "0" || clear){
        lowerScreen.textContent = buttonContent;
        clear = false;
    }else{
        lowerScreen.textContent += buttonContent;
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

function clearScreen(){
    upperScreen.textContent = "";
    lowerScreen.textContent = "0";
    firstNumber = null, secondNumber = null, operator = "", clear = false;
}

function operate(num1,operator,num2){
    let result = 0;

    switch(operator){
        case "+": result = num1 + num2;
            break; 
        case "-": result = num1 - num2;
            break;
        case "*": result = num1 * num2;
            break;
        case "/": result = Math.round((num1 / num2 + Number.EPSILON) * 100) / 100;
            break;
    }

    return result;
}