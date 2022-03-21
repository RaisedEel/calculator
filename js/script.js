createPad("number-pad", [7,8,9,4,5,6,1,2,3,0,".","+/-"], "31"); // Num Pad
createPad("operator-pad",["DEL","CLEAR","*","/","+","-",["=",2]], "48"); // Operator Pad

const upperScreen = document.getElementById("upper-screen")
const lowerScreen = document.getElementById("lower-screen");
// The numbers and operator variables store the elements for the operation. Clear just
// helps to clean after making multiple operations
let firstNumber = null, secondNumber = null, operator = "", clear = false;

// Function to create the operator and num pads. It accepts the id of the container where the
// buttons should be created, the data of the buttons in the way of a array and finally a
// porcentage to calculate the size of each button
function createPad(padId, dataForButtons, porcentageLength){
    const pad = document.getElementById(padId);

    for(const data of dataForButtons){
        const button = document.createElement("button");
        
        // If the array has another array as one of its elements, the second element
        // makes bigger or smaller the size of the button
        if(Array.isArray(data)){
            button.style.width = porcentageLength * data[1] + "%";
            button.textContent = data[0];
            button.id = data[0]; // ID just for support for the keyboard
        }else{
            button.style.width = porcentageLength + "%";
            button.textContent = data;
            button.id = data;
        }

        // Depending the content of the button we asign one specific listener and style
        if(button.textContent === "DEL"){ 
            button.addEventListener("click", pushedDelete); // Backspace
            button.style.backgroundColor = "crimson";
            button.style.color = "white";
        }else if(button.textContent === "CLEAR"){
            button.addEventListener("click", clearScreen); // Clear Button
            button.style.backgroundColor = "crimson";
            button.style.color = "white";
        }else if(button.textContent === "="){
            button.addEventListener("click", pushedEquals); // Equal
            button.style.backgroundColor = "royalblue";
            button.style.color = "white";
        }else if(!isNaN(button.textContent)){
            button.addEventListener("click", pushedNumber); // Numbers
        }else if(button.textContent === "."){
            button.addEventListener("click", pushedDot); // Dot for decimal numbers
            button.style.backgroundColor = "lightgray";
        }else if(button.textContent === "+/-"){
            button.addEventListener("click", pushedNegate); // Negate the number
            button.style.backgroundColor = "lightgray";
        }else{
            button.addEventListener("click", pushedOperator); // Operators (+,-,*,/)
            button.style.backgroundColor = "royalblue";
            button.style.color = "white";
        }

        pad.appendChild(button);
    }
}

function pushedNumber(){
    if(lowerScreen.textContent.length < 12){
        // Change the 0 with the first number pushed
        if(lowerScreen.textContent === "0" || clear){
            lowerScreen.textContent = this.textContent;
            clear = false;
        }else if(lowerScreen.textContent === "-0" ){
            lowerScreen.textContent = "-" + this.textContent;
        }else{
            lowerScreen.textContent += this.textContent;
        }
    }
}

function pushedOperator(){
    if(!lowerScreen.textContent.includes("ERROR")){
        if(!operator){
            // Case when the operator is just used once
            upperScreen.textContent = `${lowerScreen.textContent} ${this.textContent} `;
            operator = this.textContent;
            firstNumber = Number(lowerScreen.textContent);
            lowerScreen.textContent = "0";
        }else{
            // Case when you chain multiple operators (Calculate the result of the past 
            // operation and store it for use in the next) 
            secondNumber = Number(lowerScreen.textContent);
            firstNumber = operate(firstNumber, operator, secondNumber);
            operator = this.textContent;
            upperScreen.textContent = `${firstNumber} ${operator} `;
            lowerScreen.textContent = firstNumber;
            clear = true;
        }
    }
}

function pushedEquals(){
    if(operator && firstNumber !== null && !lowerScreen.textContent.includes("ERROR")){
        secondNumber = Number(lowerScreen.textContent);
        lowerScreen.textContent = operate(firstNumber, operator, secondNumber);
        upperScreen.textContent += `${secondNumber} = `;
        firstNumber = null, secondNumber = null, operator = "", clear = false; // Clear variables for the next time
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
    if(!lowerScreen.textContent.includes("ERROR")){
        lowerScreen.textContent = lowerScreen.textContent.slice(0,-1);
        if(lowerScreen.textContent === ""){
            lowerScreen.textContent = "0";
        }
        clear = false;
    }
}

function clearScreen(){
    upperScreen.textContent = "";
    lowerScreen.textContent = "0";
    firstNumber = null, secondNumber = null, operator = "", clear = false;
}

// Calculate the result and round it up to 2 decimals
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

    // Return error when you divide by 0
    return isNaN(result) ? "ERROR: Invalid Operation": result;
}

// Support for keyboard
window.addEventListener("keydown", event =>{
    switch(event.key){
        case "Backspace": document.getElementById("DEL").click(); // Backspace
            break;
        case "c": document.getElementById("CLEAR").click(); // Clear with C
            break;
        case "Enter": document.getElementById("=").click(); // Enter for quick equals
            break;
        case "n": document.getElementById("+/-").click(); // Negate with N
            break;
        default:
            // Find button by using the key as ID
            const button = document.getElementById(event.key);
            if(button){
                button.click();
            }
            break;
    }
});