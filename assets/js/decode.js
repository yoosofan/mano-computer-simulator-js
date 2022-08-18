var valu;
const memory_instructions = [
    ["AND", 0, 8],
    ["ADD", 1, 9],
    ["LDA", 2, "A"],
    ["STA", 3, "B"],
    ["BUN", 4, "C"],
    ["BSA", 5, "D"],
    ["ISZ", 6, "E"]
]



// registor instructions
const register_instructions = [
    ["CLA", "7800"],
    ["CLE", "7400"],
    ["CMA", "7200"],
    ["CIR", "7080"],
    ["CIL", "7040"],
    ["INC", "7020"],
    ["SPA", "7010"],
    ["SNA", "7008"],
    ["SZA", "7004"],
    ["SZE", "7002"],
    ["HLT", "7001"]
]


let AC = '0010000000001001';
let DR = '0000000000000000';
let AR = '000000000000';
let IR = '0000000000000000';
let PC = '000000000000';
let TR = '0000000000000000';
let memory = "0000000000000000";
let carry = "0"

let registerHex = {
    IR: binaryToHex(IR),
    AC: binaryToHex(AC),
    DR: binaryToHex(DR),
    PC: binaryToHex(PC),
    AR: binaryToHex(AR),
    Memory: binaryToHex(AR),
}


let len;
let str;
let char;

function hexNumber(dec) {
    len = -1;
    str = '';
    char = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    do {
        str += char[dec & 0xF];
        ++len;
    } while (dec >>>= 4);
    dec += 'x';
    do
        dec += str[len];
    while (len--);
    return dec;
}

function hexNumberAddress(dec) {
    let hexadecimal = hexNumber(dec);
    let outcome;
    if (hexadecimal.length < 5) {
        let numberOfZero = [];
        for (let i = 0; i < 5 - hexadecimal.length; i++) {
            numberOfZero.push("0");
        }
        let arr = hexadecimal.split('');
        arr.splice(2, 0, ...numberOfZero);
        outcome = arr.join('');
        hexadecimal = outcome;
    }
    if (hexadecimal.length > 5) {
        hexadecimal = hexadecimal.split('').slice(-4).join('');
    }
    return hexadecimal;

}


// RAM table and add data  
const ramTable = document.createElement('table');
const memoryTable = document.querySelector('.ramtable');
var storedNames = JSON.parse(localStorage.getItem(`Datafatch`));
for (let i = -1; i < 100; i++) {
    var datacel = storedNames[i + 1];
    let r = document.createElement('tr');
    for (let j = 0; j < 3; j++) {
        let c = document.createElement('td');
        if (i == -1) {
            if (j == 0) {
                c.innerText = 'Decimal Addrress';
            } else if (j == 1) {
                c.innerText = 'Hex Addrress';
            } else if (j == 2) {
                c.innerText = 'Contents';
            }
            c.classList.add('text');
            r.classList.add('sticky');
        } else if (j == 0) {
            c.innerText = i;
            c.classList.add('text');
        } else if (j == 1) {
            c.innerText = hexNumberAddress(i);
            c.classList.add('text');
            c.classList.add('Address');
        } else if (j == 2) {
            c.innerText = datacel;
            c.classList.add('text');
            c.classList.add('data');
        }
        c.classList.add('center');
        r.appendChild(c);
    }
    ramTable.appendChild(r);
}
memoryTable.appendChild(ramTable);


// register table 
const regtable = document.createElement('table');
const registerTable = document.querySelector('.registerTable');
const items = ['Elements', 'Initial Values', 'T0: AR <- PC', 'T1: IR <- M[AR], PC <-PC+1', 'T2: AR <- IR[0:11]', 'T3', 'T4', 'T5', 'T6', 'After Execution'];
const headerItems = ['statements', 'IR', 'AC', 'DR', 'PC', 'AR', 'M[AR]', 'E'];
for (let i = 0; i < 10; i++) {
    let r = document.createElement('tr');
    for (let j = 0; j < 8; j++) {
        let c = document.createElement('td');
        if (j !== 0) {
            c.classList.add(`${headerItems[j]}`);
        }
        if (i == 0) {
            c.innerText = headerItems[j];
            c.classList.add('text');
            r.classList.add('sticky');
        }
        if (j == 0) {
            c.innerText = items[i];
            c.classList.add('itemsStyle');
            r.classList.add(`${i}`);
        }
        r.appendChild(c);
    }
    regtable.appendChild(r);
}
registerTable.appendChild(regtable);



//decode
function binaryToHex(number) {
    // console.log(parseInt(number, 2).toString(16).toUpperCase(), ";;;;")
    var hexadecimal = parseInt(number, 2).toString(16).toUpperCase();

    let outcome;
    if (hexadecimal.length < 3) {
        let numberOfZero = [];
        for (let i = 0; i < 3 - hexadecimal.length; i++) {
            numberOfZero.push("0");
        }
        let arr = hexadecimal.split('');
        arr.splice(0, 0, ...numberOfZero);
        console.log(arr)
        outcome = arr.join('');
        // console.log(outcome)
        hexadecimal = outcome;
    }
    if (hexadecimal.length > 3) {
        hexadecimal = hexadecimal.split('').slice(-4).join('');
    }
    return hexadecimal;
}

function hextobinary(hex) {
    console.log(hex, "hex")
    var binery = parseInt(hex, 16).toString(2);
    let numberOfZero = [];
    let outcome;
    for (let i = 0; i < 16 - binery.length; i++) {
        numberOfZero.push("0");
    }
    let arr = binery.split('');
    arr.splice(0, 0, ...numberOfZero);
    outcome = arr.join('');
    binery = outcome;
    return binery;
}


// Register-refrence instruction
// CLA 
function CLA() {
    AC = "0000000000000000";
}

// CLE 
function CLE() {
    carry = "0";
}


// CMA
function CMA() {
    AC = AC.split('');
    for (let index = 0; index < AC.length; index++)
        if (AC[index] == 0)
            AC[index] = 1;
        else if (AC[index] == 1) {
        AC[index] = 0;
    }
    AC = AC.join('')
}

// CME 
function CME() {
    carry = carry.split('');

    if (carry == 0)
        carry = 1;
    else if (carry == 1) {
        carry = 0;
    }
    carry = carry.join('')
}

// CIR 
function CIR() {
    var ACsplit = AC.split('');
    carry = ACsplit[15];
    // console.log(AC,"AC")
    var binary = parseInt(AC, 2);
    // console.log(binary,"lll ")
    ACsplit = binary >> 1;
    // console.log(ACsplit,">>1")
    ACsplit = (ACsplit >>> 0).toString(2);
    // console.log(ACsplit,"after hextobinary")
    let numberOfZero = [];
    let outcome;
    for (let i = 0; i < 16 - ACsplit.length; i++) {
        numberOfZero.push("0");
    }
    let arr = ACsplit.split('');
    arr.splice(0, 0, ...numberOfZero);
    arr[0] = carry;
    AC = arr.join('');
    // console.log(AC, "aftr shift right")
}

// CIR 
function CIL() {
    var ACsplit = AC.split('');
    carry = ACsplit[0];
    // console.log(AC,"AC")
    var binary = parseInt(AC, 2);
    // console.log(binary,"lll ")
    ACsplit = binary << 1;
    // console.log(ACsplit,">>1")
    ACsplit = ACsplit.toString(2);

    // console.log(ACsplit,"after hextobinary")
    let arr = []
    ACsplit.split('');
    for (let i = 0; i < 16; i++) {
        arr[i] = ACsplit[i + 1];
    }
    arr[15] = carry;
    AC = arr.join('');
    // console.log(AC, "aftr shift left")
}
// INC 
function INC() {
    var one = "1";
    AC = ADD(AC, one);

}

// SPA 
function SPA() {
    var one = "1";
    var ACsplit = AC.split('').reverse();
    if (ACsplit[15] == 0)
        PC = ADD(PC, one);
}

// SNA 
function SNA() {
    var one = "1";
    var ACsplit = AC.split('').reverse();
    if (ACsplit[15] == 1)
        PC = ADD(PC, one);
}

// SZA 
function SZA() {
    var one = "1";
    if (AC == '0000000000000000')
        PC = ADD(PC, one);
}

// SZE
function SZE() {
    var one = "1";
    if (carry == '0')
        PC = ADD(PC, one);
}

// HLT
function HLT() {
    document.getElementById("container").style.display = "none";
    document.getElementById("HLT").style.display = "block";
    alert("The computer stopped")
}




// Memory-refrence instruction 
// AND 
function and() {
    let result = '';
    var ACNumber = binaryToHex(AC);
    // console.log(memory, "yyyyyyyyyyyyyyyy");
    for (let index = 0; index < memory.length; index++)
        result += memory[index] & Number(ACNumber[index]);
    // console.log(result, "kdfhhdgh")
    return result;
}
// ADD 
function ADD(MemStr, ACStr) {
    const result = [];
    let E = 0;
    // console.log(MemStr)
    // console.log(ACStr)
    let lenMem = MemStr.length;
    let lenAC = ACStr.length;
    for (let i = lenMem - 1, j = lenAC - 1; 0 <= i || 0 <= j; --i, --j) {
        let x, y;
        if (0 <= i)
            x = Number(MemStr[i]);
        else
            x = 0;

        if (0 <= j)
            y = Number(ACStr[j]);
        else
            y = 0;

        result.push((x + y + E) % 2);
        // console.log((x + y + E) , "AAAAAAAAAA")
        E = 1 < x + y + E;
    };
    if (E) {
        result.push(1);
        Cout = 1;
    }
    // console.log(result.length, ";;;;")
    if (result.length > 16)
        return result.reverse().splice(result.length - 16).join('');
    else
        return result.reverse().join('');

};
// LAD 
function LDA() {
    AC = memory;
}
// STA 
function STA() {
    var memoryAddress = document.getElementsByClassName("Address");
    for (let l = 0; l < memoryAddress.length; l++)
        if (memoryAddress[l].innerText == AR) {
            code[l].innerText = AC;
            memory = code[l].innerText;
        }
}
// BUN 
function BUN() {
    PC = AR;
}
// BSA 
function BSA() {
    var memoryAddress = document.getElementsByClassName("Address");
    for (let l = 0; l < memoryAddress.length; l++)
        if (memoryAddress[l].innerText == AR) {
            code[l].innerText = PC;
            memory = code[l].innerText;
        }
    var one = "1";
    PC = ADD(AR, one);
}
// ISZ 
function ISZ() {
    var one = "1";
    var memoryAddress = document.getElementsByClassName("Address");
    for (let l = 0; l < memoryAddress.length; l++)
        if (memoryAddress[l].innerText == AR) {
            code[l].innerText = ADD(memory, one);
            memory = code[l].innerText;
            if (code[l].innerText == 0)
                PC = ADD(PC, one);
        }
}


function decode() {
    var code = document.getElementsByClassName("data");
    var memoryAddress = document.getElementsByClassName("Address");
    for (let i = 0; i < 3; i++) {
        for (let index = 0; index < code.length; index++) {
            if (i == index)
                code[index].classList.add("border");
            else
                code[index].classList.remove("border");
        }
        var data = code[i].innerText;
        var opcode = data.split('')[0];
        if (opcode == "7") {
            for (let j = 0; j < register_instructions.length; j++) {
                if (register_instructions[j][1] == data) {
                    valu = register_instructions[j][0];
                    if (valu == "CLA")
                        CLA();
                    else if (valu == "CLE")
                        CLE();
                    else if (valu == "CMA")
                        CMA();
                    else if (valu == "CME")
                        CME();
                    else if (valu == "CIR") {
                        CIR();
                    } else if (valu == "CIL") {
                        CIL();
                    } else if (valu == "INC")
                        INC();
                    else if (valu == "SPA")
                        SPA();
                    else if (valu == "SNA")
                        SNA();
                    else if (valu == "SZA")
                        SZA();
                    else if (valu == "SZE")
                        SZE();
                    else if (valu == "HLT")
                        HLT()
                }
            }
        } else {
            AR = "0x" + data.slice(1, 4);
            if (opcode == 0) {
                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == AR)
                        memory = code[l].innerText;

                AC = hextobinary(and());

            } else if (opcode == 1) {
                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == AR)
                        memory = code[l].innerText;

                // console.log(AC, "lllllllllllllllllllllllllllllllll");
                AC = ADD(memory, AC);
                console.log(AC, "AC");
            } else if (opcode == 2) {
                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == AR)
                        memory = code[l].innerText;
                LDA();

            } else if (opcode == 3) {
                STA();
            } else if (opcode == 4) {
                BUN();
            } else if (opcode == 5) {
                BSA()
            } else if (opcode == 6) {
                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == AR)
                        memory = code[l].innerText;
                ISZ();
            } else if (opcode == 8) {
                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == AR) {
                        AR = code[l].innerText;
                        break;
                    }
                for (let y = 0; y < memoryAddress.length; y++)
                    if (memoryAddress[y].innerText == AR)
                        memory = code[y].innerText;


                AC = hextobinary(and());

            } else if (opcode == 9) {
                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == AR) {
                        AR = code[l].innerText;
                        break;
                    }
                for (let y = 0; y < memoryAddress.length; y++)
                    if (memoryAddress[y].innerText == AR)
                        memory = code[y].innerText;
                AC = ADD(memory, AC);
            } else if (opcode == "A") {
                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == AR) {
                        AR = code[l].innerText;
                        break;
                    }
                for (let y = 0; y < memoryAddress.length; y++)
                    if (memoryAddress[y].innerText == AR)
                        memory = code[y].innerText;
                LDA();
            } else if (opcode == "B") {
                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == AR) {
                        AR = code[l].innerText;
                        break;
                    }
                STA();
            } else if (opcode == "C") {
                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == AR) {
                        AR = code[l].innerText;
                        break;
                    }
                BUN();
            } else if (opcode == "D") {
                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == AR) {
                        AR = code[l].innerText;
                        break;
                    }
                BSA()
            } else if (opcode == "E") {

                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == AR) {
                        AR = code[l].innerText;
                        break;
                    }
                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == AR)
                        memory = code[l].innerText;
                ISZ();
            }

        }

    }

}