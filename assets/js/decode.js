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


let AC = '0000000000000000';
let DR = '0000000000000000';
let AR = '000000000000';
let IR = '0000000000000000';
let PC = '000000000000';
let TR = '0000000000000000';
let memory = '000000000000'
let carry = "0"

let registerHex = {
    IR: binaryToHex(IR),
    AC: binaryToHex(AC),
    DR: binaryToHex(DR),
    PC: binaryToHex(PC),
    AR: binaryToHex(AR),
    memory: binaryToHex(AR),
    E: carry
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
            c.classList.add(`${i}`);
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
        if (i == 1) {
            if (j == 1)
                c.innerHTML = "0x" + registerHex.IR;
            else if (j == 2)
                c.innerHTML = "0x" + registerHex.AC;
            else if (j == 3)
                c.innerHTML =registerHex.DR;
            else if (j == 4)
                c.innerHTML = "0x" + registerHex.PC;
            else if (j == 5)
                c.innerHTML = "0x" + registerHex.AR;
            else if (j == 6)
                c.innerHTML = "0x" + registerHex.memory;
            else if (j == 7)
                c.innerHTML = registerHex.E;
        }
        r.appendChild(c);
    }
    regtable.appendChild(r);
}
registerTable.appendChild(regtable);

// write to table 
function writeTotable(number) {
    // console.log("write");
    // console.log(c);
    // for (let i = 0; i < 10; i++) {
    let c = document.getElementsByClassName(`${number}`);
            console.log(c);
            c[1].innerText = "0x" + registerHex.IR;
            c[2].innerText = "0x" + registerHex.AC;
            c[3].innerText = registerHex.DR;
            c[4].innerText = "0x" + registerHex.PC;
            // console.log(c[5]);
            // console.log(registerHex.AR, ";;;;;;ddddddddddd;;;;;;;;;;;;;;;;;;;")
            c[5].innerText = registerHex.AR;
            c[6].innerText = "0x" + registerHex.memory;
            c[7].innerText = registerHex.E;
}
//excute

function led(){
    var led = document.getElementsByClassName("circle");
    console.log(led[1],'pppp')
    var ACLed=AC.split('');
    for (let k = 0; k < ACLed.length; k++) {
        if (ACLed[k] == 1) {
            led[k].style.backgroundColor="#d2bc0d";
        }else{
            led[k].style.backgroundColor="white";
        }
        
    }
}


//decode
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
// CLA 
function CLA() {
    AC = "0000000000000000";
    registerHex.AC= binaryToHex(AC);
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
    AC = AC.join('');
    registerHex.AC= binaryToHex(AC);
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
    registerHex.AC= binaryToHex(AC);
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
    registerHex.AC= binaryToHex(AC);
    // console.log(AC, "aftr shift left")
}

// INC 
function INC() {
    var one = "1";
    AC = ADD(AC, one);
    registerHex.AC= binaryToHex(AC);
}

// SPA 
function SPA() {
    var one = "1";
    var ACsplit = AC.split('').reverse();
    if (ACsplit[15] == 0)
        PC = ADD(PC, one);
        registerHex.PC=binaryToHex(PC);
}

// SNA 
function SNA() {
    var one = "1";
    var ACsplit = AC.split('').reverse();
    if (ACsplit[15] == 1)
        PC = ADD(PC, one);
        registerHex.PC=binaryToHex(PC);
}

// SZA 
function SZA() {
    var one = "1";
    if (AC == '0000000000000000')
        PC = ADD(PC, one);
        registerHex.PC=binaryToHex(PC);
}

// SZE
function SZE() {
    var one = "1";
    if (carry == '0')
        PC = ADD(PC, one);
        registerHex.PC=binaryToHex(PC);
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
    for (let index = 0; index < registerHex.DR.length; index++)
        result += registerHex.DR[index] & Number(ACNumber[index]);
    // console.log(result, "kdfhhdgh")
    return result;
}

// ADD 
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
        carry="1";
    }
   
    if (result.length > 16)
        return result.reverse().splice(result.length - 16).join('');
    else
        return result.reverse().join('');

};

// LAD 
function LDA() {
    AC = DR;
    registerHex.AC= binaryToHex(AC);
}

// STA 
function STA() {
    var memoryAddress = document.getElementsByClassName("Address");
    for (let l = 0; l < memoryAddress.length; l++)
        if (memoryAddress[l].innerText == AR) {
            memory = AR;
            registerHex.memory=binaryToHex(memory);
            code[l].innerText = AC;
            registerHex.DR = code[l].innerText;
            DR = hextobinary(registerHex.DR)
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
            memory = AR;
            registerHex.memory=binaryToHex(memory);
            code[l].innerText = PC;
            registerHex.DR = code[l].innerText;
            DR = hextobinary(registerHex.DR)
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
            code[l].innerText = ADD(registerHex.DR, one);
            registerHex.DR = code[l].innerText;
            DR = hextobinary(registerHex.DR)
            if (code[l].innerText == 0){
                PC = ADD(PC, one);
                registerHex.PC=binaryToHex(PC);
            }
        }
}


function decode() {
    var code = document.getElementsByClassName("data");
    var memoryAddress = document.getElementsByClassName("Address");
    registerHex.AR = "0x" + binaryToHex(PC); // AR <= PC   
    AR = PC; // AR <= PC
    writeTotable( "2");
    console.log(registerHex.AR, "PC")
    for (let index = 0; index < memoryAddress.length; index++) {
        if (memoryAddress[index].innerText == registerHex.AR) {
            code[index].classList.add("border");
            registerHex.IR = code[index].innerText; //IR <= M[AR]
            IR = hextobinary(registerHex.IR); //IR <= M[AR]

           writeTotable("3");
        } else
            code[index].classList.remove("border");
    }
    var one = "1";
    var opcode = registerHex.IR.split('')[0];
    if (opcode == "7") {
        AR = "0x" + registerHex.IR.slice(1, 4); // AR<=IR[0,11]
        registerHex.AR = AR;

        for (let j = 0; j < register_instructions.length; j++) {
            if (register_instructions[j][1] == registerHex.IR) {
                valu = register_instructions[j][0];
                if (valu == "CLA") {
                    CLA();
                    PC = ADD(PC, one);
                    registerHex.PC=binaryToHex(PC);
                    console.log(PC,"PC\n",AC,"AC\n", "CLA");
                    decode();
                    break;

                } else if (valu == "CLE") {
                    CLE();
                    PC = ADD(PC, one);
                    registerHex.PC=binaryToHex(PC);
                    console.log(PC,"PC\n",AC,"AC\n", "CLE");
                    decode();
                    break;
                } else if (valu == "CMA") {
                    CMA();
                    PC = ADD(PC, one);
                    registerHex.PC=binaryToHex(PC);
                    console.log(PC,"PC\n",AC,"AC\n", "CMA");
                    decode();
                    break;
                } else if (valu == "CME") {
                    CME();
                    PC = ADD(PC, one);
                    registerHex.PC=binaryToHex(PC);
                    console.log(PC,"PC\n",AC,"AC\n", "CME");
                    decode();
                    break;
                } else if (valu == "CIR") {
                    CIR();
                    PC = ADD(PC, one);
                    registerHex.PC=binaryToHex(PC);
                    console.log(PC,"PC\n",AC,"AC\n", "CIR");
                    decode();
                    break;
                } else if (valu == "CIL") {
                    CIL();
                    PC = ADD(PC, one);
                    registerHex.PC=binaryToHex(PC);
                    console.log(PC,"PC\n",AC,"AC\n", "CIL");
                    decode();
                    break;
                } else if (valu == "INC") {
                    INC();
                    PC = ADD(PC, one);
                    registerHex.PC=binaryToHex(PC);
                    console.log(PC,"PC\n",AC,"AC\n", "INC");
                    decode();
                    break;
                } else if (valu == "SPA") {
                    SPA();
                    PC = ADD(PC, one);
                    registerHex.PC=binaryToHex(PC);
                    console.log(PC,"PC\n",AC,"AC\n", "SPA");
                    decode();
                    break;
                } else if (valu == "SNA") {
                    SNA();
                    PC = ADD(PC, one);
                    registerHex.PC=binaryToHex(PC);
                    console.log(PC,"PC\n",AC,"AC\n", "SNA");
                    decode();
                    break;
                } else if (valu == "SZA") {
                    SZA();
                    PC = ADD(PC, one);
                    registerHex.PC=binaryToHex(PC);
                    console.log(PC,"PC\n",AC,"AC\n", "SZA");
                    decode();
                    break;
                } else if (valu == "SZE") {
                    SZE();
                    PC = ADD(PC, one);
                    registerHex.PC=binaryToHex(PC);
                    console.log(PC,"PC\n",AC,"AC\n", "SZE");
                    decode();
                    break;
                } else if (valu == "HLT") {
                    HLT();
                    PC = ADD(PC, one);
                    registerHex.PC=binaryToHex(PC);
                    console.log(PC,"PC\n",AC,"AC\n", "HLT");
                    decode();
                    break;

                }
            }
        }
    } else {
        AR = "0x" + registerHex.IR.slice(1, 4); // AR<=IR[0,11]
        registerHex.AR = AR;

        if (opcode == 0) {
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory=binaryToHex(memory);
                    registerHex.DR = code[l].innerText;
                    DR = hextobinary(registerHex.DR);
                }
            AC = hextobinary(and());
            registerHex.AC= binaryToHex(AC);
            PC = ADD(PC, one);
            registerHex.PC=binaryToHex(PC);
            console.log(PC,"PC\n",AC,"AC\n", "and");
            led();
            decode();
            // break;

        } else if (opcode == 1) {
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory=binaryToHex(memory);
                    registerHex.DR = code[l].innerText;
                    DR = hextobinary(registerHex.DR);
                }
            AC = ADD(DR, AC);
            registerHex.AC= binaryToHex(AC);
            PC = ADD(PC, one);
            registerHex.PC=binaryToHex(PC);
            console.log(PC,"PC\n",AC,"AC\n", "ADD");
            led();
            decode();
            // break;
        } else if (opcode == 2) {
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory=binaryToHex(memory);
                    registerHex.DR = code[l].innerText;
                    DR = hextobinary(registerHex.DR);
                }
            LDA();
            PC = ADD(PC, one);
            registerHex.PC=binaryToHex(PC);
            console.log(PC,"PC\n",AC,"AC\n", "LDA");
            decode();
            // break;

        } else if (opcode == 3) {
            STA();
            PC = ADD(PC, one);
            registerHex.PC=binaryToHex(PC);
            console.log(PC,"PC\n",AC,"AC\n", "STA");
            decode();
            // break;
        } else if (opcode == 4) {
            BUN();
            PC = ADD(PC, one);
            registerHex.PC=binaryToHex(PC);
            console.log(PC,"PC\n",AC,"AC\n", "BUN");
            decode();
            // break;
        } else if (opcode == 5) {
            BSA();
            PC = ADD(PC, one);
            registerHex.PC=binaryToHex(PC);
            console.log(PC,"PC\n",AC,"AC\n", "BSA");
            decode();
            // break;
        } else if (opcode == 6) {
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory=binaryToHex(memory);
                    registerHex.DR = code[l].innerText;
                    DR = hextobinary(registerHex.DR);
                }
            ISZ();
            PC = ADD(PC, one);
            registerHex.PC=binaryToHex(PC);
            console.log(PC,"PC\n",AC,"AC\n", "ISZ");
            decode();
            // break;
        } else if (opcode == 8) {
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory=binaryToHex(memory);
                    AR = code[l].innerText;
                    break;
                }
            for (let y = 0; y < memoryAddress.length; y++)
                if (memoryAddress[y].innerText == AR) {
                    memory = AR;
                    registerHex.memory=binaryToHex(memory);
                    registerHex.DR = code[y].innerText;
                    DR = hextobinary(registerHex.DR);
                }
            AC = hextobinary(and());
            registerHex.AC= binaryToHex(AC);
            PC = ADD(PC, one);
            registerHex.PC=binaryToHex(PC);
            console.log(PC,"PC\n",AC,"AC\n", "andtwo");
            decode();
            // break;
        } else if (opcode == 9) {
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory=binaryToHex(memory);
                    AR = code[l].innerText;
                    break;
                }
            for (let y = 0; y < memoryAddress.length; y++)
                if (memoryAddress[y].innerText == AR) {
                    memory = AR;
                    registerHex.memory=binaryToHex(memory);
                    registerHex.DR = code[y].innerText;
                    DR = hextobinary(registerHex.DR)
                }
            AC = ADD(DR, AC);
            registerHex.AC= binaryToHex(AC);
            PC = ADD(PC, one);
            registerHex.PC=binaryToHex(PC);
            console.log(PC,"PC\n",AC,"AC\n", "ADDtwo");
            decode();
            // break;
        } else if (opcode == "A") {
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory=binaryToHex(memory);
                    AR = code[l].innerText;
                    break;
                }
            for (let y = 0; y < memoryAddress.length; y++)
                if (memoryAddress[y].innerText == AR) {
                    memory = AR;
                    registerHex.memory=binaryToHex(memory);
                    registerHex.DR = code[y].innerText;
                    DR = hextobinary(registerHex.DR);
                }
            LDA();
            PC = ADD(PC, one);
            registerHex.PC=binaryToHex(PC);
            console.log(PC,"PC\n",AC,"AC\n", "LDAtwo");
            decode();
            // break;
        } else if (opcode == "B") {
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory=binaryToHex(memory);
                    AR = code[l].innerText;
                    break;
                }
            STA();
            PC = ADD(PC, one);
            registerHex.PC=binaryToHex(PC);
            console.log(PC,"PC\n",AC,"AC\n", "STAtwo");
            led();
            decode();
            // break;
        } else if (opcode == "C") {
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory=binaryToHex(memory);
                    AR = code[l].innerText;
                    break;
                }
            BUN();
            PC = ADD(PC, one);
            registerHex.PC=binaryToHex(PC);
            console.log(PC,"PC\n",AC,"AC\n", "BUNtwo");
            decode();
            // break;
        } else if (opcode == "D") {
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory=binaryToHex(memory);
                    AR = code[l].innerText;
                    break;
                }
            BSA();
            PC = ADD(PC, one);
            registerHex.PC=binaryToHex(PC);
            console.log(PC,"PC\n",AC,"AC\n", "BSAtwo");
            decode();
            // break;
        } else if (opcode == "E") {

            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory=binaryToHex(memory);
                    AR = code[l].innerText;
                    break;
                }
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == AR) {
                    memory = AR;
                    registerHex.memory=binaryToHex(memory)
                    registerHex.DR = code[l].innerText;
                    DR = hextobinary(registerHex.DR);
                }

            ISZ();
            PC = ADD(PC, one);
            registerHex.PC=binaryToHex(PC);
            console.log(PC,"PC\n",AC,"AC\n", "ISZtwo");
            decode();
            // break;
        }

    }

    
}