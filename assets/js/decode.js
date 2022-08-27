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
let sym;

let AC = '0000000000000000';
let DR = '0000000000000000';
let AR = '000000000000';
let IR = '0000000000000000';
let PC = '000000000000';
let TR = '0000000000000000';
let memory = '000000000000';

let registerHex = {
    IR: binaryToHex(IR),
    AC: binaryToHex(AC),
    DR: binaryToHex(DR),
    PC: binaryToHex(PC),
    AR: binaryToHex(AR),
    memory: binaryToHex(AR),
}


//flag
let FGI = "0";
let FGO = "0";
let Int = "0";
let Z = "0";
let carry = "0";
let N = "0";
let V = "0";

var opcode;
var code = document.getElementsByClassName("data");
var memoryAddress = document.getElementsByClassName("Address");
const fetchBtn = document.getElementById('fetchdata');
const decodeBtn = document.getElementById('decode');
const executeBtn = document.getElementById('execute');
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

function disableBtn(button) {
    button.disabled = true;
}

function enableBtn(button) {
    button.disabled = false;
}

// RAM table and add data  
const ramTable = document.createElement('table');
const memoryTable = document.querySelector('.ramtable');
// var storedNames = JSON.parse(localStorage.getItem(`Datafatch`));
for (let i = -1; i < 100; i++) {
    // var datacel = storedNames[i + 1];
    let r = document.createElement('tr');
    for (let j = 0; j < 3; j++) {
        let c = document.createElement('td');
        if (i == -1) {
            if (j == 0) {
                c.innerText = 'Decimal Addrress';
            } else if (j == 1) {
                c.innerText = 'Hex Addrress';
            } else if (j == 2) {
                c.innerText = 'Memory';
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
            c.innerText = "0000";
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
const items = ['Elements', 'Initial Values', ' AR <- PC', ' IR <- M[AR], PC <-PC+1', ' AR <- IR[0:11]', 'T3', 'T4', 'T5', 'T6'];
const headerItems = ['statements', 'IR', 'AC', 'DR', 'PC', 'AR', 'M[AR]'];
for (let i = 0; i < 9; i++) {
    let r = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
        let c = document.createElement('td');
        if (j !== 0) {
            c.classList.add(`${i}`);
            if (i != 0 && i != 1)
                c.classList.add('regList');
        }
        if (i == 0) {
            c.innerText = headerItems[j];
            c.classList.add('text');
            r.classList.add('sticky');
        }
        if (j == 0) {
            c.innerText = items[i];
            c.classList.add('itemsStyle');
            c.classList.add(`${i}`);
            // r.classList.add(`${i}`);
        }
        if (i == 1) {
            if (j == 1)
                c.innerHTML = "0x" + registerHex.IR;
            else if (j == 2)
                c.innerHTML = "0x" + registerHex.AC;
            else if (j == 3)
                c.innerHTML = registerHex.DR;
            else if (j == 4)
                c.innerHTML = "0x" + registerHex.PC;
            else if (j == 5)
                c.innerHTML = "0x" + registerHex.AR;
            else if (j == 6)
                c.innerHTML = "0x" + registerHex.memory;
        }
        r.appendChild(c);
    }
    regtable.appendChild(r);
}
registerTable.appendChild(regtable);

// flag table
const ftable = document.createElement('table');
const flagTable = document.querySelector('.flagTable');
const header = ['E', 'Z', 'N', 'V', 'FGI', 'FGO', 'IEN'];
for (let o = 0; o < 2; o++) {
    let r = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
        let c = document.createElement('td');
        if (o == 0) {
            c.innerText = header[j];
            c.classList.add('text');
            r.classList.add('sticky');
        }

        if (o == 1) {
            c.classList.add('flagList');
            if (j == 0)
                c.innerText = "0";
            else if (j == 1)
                c.innerHTML = "0";
            else if (j == 2)
                c.innerHTML = "0";
            else if (j == 3)
                c.innerHTML = "0";
            else if (j == 4)
                c.innerHTML = "0";
            else if (j == 5)
                c.innerHTML = "0";
            else if (j == 6)
                c.innerHTML = "0";
        }
        r.appendChild(c);
    }
    ftable.appendChild(r);
}

flagTable.appendChild(ftable);


// write to table 
function writeTotable(number, T) {
    let c = document.getElementsByClassName(`${number}`);
    console.log(c, ";;;;;;;;;;;;rpooepirope")
    console.log(typeof (registerHex.IR), "lllllll");
    c[0].innerHTML = T;
    c[1].innerText = "0x" + registerHex.IR;
    c[2].innerText = "0x" + registerHex.AC;
    c[3].innerText = registerHex.DR;
    c[4].innerText = "0x" + registerHex.PC;
    c[5].innerText = registerHex.AR;
    c[6].innerText = registerHex.memory;
}

// write to flag
function writeToflag() {
    var flag = document.getElementsByClassName("flagList");
    flag[0].innerText = carry;
    flag[1].innerText = Z;
    flag[2].innerText = N;
    flag[3].innerText = V;
    flag[4].innerText = FGI;
    flag[5].innerText = FGO;
    flag[6].innerText = Int;

}

function checkFlag() {
    if (AC == "0000000000000000")
        Z = "1";
    else
        Z = "0";
    writeToflag();
}

function led() {
    var led = document.getElementsByClassName("circle");
    console.log(led[1], 'pppp')
    var ACLed = AC.split('');
    for (let k = 0; k < ACLed.length; k++) {
        if (ACLed[k] == 1) {
            led[k].style.backgroundColor = "#d2bc0d";
        } else {
            led[k].style.backgroundColor = "white";
        }

    }
}

function turnOFFled() {
    var led = document.getElementsByClassName("circle");
    console.log(led[1], 'pppp')
    var ACLed = AC.split('');
    for (let k = 0; k < ACLed.length; k++) {
        led[k].style.backgroundColor = "white";
    }
}

function writeLog(symbol, level) {
    console.log(symbol, "symbol")
    var tab = document.getElementById("log");


    let c = document.createElement('td');
    for (let index = 0; index < 3; index++) {
        let r = document.createElement('tr');
        if (index == 0 && index == level) {
            c.innerText = `Fetch \n AR <= PC \n PC <= PC + 1 \n IR <= M[AR]`;
            r.classList.add('logList');
            r.appendChild(c);
            tab.appendChild(r);
        } else if (index == 1 && index == level) {
            c.innerText = `Decode \n AR <= IR[0:11] \n ${symbol} \n DR <= Data `;
            r.classList.add('logList');
            r.appendChild(c);
            tab.appendChild(r);
        } else if (index == 2 && index == level) {
            c.innerText = `execute \n ALU_Sel: ${symbol} \n AC <= ALU_OUT \n`;
            r.classList.add('logList');
            r.classList.add('logexecute');
            r.appendChild(c);
            tab.appendChild(r);
            // c.innerText = "kdkflk";
            let z = document.createElement('td');
            // z.innerText="   "
            z.classList.add('space');
            r.appendChild(z);
            tab.appendChild(r);
        }
       
    }
}

function binaryToHex(number) {
    var hexadecimal = parseInt(number, 2).toString(16).toUpperCase();
    let outcome;
    if (hexadecimal.length < 3) {
        let numberOfZero = [];
        for (let i = 0; i < 3 - hexadecimal.length; i++) {
            numberOfZero.push("0");
        }
        let arr = hexadecimal.split('');
        arr.splice(0, 0, ...numberOfZero);
        // console.log(arr)
        outcome = arr.join('');
        hexadecimal = outcome;
    }
    if (hexadecimal.length > 3) {
        hexadecimal = hexadecimal.split('').slice(-4).join('');
    }
    return hexadecimal;
}

function hextobinary(hex) {
    // console.log(hex, "hex")
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

function CLA() {
    AC = "0000000000000000";
    registerHex.AC = binaryToHex(AC);
}

function CLE() {
    carry = "0";
}

function CMA() {
    AC = AC.split('');
    for (let index = 0; index < AC.length; index++)
        if (AC[index] == 0)
            AC[index] = 1;
        else if (AC[index] == 1) {
        AC[index] = 0;
    }
    AC = AC.join('');
    registerHex.AC = binaryToHex(AC);
}

function CME() {
    carry = carry.split('');
    if (carry == 0)
        carry = 1;
    else if (carry == 1) {
        carry = 0;
    }
    carry = carry.join('')
}

function CIR() {
    var ACsplit = AC.split('');
    carry = ACsplit[15];
    var binary = parseInt(AC, 2);
    ACsplit = binary >> 1;
    ACsplit = (ACsplit >>> 0).toString(2);
    let numberOfZero = [];
    let outcome;
    for (let i = 0; i < 16 - ACsplit.length; i++) {
        numberOfZero.push("0");
    }
    let arr = ACsplit.split('');
    arr.splice(0, 0, ...numberOfZero);
    arr[0] = carry;
    AC = arr.join('');
    registerHex.AC = binaryToHex(AC);
}

function CIL() {
    var ACsplit = AC.split('');
    carry = ACsplit[0];
    var binary = parseInt(AC, 2);
    ACsplit = binary << 1;
    ACsplit = ACsplit.toString(2);
    let arr = []
    ACsplit.split('');
    for (let i = 0; i < 16; i++) {
        arr[i] = ACsplit[i + 1];
    }
    arr[15] = carry;
    AC = arr.join('');
    registerHex.AC = binaryToHex(AC);
}

function INC() {
    var one = "1";
    AC = ADD(AC, one);
    registerHex.AC = binaryToHex(AC);
}

// function SPA() {
//     var one = "1";
//     var ACsplit = AC.split('').reverse();
//     if (ACsplit[15] == 0)
//         PC = ADD(PC, one);
//     registerHex.PC = binaryToHex(PC);
// }

// function SNA() {
//     var one = "1";
//     var ACsplit = AC.split('').reverse();
//     if (ACsplit[15] == 1)
//         PC = ADD(PC, one);
//     registerHex.PC = binaryToHex(PC);
// }

// function SZA() {
//     var one = "1";
//     if (AC == '0000000000000000')
//         PC = ADD(PC, one);
//     registerHex.PC = binaryToHex(PC);
// }

// function SZE() {
//     var one = "1";
//     if (carry == '0')
//         PC = ADD(PC, one);
//     registerHex.PC = binaryToHex(PC);
// }

function HLT() {
    console.log("hlt meeeeee")
    document.getElementById("HLT").classList.add("shutDown");
    document.getElementById("back").style.display = "block";
    document.getElementById("container").style.display = "none";
}


// Memory-refrence instruction 
function and() {
    let result = '';
    var ACNumber = binaryToHex(AC);
    for (let index = 0; index < registerHex.DR.length; index++)
        result += registerHex.DR[index] & Number(ACNumber[index]);
    return result;
}

function ADD(MemStr, ACStr) {
    const result = [];
    let E = 0;
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
        carry = "1";
    }

    if (result.length > 16)
        return result.reverse().splice(result.length - 16).join('');
    else
        return result.reverse().join('');

};

function LDA() {
    AC = DR;
    registerHex.AC = binaryToHex(AC);
}

function STA() {
    for (let l = 0; l < memoryAddress.length; l++) {
        console.log(memoryAddress[l].innerText, "koja", registerHex.AR)
        if (memoryAddress[l].innerText == registerHex.AR) {
            code[l].innerText = binaryToHex(AC);
            memory = hextobinary(code[l].innerText);
            registerHex.memory = code[l].innerText;
        }

    }
}

// function BUN() {
//     PC = AR;
// }

// function BSA() {
//     for (let l = 0; l < memoryAddress.length; l++)
//         if (memoryAddress[l].innerText == registerHex.AR) {
//             memory = AR;
//             registerHex.memory = binaryToHex(memory);
//             code[l].innerText = PC;
//             registerHex.DR = code[l].innerText;
//             DR = hextobinary(registerHex.DR)
//         }
//     var one = "1";
//     PC = ADD(AR, one);
// }

function ISZ() {
    var one = "1";
    DR = ADD(DR, one);
    registerHex.DR = binaryToHex(DR);
    writeTotable("6", "T4: DR <- DR + 1");
    if (DR == "0000000000000000") {
        PC = ADD(PC, one);
        registerHex.PC = binaryToHex(PC);
    }
    writeTotable("7", `T4: M[AR] <- DR IF(DR=0) \n
    then (PC <- PC + 1)`);

}




//fetch************************************************

function fetch() {
    // disableBtn(executeBtn);
    // disableBtn(decodeBtn);
    // enableBtn(fetchBtn);
    console.log(registerHex, "fetch");
    var one = "1";
    registerHex.AR = "0x" + binaryToHex(PC); // AR <= PC   
    AR = PC; // AR <= PC
    writeTotable("2", "T0: AR <- PC");
    PC = ADD(PC, one);
    registerHex.PC = binaryToHex(PC); //PC <= PC +1
    console.log(registerHex.AR, "PC")
    for (let index = 0; index < memoryAddress.length; index++) {
        if (memoryAddress[index].innerText == registerHex.AR) {
            code[index].classList.add("border");
            memory = hextobinary(code[index].innerText);
            registerHex.memory = code[index].innerText;
            console.log(memory, "dhghydyetyttttttttttttttttttttttttt")
            registerHex.IR = registerHex.memory; //IR <= M[AR]
            IR = memory; //IR <= M[AR]

            writeTotable("3", "T1: IR <- M[AR], PC <-PC+1");
        } else
            code[index].classList.remove("border");
    }
    writeLog(" ", 0);
}

//decode**************************************************
function decode() {
    console.log(registerHex, "decode");
    // disableBtn(fetchBtn);
    // disableBtn(executeBtn);
    // enableBtn(decodeBtn);
    opcode = registerHex.IR.split('')[0];
    if (opcode == "7") {
        AR = "0x" + registerHex.IR.slice(1, 4); // AR<=IR[0,11]
        registerHex.AR = AR;
        writeTotable("4", "T2: AR <- IR[0:11]");
        for (let j = 0; j < register_instructions.length; j++) {
            if (register_instructions[j][1] == registerHex.IR) {
                valu = register_instructions[j][0];
                sym = valu;
            }
        }
    } else {
        AR = "0x" + registerHex.IR.slice(1, 4); // AR<=IR[0,11]
        registerHex.AR = AR;
        writeTotable("4", "T2: AR <- IR[0:11]");
        if (opcode == 0) {
            sym = "AND";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = hextobinary(code[l].innerText);
                    registerHex.memory = code[l].innerText;
                    registerHex.DR = code[l].innerText;
                    DR = hextobinary(registerHex.DR);
                }
            writeTotable("5", "T3: DR <-M[AR]");

        } else if (opcode == 1) {
            sym = "ADD";
            writeTotable("4", "T2: AR <- IR[0:11]");
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = hextobinary(code[l].innerText);
                    registerHex.memory = code[l].innerText;
                    registerHex.DR = code[l].innerText;
                    DR = hextobinary(registerHex.DR);
                }
            writeTotable("5", "T3: DR <-M[AR]");
        } else if (opcode == 2) {
            sym = "LDA";
            writeTotable("4", "T2: AR <- IR[0:11]");
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = hextobinary(code[l].innerText);
                    registerHex.memory = code[l].innerText;
                    registerHex.DR = code[l].innerText;
                    DR = hextobinary(registerHex.DR);
                }
            writeTotable("5", "T3: DR <-M[AR]");
        } else if (opcode == 3) {
            sym = "STA";
        } else if (opcode == 4) {
            sym = "BUN";
        } else if (opcode == 5) {
            sym = "BSA";
        } else if (opcode == 6) {
            sym = "ISZ";
            writeTotable("4", "T2: AR <- IR[0:11]");
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = hextobinary(code[l].innerText);
                    registerHex.memory = code[l].innerText;
                    registerHex.DR = code[l].innerText;
                    DR = hextobinary(registerHex.DR);
                }
            writeTotable("5", "T3: DR <-M[AR]");
        } else if (opcode == 8) {
            sym = "AND";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory = binaryToHex(memory);
                    AR = code[l].innerText;
                    break;
                }
            for (let y = 0; y < memoryAddress.length; y++)
                if (memoryAddress[y].innerText == AR) {
                    memory = AR;
                    registerHex.memory = binaryToHex(memory);
                    registerHex.DR = code[y].innerText;
                    DR = hextobinary(registerHex.DR);
                }
        } else if (opcode == 9) {
            sym = "ADD";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory = binaryToHex(memory);
                    AR = code[l].innerText;
                    break;
                }
            for (let y = 0; y < memoryAddress.length; y++)
                if (memoryAddress[y].innerText == AR) {
                    memory = AR;
                    registerHex.memory = binaryToHex(memory);
                    registerHex.DR = code[y].innerText;
                    DR = hextobinary(registerHex.DR)
                }
        } else if (opcode == "A") {
            sym = "LDA";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory = binaryToHex(memory);
                    AR = code[l].innerText;
                    break;
                }
            for (let y = 0; y < memoryAddress.length; y++)
                if (memoryAddress[y].innerText == AR) {
                    memory = AR;
                    registerHex.memory = binaryToHex(memory);
                    registerHex.DR = code[y].innerText;
                    DR = hextobinary(registerHex.DR);
                }
        } else if (opcode == "B") {
            sym = "STA";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory = binaryToHex(memory);
                    AR = code[l].innerText;
                    break;
                }
        } else if (opcode == "C") {
            sym = "BUN";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory = binaryToHex(memory);
                    AR = code[l].innerText;
                    break;
                }
        } else if (opcode == "D") {
            sym = "BSA";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory = binaryToHex(memory);
                    AR = code[l].innerText;
                    break;
                }
        } else if (opcode == "E") {
            sym = "ISZ";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory = binaryToHex(memory);
                    AR = code[l].innerText;
                    break;
                }
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory = binaryToHex(memory)
                    registerHex.DR = code[l].innerText;
                    DR = hextobinary(registerHex.DR);
                }
        }

    }

    writeLog(sym, 1);
}

//execute**************************************************
function execute() {
    console.log(registerHex, "execute");
    // enableBtn(executeBtn);
    // disableBtn(fetchBtn);
    // disableBtn(decodeBtn);
    if (opcode == "7") {

        if (valu == "CLA") {
            CLA();
            console.log(PC, "PC\n", AC, "AC\n", "CLA");

        } else if (valu == "CLE") {
            CLE();
            console.log(PC, "PC\n", AC, "AC\n", "CLE");

        } else if (valu == "CMA") {
            CMA();
            console.log(PC, "PC\n", AC, "AC\n", "CMA");

        } else if (valu == "CME") {
            CME();
            console.log(PC, "PC\n", AC, "AC\n", "CME");

        } else if (valu == "CIR") {
            CIR();
            console.log(PC, "PC\n", AC, "AC\n", "CIR");

        } else if (valu == "CIL") {
            CIL();
            console.log(PC, "PC\n", AC, "AC\n", "CIL");

        } else if (valu == "INC") {
            INC();
            console.log(PC, "PC\n", AC, "AC\n", "INC");

        } else if (valu == "SPA") {
            SPA();
            console.log(PC, "PC\n", AC, "AC\n", "SPA");

        } else if (valu == "SNA") {
            SNA();
            console.log(PC, "PC\n", AC, "AC\n", "SNA");

        } else if (valu == "SZA") {
            SZA();
            console.log(PC, "PC\n", AC, "AC\n", "SZA");

        } else if (valu == "SZE") {
            SZE();
            console.log(PC, "PC\n", AC, "AC\n", "SZE");

        } else if (valu == "HLT") {
            HLT();
            console.log(PC, "PC\n", AC, "AC\n", "HLT");


        }
    }
    if (opcode == 0) {
        sym = "AND";
        AC = hextobinary(and());
        registerHex.AC = binaryToHex(AC);
        writeTotable("6", "T4: AC <- AC ^ DR");
        checkFlag();
        console.log(PC, "PC\n", AC, "AC\n", "and");
    } else if (opcode == 1) {
        sym = "ADD";
        AC = ADD(DR, AC);
        registerHex.AC = binaryToHex(AC);
        writeTotable("6", "T4: AC <- AC + DR");
        checkFlag();
        console.log(PC, "PC\n", AC, "AC\n", "ADD");
    } else if (opcode == 2) {
        sym = "LDA";
        LDA();
        writeTotable("6", "T4: AC <- DR");
        checkFlag();
        console.log(PC, "PC\n", AC, "AC\n", "LDA");

    } else if (opcode == 3) {
        sym = "STA";
        STA();
        writeTotable("5", "T3: M[AR] <- AC");
        console.log(PC, "PC\n", AC, "AC\n", "STA");
    } else if (opcode == 4) {
        sym = "BUN";
        BUN();
        console.log(PC, "PC\n", AC, "AC\n", "BUN");
    } else if (opcode == 5) {
        sym = "BSA";
        BSA();
        console.log(PC, "PC\n", AC, "AC\n", "BSA");
    } else if (opcode == 6) {
        sym = "ISZ";
        ISZ();
        console.log(PC, "PC\n", AC, "AC\n", "ISZ");

    } else if (opcode == 8) {
        sym = "AND";
        AC = hextobinary(and());
        registerHex.AC = binaryToHex(AC);
        console.log(PC, "PC\n", AC, "AC\n", "andtwo");

    } else if (opcode == 9) {
        sym = "ADD";
        AC = ADD(DR, AC);
        registerHex.AC = binaryToHex(AC);
        console.log(PC, "PC\n", AC, "AC\n", "ADDtwo");
    } else if (opcode == "A") {
        sym = "LDA";
        LDA();
        console.log(PC, "PC\n", AC, "AC\n", "LDAtwo");
    } else if (opcode == "B") {
        sym = "STA";
        STA();
        console.log(PC, "PC\n", AC, "AC\n", "STAtwo");
    } else if (opcode == "C") {
        sym = "BUN";
        BUN();
        console.log(PC, "PC\n", AC, "AC\n", "BUNtwo");

    } else if (opcode == "D") {
        sym = "BSA";
        BSA();
        console.log(PC, "PC\n", AC, "AC\n", "BSAtwo");
    } else if (opcode == "E") {
        sym = "ISZ";
        ISZ();
        console.log(PC, "PC\n", AC, "AC\n", "ISZtwo");

    }
    led();
    writeLog(sym, 2);
}