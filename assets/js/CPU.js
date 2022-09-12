var myClassdisplay = document.getElementsByClassName("segment");
var myClassdisplay2 = document.getElementsByClassName("segment2");
var valu;
var versions = 1;
var errors = 0;
const memory_instructions = [
    ["AND", 0, 8],
    ["ADD", 1, 9],
    ["LDA", 2, "A"],
    ["STA", 3, "B"],
    ["BUN", 4, "C"],
    ["BSA", 5, "D"],
    ["ISZ", 6, "E"],
    ["CALL", "F9"],
    ["LDS", "F7", "FF"],
    ["LDA", "F6", "FE"]

]

// registor instructions
const register_instructions = [
    ["CLA", "7800"],
    ["CLE", "7400"],
    ["CMA", "7200"],
    ["CME", "7100"],
    ["CIR", "7080"],
    ["CIL", "7040"],
    ["INC", "7020"],
    ["SPA", "7010"],
    ["SNA", "7008"],
    ["SZA", "7004"],
    ["SZE", "7002"],
    ["HLT", "7001"],
    ["RET", "7030"]
]

const InputOutput_instructions = [
    ["INP", "F800"],
    ["OUT", "F400"],
    ["SKI", "F200"],
    ["SKO", "F100"],
    ["ION", "F080"],
    ["IOF", "F040"]

]
let sym;
let myString;
let AC = '0000000000000000';
let DR = '0000000000000000';
let AR = '000000000000';
let IR = '0000000000000000';
let PC = '000000000000';
let TR = '0000000000000000';
let memory = '000000000000';
let INPR = '00000000';
let OUTR = '00000000';
let SP = '000001100001';
let memSP = '000000000000';
let registerHex = {
    IR: binaryToHex(IR),
    AC: binaryToHex(AC),
    DR: binaryToHex(DR),
    PC: binaryToHex(PC),
    AR: binaryToHex(AR),
    memory: binaryToHex(AR),
    INPR: "00",
    OUTR: "00",
    SP: hextobinary(SP),
    memSP: binaryToHex(PC)
}


//flag
let FGI = "0";
let FGO = "0";
let Int = "0";
let Z = "0";
let carry = "0";
let N = "0";
let V = "0";
let PSW = "0";
let R = "0";


var opcode;
var opcodeCALL;
var ShowLog = 0;
var code = document.getElementsByClassName("data");
var memoryAddress = document.getElementsByClassName("Address");
const fetchBtn = document.getElementById('fetchdata');
const decodeBtn = document.getElementById('decode');
const executeBtn = document.getElementById('execute');
let len;
let str;
let char;

function writeToflag() {
    var flag = document.getElementsByClassName("flagList");
    flag[0].innerHTML = carry;
    flag[1].innerHTML = Z;
    flag[2].innerHTML = N;
    flag[3].innerHTML = V;
    flag[4].innerHTML = FGI;
    flag[5].innerHTML = FGO;
    flag[6].innerHTML = Int;
    flag[7].innerHTML = PSW;
}

function checkFlag() {
    if (AC == "0000000000000000") {
        Z = "1";
    } else if (AC != "0000000000000000") {
        Z = "0";
    }
    if (AC[0] == "0") {
        N = "0";
    } else if (AC[0] == "1") {
        N = "1";
    }
    writeToflag();
}

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
for (let i = -1; i < 100; i++) {
    // var datacel = storedNames[i + 1];
    let r = document.createElement('tr');
    for (let j = 0; j < 3; j++) {
        let c = document.createElement('td');
        if (i == -1) {
            if (j == 0) {
                c.innerText = 'D-Addrress';
            } else if (j == 1) {
                c.innerText = 'H-Addrress';
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
const items = ['Elements', 'Initial Values', 'T0: AR <- PC', 'T1: IR <- M[AR], PC <-PC+1', 'T2: AR <- IR[0:11]', 'T:', 'T:', 'T:', 'T:'];
const headerItems = ['statements', 'IR', 'AC', 'DR', 'PC', 'AR', 'M[AR]', 'OUTR', 'INPR'];
for (let i = 0; i < 9; i++) {
    let r = document.createElement('tr');
    for (let j = 0; j < 9; j++) {
        let c = document.createElement('td');
        if (j !== 0) {
            if (j == 7) {
                c.classList.add("dis");
                c.classList.add("vThree");
            }
            if (j == 8) {
                c.classList.add("dis");
                c.classList.add("vFour");
            }
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
            if (i > 4)
                c.classList.add('empty');
            c.classList.add(`${i}`);
            // r.classList.add(`${i}`);
        }
        if (i == 1) {
            if (j == 1)
                c.innerHTML = registerHex.IR;
            else if (j == 2)
                c.innerHTML = registerHex.AC;
            else if (j == 3)
                c.innerHTML = registerHex.DR;
            else if (j == 4)
                c.innerHTML = "0x" + registerHex.PC;
            else if (j == 5)
                c.innerHTML = "0x" + registerHex.AR;
            else if (j == 6)
                c.innerHTML = registerHex.memory;
            else if (j == 7)
                c.innerHTML = registerHex.OUTR;
            else if (j == 8)
                c.innerHTML = registerHex.INPR;
        }

        r.appendChild(c);
    }
    regtable.appendChild(r);
}
registerTable.appendChild(regtable);

// flag table
const ftable = document.createElement('table');
const flagTable = document.querySelector('.flagTable');
const header = ['E', 'Z', 'N', 'V', 'FGI', 'FGO', 'IEN', 'PSW'];
for (let o = 0; o < 2; o++) {
    let r = document.createElement('tr');
    for (let j = 0; j < 8; j++) {
        let c = document.createElement('td');
        if (o == 0) {
            c.innerText = header[j];
            c.classList.add('text');
            r.classList.add('sticky');
        }
        if (j == 5) {
            c.classList.add('dis');
            c.classList.add('vThree');

        }
        if (j == 4) {
            c.classList.add('dis');
            c.classList.add('vFour');

        }
        if (j == 6) {
            c.classList.add('dis');
            c.classList.add('vEight');
        }
        if (j == 7) {
            c.classList.add('dis');
            c.classList.add('vEight');
        }
        if (o == 1) {
            c.classList.add('flagList');
            if (j == 0)
                c.innerHTML = "0";
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
            else if (j == 7)
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
    c[0].innerHTML = T;
    c[1].innerText = registerHex.IR;
    c[2].innerText = registerHex.AC;
    c[3].innerText = registerHex.DR;
    c[4].innerText = "0x" + registerHex.PC;
    c[5].innerText = registerHex.AR;
    c[6].innerText = registerHex.memory;
    c[7].innerText = registerHex.OUTR;
    c[8].innerText = registerHex.INPR;
}

// write to flag


var sevenSegment = {
    zero: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "A" || el.classList[1] == "B" || el.classList[1] == "C" || el.classList[1] == "D" || el.classList[1] == "E" || el.classList[1] == "F")
                el.style.display = "block";
        })
    },
    one: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "B" || el.classList[1] == "C")
                el.style.display = "block";
        })
    },
    two: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "A" || el.classList[1] == "B" || el.classList[1] == "D" || el.classList[1] == "E" || el.classList[1] == "G")
                el.style.display = "block";
        })
    },
    three: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "A" || el.classList[1] == "B" || el.classList[1] == "C" || el.classList[1] == "D" || el.classList[1] == "G")
                el.style.display = "block";
        })
    },
    four: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "B" || el.classList[1] == "C" || el.classList[1] == "F" || el.classList[1] == "G")
                el.style.display = "block";
        })
    },
    five: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "A" || el.classList[1] == "C" || el.classList[1] == "D" || el.classList[1] == "F" || el.classList[1] == "G")
                el.style.display = "block";
        })
    },
    six: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "A" || el.classList[1] == "C" || el.classList[1] == "D" || el.classList[1] == "E" || el.classList[1] == "F" || el.classList[1] == "G")
                el.style.display = "block";
        })
    },
    seven: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "A" || el.classList[1] == "B" || el.classList[1] == "C")
                el.style.display = "block";
        })
    },
    eight: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "A" || el.classList[1] == "B" || el.classList[1] == "C" || el.classList[1] == "D" || el.classList[1] == "E" || el.classList[1] == "F" || el.classList[1] == "G")
                el.style.display = "block";
        })
    },
    nine: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "A" || el.classList[1] == "B" || el.classList[1] == "C" || el.classList[1] == "D" || el.classList[1] == "F" || el.classList[1] == "G")
                el.style.display = "block";
        })
    },
    A: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "A" || el.classList[1] == "B" || el.classList[1] == "C" || el.classList[1] == "E" || el.classList[1] == "F" || el.classList[1] == "G")
                el.style.display = "block";
        })
    },
    B: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "C" || el.classList[1] == "D" || el.classList[1] == "E" || el.classList[1] == "F" || el.classList[1] == "G")
                el.style.display = "block";
        })
    },
    C: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "A" || el.classList[1] == "D" || el.classList[1] == "E" || el.classList[1] == "F")
                el.style.display = "block";
        })
    },
    D: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "B" || el.classList[1] == "C" || el.classList[1] == "D" || el.classList[1] == "E" || el.classList[1] == "G")
                el.style.display = "block";
        })
    },
    E: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "A" || el.classList[1] == "F" || el.classList[1] == "D" || el.classList[1] == "E" || el.classList[1] == "G")
                el.style.display = "block";
        })
    },
    F: function (myList) {
        this.lightsOut(myList);
        [].forEach.call(myList, function (el) {
            if (el.classList[1] == "A" || el.classList[1] == "F" || el.classList[1] == "E" || el.classList[1] == "G")
                el.style.display = "block";
        })
    },
    lightsOut: function (myList) {
        [].forEach.call(myList, function (el) {
            el.style.display = "none"
        });
    }
};

function sevensegmentF() {

    for (let index = 0; index < 2; index++) {
        var partOFAC = registerHex.OUTR[index];
        var className;
        if (index == 0)
            className = myClassdisplay;
        else if (index == 1)
            className = myClassdisplay2;
            
        if (partOFAC == "0")
            sevenSegment.zero(className);
        if (partOFAC == "1")
            sevenSegment.one(className);
        if (partOFAC == "2")
            sevenSegment.two(className);
        if (partOFAC == "3")
            sevenSegment.three(className);
        if (partOFAC == "4")
            sevenSegment.four(className);
        if (partOFAC == "5")
            sevenSegment.five(className);
        if (partOFAC == "6")
            sevenSegment.six(className);
        if (partOFAC == "7")
            sevenSegment.seven(className);
        if (partOFAC == "8")
            sevenSegment.eight(className);
        if (partOFAC == "9")
            sevenSegment.nine(className);
        if (partOFAC == "A")
            sevenSegment.A(className);
        if (partOFAC == "B")
            sevenSegment.B(className);
        if (partOFAC == "C")
            sevenSegment.C(className);
        if (partOFAC == "D")
            sevenSegment.D(className);
        if (partOFAC == "E")
            sevenSegment.E(className);
        if (partOFAC == "F")
            sevenSegment.F(className);
    }
}

function led() {
    var led = document.getElementsByClassName("circle");
    var ACLed = AC.split('');
    for (let k = 0; k < ACLed.length; k++) {
        if (ACLed[k] == 1) {
            led[k].style.backgroundColor = "#d2bc0d";
        } else {
            led[k].style.backgroundColor = "white";
        }

    }
}
var PCFake;
var check = 0;

function InputINPR() {
    PCFake = PC;
    document.getElementById("InputINPR").disabled = false;
    document.getElementById("OK").disabled = false;
}
var l = 1;

function OK() {
    check = 1;
    var a = 0;
    var DataINP = document.getElementById("InputINPR");
    if (DataINP.value.length > 2) {
        DataINP.value = "";
        alert("! please enter two hexadecimal numbers !");
        a = 1;
    } else {

        var SplitData = DataINP.value.split('');
        for (let index = 0; index < SplitData.length; index++) {
            SplitData[index] = SplitData[index].toUpperCase();
            if (SplitData[index] == "0" || SplitData[index] == "1" || SplitData[index] == "2" || SplitData[index] == "3" || SplitData[index] == "4" || SplitData[index] == "5" ||
                SplitData[index] == "6" || SplitData[index] == "7" || SplitData[index] == "8" || SplitData[index] == "9" || SplitData[index] == "A" || SplitData[index] == "B" ||
                SplitData[index] == "C" || SplitData[index] == "D" || SplitData[index] == "E" || SplitData[index] == "F") {

            } else {
                DataINP.value = "";
                alert("! please enter hexadecimal numbers !");
                a = 1;
                break;
            }
        }
    }
    if (a == 0) {
        registerHex.INPR = DataINP.value.toUpperCase();
        INP();
        FGI = "1";
        document.getElementById("InputINPR").disabled = true;
        document.getElementById("OK").disabled = true;


    } else if (a == 1) {
        InputINPR();
    }


}

function turnOFFled() {
    var led = document.getElementsByClassName("circle");
    var ACLed = AC.split('');
    for (let k = 0; k < ACLed.length; k++) {
        led[k].style.backgroundColor = "white";
    }
}



function writeLog(symbol, level) {
    var tab = document.getElementById("log");
    let c = document.createElement('td');
    for (let index = 0; index < 3; index++) {
        let r = document.createElement('tr');
        if (index == 0 && index == level) {
            c.innerText = `Fetch \n AR <= PC \n PC <= PC + 1 \n IR <= M[AR]`;
            r.classList.add('logList');
            r.prepend(c);
            tab.prepend(r);
        } else if (index == 1 && index == level) {
            if (opcode == "8" || opcode == "9" || opcode == "A" || opcode == "B" || opcode == "C" || opcode == "D" || opcode == "E")
                c.innerText = `Decode \n AR <= IR[0:11] \n ${symbol} \n  AR <-M[AR]`;
            else if (opcode == "7")
                if (symbol == "RET")
                    c.innerText = `Decode \n ${symbol}`;
                else
                    c.innerText = `Decode \n register instruction \n ${symbol}`;

            else if (opcode == "F")
                if (opcodeCALL == "9" || opcodeCALL == "6" || opcodeCALL == "E" || opcodeCALL == "F" || opcodeCALL == "7")
                    c.innerText = `Decode \n ${symbol}`;
                else
                    c.innerText = `Decode \n Input Output instruction \n ${symbol}`;

            else
                c.innerText = `Decode \n AR <= IR[0:11] \n ${symbol}`;

            r.classList.add('logList');
            r.prepend(c);
            tab.prepend(r);
        } else if (index == 2 && index == level) {
            if (l == 0) {
                let w = document.createElement('td');
                w.classList.add('space');
                r.appendChild(w);
                tab.appendChild(r);
                c.innerText = `execute \n  ${myString}`;
                r.classList.add('logList');
                r.classList.add('logexecute');
                r.appendChild(c);
                tab.appendChild(r);
                let z = document.createElement('td');
                z.classList.add('space');
                r.appendChild(z);
                tab.appendChild(r);
                l = 1;
            } else {
                c.innerText = `execute \n  ${myString}`;
                r.classList.add('logList');
                r.classList.add('logexecute');
                r.prepend(c);
                tab.prepend(r);
                let z = document.createElement('td');
                z.classList.add('space');
                r.prepend(z);
                tab.prepend(r);
            }
        } else if (index == 0 && level == 4) {

            let w = document.createElement('td');
            w.classList.add('space');
            r.prepend(w);
            tab.prepend(r);
            if (ShowLog == 2) {
                c.innerText = `Enable internal interrupt \n M[98] <- PC \n pc <- 99 \n R <- 0 \n Int <- 0`;

            }
            else if (ShowLog == 1) {
                c.innerText = `Enable I/O interrupt \n M[98] <- PC \n pc <- 99 \n R <- 0 \n Int <- 0`;

            }
            r.classList.add('logList');
            r.classList.add('logexecute');
            r.prepend(c);
            tab.prepend(r);
            let z = document.createElement('td');
            z.classList.add('space');
            r.prepend(z);
            tab.prepend(r);
            l = 1;

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
        outcome = arr.join('');
        hexadecimal = outcome;
    }
    if (hexadecimal.length > 3) {
        hexadecimal = hexadecimal.split('').slice(-4).join('');
    }
    return hexadecimal;
}

function hextobinary(hex) {
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

function error(nameAssemble) {
    alert(`You are in version ${versions} and you cannot use ${nameAssemble}`);
}

// Input Output instruction 

function OUT() {
    if (FGO == "1") {
        var n = registerHex.AC;
        let numberOfZero = [];
        for (let i = 0; i < 4 - n.length; i++) {
            numberOfZero.push("0");
        }
        let arr = n.split('');
        arr.splice(0, 0, ...numberOfZero);
        arr = arr.join('')
        OUTR = AC.slice(8, 16);
        registerHex.OUTR = arr.slice(2, 4);
        FGO = "0";
        sevensegmentF();
        setTimeout(function () {
            FGO = "1";
            checkFlag();
        }, 5000);

    } else
        alert("go to go")
}

function SKO() {
    var one = "1";
    if (FGO == "1") {
        PC = ADD(PC, one);
        registerHex.PC=binaryToHex(PC);
    }
}

function SKI() {
    var one = "1";
    if (FGI == "1") {
        PC = ADD(PC, one);
        registerHex.PC = binaryToHex(PC);
    }
}

function INP() {
    partOFAC = registerHex.AC.slice(0, 2);
    registerHex.AC = partOFAC + registerHex.INPR;
    AC = hextobinary(registerHex.AC);
    if (PC != PCFake)
        l = 0;
    writeTotable("5", "T3: AC(0-7) <-INPR ");
    myString = " AC(0-7) <-INPR\n, FGI <- 0";
    writeLog(sym, 2);
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
    if (carry == "0")
        carry = "1";
    else if (carry == "1") {
        carry = "0";
    }
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
    AC = ADDlogic(AC, one);
    registerHex.AC = binaryToHex(AC);
}

function SPA() {
    var one = "1";
    var ACsplit = AC.split('').reverse();
    if (ACsplit[15] == 0)
        PC = ADD(PC, one);
    registerHex.PC = binaryToHex(PC);

}

function SNA() {
    var one = "1";
    var ACsplit = AC.split('').reverse();
    if (ACsplit[15] == 1)
        PC = ADD(PC, one);
    registerHex.PC = binaryToHex(PC);
}

function SZA() {
    var one = "1";
    if (AC == '0000000000000000') {
        PC = ADD(PC, one);
        registerHex.PC = binaryToHex(PC);
    }
}

function SZE() {
    var one = "1";
    if (carry == '0') {
        PC = ADD(PC, one);
        registerHex.PC = binaryToHex(PC);
    }
}

function HLT() {
    document.getElementById("back").classList.add("shutDown");
    document.getElementById("h").innerText = "CPU OFF";
    disableBtn(fetchBtn);
    disableBtn(executeBtn);
    disableBtn(decodeBtn);
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
        E = 1 < x + y + E;
    };
    if (E) {
        result.push(1);
        Cout = 1;
    }

    if (result.length > 16)
        return result.reverse().splice(result.length - 16).join('');
    else
        return result.reverse().join('');

};

function ADDlogic(MemStr, ACStr) {
    const result = [];
    let E = 0;
    let lenMem = MemStr.length;
    let lenAC = ACStr.length;
    if (ACStr.length == 1) {
        ACStr = "0000000000000001"
    }
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
        E = 1 < x + y + E;
    };
    if (MemStr[0] == "1" & ACStr[0] == "1") {
        if (result[result.length - 1] == "1") {
            V = 0;
        } else if (result[result.length - 1] == "0") {
            V = 1;
        }
    }
    if (MemStr[0] == "0" & ACStr[0] == "0") {
        if (result[result.length - 1] == "0") {
            V = 0;
        } else if (result[result.length - 1] == "1") {
            V = 1;
        }
    }
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

function minus(pars) {
    pars = parseInt(pars, 2).toString(10);
    pars = Number(pars) - 1;
    console.log(pars, ";;;;fhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    pars = convertToBinary(pars);
    console.log(pars, ";;;;fhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    return pars;
}
// program to convert decimal to binary
function convertToBinary(x) {
    let bin = 0;
    let rem, i = 1,
        step = 1;
    while (x != 0) {
        rem = x % 2;
        console.log(
            `Step ${step++}: ${x}/2, Remainder = ${rem}, Quotient = ${parseInt(x / 2)}`
        );
        x = parseInt(x / 2);
        bin = bin + rem * i;
        i = i * 10;
    }
    return bin;
}

function LDA() {
    AC = DR;
    registerHex.AC = binaryToHex(AC);
}

function STA() {
    for (let l = 0; l < memoryAddress.length; l++) {
        if (memoryAddress[l].innerText == registerHex.AR) {
            code[l].innerText = binaryToHex(AC);
            memory = hextobinary(code[l].innerText);
            registerHex.memory = code[l].innerText;
        }

    }
}

function BUN() {
    PC = AR;
    registerHex.PC = binaryToHex(AR);
}

function BSA() {
    for (let l = 0; l < memoryAddress.length; l++)
        if (memoryAddress[l].innerText == registerHex.AR) {
            code[l].innerText = registerHex.PC;
            memory = hextobinary(code[l].innerText);
            registerHex.memory = code[l].innerText;
        }
    var one = "1";
    AR = ADD(AR, one);
    registerHex.AR = binaryToHex(AR);
    PC = AR;
    registerHex.PC = registerHex.AR;
}

function ISZ() {
    var one = "1";
    DR = ADDlogic(DR, one);
    registerHex.DR = binaryToHex(DR);
    writeTotable("6", "T4: DR <- DR + 1");
    if (DR == "0000000000000000") {
        PC = ADD(PC, one);
        registerHex.PC = binaryToHex(PC);
    }


}

function CALL() {
    var SPDecimal = parseInt(SP, 2).toString(10);
    code[SPDecimal].innerText = registerHex.PC;
    memSP = hextobinary(code[SPDecimal].innerText);
    registerHex.memSP = code[SPDecimal].innerText;
    SP = minus(SP);
    registerHex.SP = binaryToHex(SP);
    PC = AR;
    registerHex.PC = binaryToHex(AR);
    console.log(SP, "*************************************************8")
}

function RET() {
    var SPDecimal = parseInt(SP, 2).toString(10);
    SPDecimal = Number(SPDecimal) + 1;
    SP = convertToBinary(SPDecimal);
    registerHex.PC = code[SPDecimal].innerText;
    PC = hextobinary(registerHex.PC);
    code[SPDecimal].innerText = "0000"
    console.log(registerHex.PC, code[SPDecimal], SP, "*************************************************8")

}

function LDS() {
    SP = DR;
    registerHex.SP = binaryToHex(SP);
    console.log(SP, "SPPPPPPPPPPPPPPPPPPPPPPPPPP")
}

function STS() {
    console.log("////////////////////")
    for (let l = 0; l < memoryAddress.length; l++) {
        console.log(registerHex.AR, "ARRRRRR")
        if (memoryAddress[l].innerText == registerHex.AR) {
            code[l].innerText = binaryToHex(SP);
            memSP = hextobinary(code[l].innerText);
            registerHex.memSP = code[l].innerText;
        }

    }
}

function ION() {
    Int = "1";
}

function IOF() {
    Int = "0";
}


//fetch************************************************

enableBtn(fetchBtn);
disableBtn(executeBtn);
disableBtn(decodeBtn);
var checkPC = "0";
function fetch() {
    console.log(R, "[[[[[[[")
    if (R == "1") {
        checkPC = "1";
        code[98].innerText = registerHex.PC;
        PC = "000001100011";
        registerHex.PC = binaryToHex(PC);
        Int = "0";
        R = "0";
        checkFlag();
        writeLog(" ", 4);
    }
    var emptyRegister = document.querySelectorAll(".regList");
    var emptytable = document.querySelectorAll(".empty");
    [].forEach.call(emptyRegister, function (el) {
        el.innerText = "";
    });
    [].forEach.call(emptytable, function (el) {
        el.innerText = "T :";
    });
    var one = "1";
    registerHex.AR = "0x" + binaryToHex(PC); // AR <= PC   
    AR = PC; // AR <= PC
    writeTotable("2", "T0: AR <- PC");
    PC = ADD(PC, one);
    registerHex.PC = binaryToHex(PC); //PC <= PC +1
    if (registerHex.PC == "064") {
        registerHex.PC == "000";
        PC = hextobinary(registerHex.PC);
    }
    for (let index = 0; index < memoryAddress.length; index++) {
        if (memoryAddress[index].innerText == registerHex.AR) {
            code[index].classList.add("border");
            memory = hextobinary(code[index].innerText);
            registerHex.memory = code[index].innerText;
            registerHex.IR = registerHex.memory; //IR <= M[AR]
            IR = memory; //IR <= M[AR]

            writeTotable("3", "T1: IR <- M[AR], PC <-PC+1");
        } else
            code[index].classList.remove("border");
    }
    writeLog(" ", 0);
    enableBtn(decodeBtn);
    disableBtn(executeBtn);
    disableBtn(fetchBtn);
}

//decode**************************************************

var PSWfake = "1";

function decode() {
    opcode = registerHex.IR.split('')[0].toUpperCase();
    opcodeCALL = registerHex.IR.split('')[1].toUpperCase();
    if (opcode == "7") {
        for (let j = 0; j < register_instructions.length; j++) {
            if (register_instructions[j][1] == registerHex.IR) {
                PSWfake = "0";
                valu = register_instructions[j][0];
                sym = valu;
                if (valu == "SPA" || valu == "SNA" || valu == "SZA" || valu == "SZE") {
                    if (versions > 1)
                        sym = valu;
                    else
                        errors = 1;
                } else if (valu == "RET") {
                    if (versions > 5)
                        sym = valu;
                    else
                        errors = 1;
                } else
                    sym = valu;
            }
        }
    } else if (opcode == "F") {
        if (opcodeCALL == "9") {
            PSWfake = "0";
            if (versions > 5) {
                valu = "CALL";
                registerHex.AR = "0x" + "0" + registerHex.IR.slice(2, 4); // AR<=IR[0,11]
                AR = hextobinary(registerHex.AR);
                writeTotable("4", "T2: AR <- IR[0:11]");
                sym = valu;
            } else
                errors = 1;
        } else if (opcodeCALL == "7") {
            PSWfake = "0";
            sym = "LDS";
            if (versions > 6) {
                valu = "LDS";
                registerHex.AR = "0x" + "0" + registerHex.IR.slice(2, 4); // AR<=IR[0,11]
                AR = hextobinary(registerHex.AR);
                writeTotable("4", "T2: AR <- IR[0:11]");
                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == registerHex.AR) {
                        memory = hextobinary(code[l].innerText);
                        registerHex.memory = code[l].innerText;
                        registerHex.DR = code[l].innerText;
                        DR = hextobinary(registerHex.DR);
                    }
            } else
                errors = 1;
        } else if (opcodeCALL == "F") {
            PSWfake = "0";
            sym = "LDS";
            if (versions > 6) {
                registerHex.AR = "0x" + "0" + registerHex.IR.slice(2, 4); // AR<=IR[0,11]
                AR = hextobinary(registerHex.AR);
                writeTotable("4", "T2: AR <- IR[0:11]");
                valu = "LDS";
                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == registerHex.AR) {
                        memory = hextobinary(code[l].innerText);
                        registerHex.memory = code[l].innerText;
                        AR = memory;
                        registerHex.AR = "0x" + registerHex.memory;
                        break;
                    }
                writeTotable("5", "T3: AR <-M[AR]");
                for (let y = 0; y < memoryAddress.length; y++) {
                    if (memoryAddress[y].innerText == registerHex.AR) {
                        memory = hextobinary(code[y].innerText);
                        registerHex.memory = code[y].innerText;
                        registerHex.DR = code[y].innerText;
                        DR = hextobinary(registerHex.DR);
                    }
                }
            } else
                errors = 1;
        } else if (opcodeCALL == "6") {
            PSWfake = "0";
            sym = "STS";
            if (versions > 6) {
                registerHex.AR = "0x" + "0" + registerHex.IR.slice(2, 4); // AR<=IR[0,11]
                AR = hextobinary(registerHex.AR);
                writeTotable("4", "T2: AR <- IR[0:11]");
                valu = "STS";
            } else
                errors = 1;
        } else if (opcodeCALL == "E") {
            PSWfake = "0";
            sym = "STS";
            if (versions > 6) {
                registerHex.AR = "0x" + "0" + registerHex.IR.slice(2, 4); // AR<=IR[0,11]
                AR = hextobinary(registerHex.AR);
                writeTotable("4", "T2: AR <- IR[0:11]");
                sym = "STS";
                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == registerHex.AR) {
                        memory = hextobinary(code[l].innerText);
                        registerHex.memory = code[l].innerText;
                        AR = memory;
                        registerHex.AR = "0x" + registerHex.memory;
                        break;
                    }
            } else
                errors = 1;
        } else {
            for (let j = 0; j < InputOutput_instructions.length; j++) {
                if (InputOutput_instructions[j][1] == registerHex.IR) {
                    PSWfake = "0";
                    valu = InputOutput_instructions[j][0];
                    // sym = valu;
                    if (valu == "SKO" || valu == "OUT") {
                        if (versions > 2)
                            sym = valu;
                        else
                            errors = 1;
                    } else if (valu == "SKI" || valu == "INP") {
                        if (versions > 3) {
                            sym = valu;
                        } else
                            errors = 1;
                    } else if (valu == "ION" || valu == "IOF") {
                        if (versions > 7) {
                            sym = valu;
                        } else
                            errors = 1;
                    } else
                        sym = valu;
                }
            }
        }
    } else {
        registerHex.AR = "0x" + registerHex.IR.slice(1, 4); // AR<=IR[0,11]
        AR = hextobinary(registerHex.AR);
        writeTotable("4", "T2: AR <- IR[0:11]");
        if (opcode == 0) {

            sym = "AND";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == registerHex.AR) {
                    PSWfake = "0";
                    memory = hextobinary(code[l].innerText);
                    registerHex.memory = code[l].innerText;
                    registerHex.DR = code[l].innerText;
                    DR = hextobinary(registerHex.DR);
                }


        } else if (opcode == 1) {

            sym = "ADD";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == registerHex.AR) {
                    PSWfake = "0";
                    memory = hextobinary(code[l].innerText);
                    registerHex.memory = code[l].innerText;
                    registerHex.DR = code[l].innerText;
                    DR = hextobinary(registerHex.DR);
                }

        } else if (opcode == 2) {
            sym = "LDA";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == registerHex.AR) {
                    PSWfake = "0";
                    memory = hextobinary(code[l].innerText);
                    registerHex.memory = code[l].innerText;
                    registerHex.DR = code[l].innerText;
                    DR = hextobinary(registerHex.DR);
                }
        } else if (opcode == 3) {
            sym = "STA";
            PSWfake = "0";
        } else if (opcode == 4) {

            if (versions > 1) {
                sym = "BUN";
                PSWfake = "0";
            } else
                errors = 1;
        } else if (opcode == 5) {
            if (versions > 4) {
                sym = "BSA";
                PSWfake = "0";
            } else
                errors = 1;

        } else if (opcode == 6) {
            sym = "ISZ";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == registerHex.AR) {
                    PSWfake = "0";
                    memory = hextobinary(code[l].innerText);
                    registerHex.memory = code[l].innerText;
                    registerHex.DR = code[l].innerText;
                    DR = hextobinary(registerHex.DR);
                }
        } else if (opcode == 8) {
            sym = "AND";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == registerHex.AR) {
                    PSWfake = "0";
                    memory = hextobinary(code[l].innerText);
                    registerHex.memory = code[l].innerText;
                    AR = memory;
                    registerHex.AR = "0x" + registerHex.memory;
                    break;
                }
            writeTotable("5", "T3: AR <-M[AR]");
            for (let y = 0; y < memoryAddress.length; y++) {
                if (memoryAddress[y].innerText == registerHex.AR) {
                    // PSWfake = "0";
                    memory = hextobinary(code[y].innerText);
                    registerHex.memory = code[y].innerText;
                    registerHex.DR = code[y].innerText;
                    DR = hextobinary(registerHex.DR);
                }
            }

        } else if (opcode == 9) {
            sym = "ADD";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == registerHex.AR) {
                    PSWfake = "0";
                    memory = hextobinary(code[l].innerText);
                    registerHex.memory = code[l].innerText;
                    AR = memory;
                    registerHex.AR = "0x" + registerHex.memory;
                    break;
                }
            writeTotable("5", "T3: AR <-M[AR]");
            for (let y = 0; y < memoryAddress.length; y++) {
                if (memoryAddress[y].innerText == registerHex.AR) {
                    // PSWfake = "0";
                    memory = hextobinary(code[y].innerText);
                    registerHex.memory = code[y].innerText;
                    registerHex.DR = code[y].innerText;
                    DR = hextobinary(registerHex.DR);
                }
            }
        } else if (opcode == "A") {
            sym = "LDA";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == registerHex.AR) {
                    PSWfake = "0";
                    memory = hextobinary(code[l].innerText);
                    registerHex.memory = code[l].innerText;
                    AR = memory;
                    registerHex.AR = "0x" + registerHex.memory;
                    break;
                }
            writeTotable("5", "T3: AR <-M[AR]");
            for (let y = 0; y < memoryAddress.length; y++) {
                if (memoryAddress[y].innerText == registerHex.AR) {
                    memory = hextobinary(code[y].innerText);
                    registerHex.memory = code[y].innerText;
                    registerHex.DR = code[y].innerText;
                    DR = hextobinary(registerHex.DR);
                }
            }
        } else if (opcode == "B") {
            sym = "STA";
            for (let l = 0; l < memoryAddress.length; l++) {
                console.log(memoryAddress[l].innerText, PSW, "lfffffffffffffffffffffffffffffffffff")
                if (memoryAddress[l].innerText == registerHex.AR) {
                    PSWfake = "0";
                    memory = hextobinary(code[l].innerText);
                    registerHex.memory = code[l].innerText;
                    AR = memory;
                    registerHex.AR = "0x" + registerHex.memory;
                    break;
                }
            }
            writeTotable("5", "T3: AR <-M[AR]");
        } else if (opcode == "C") {
            if (versions > 4) {
                sym = "BUN";
                for (let l = 0; l < memoryAddress.length; l++) {
                    if (memoryAddress[l].innerText == registerHex.AR) {
                        PSWfake = "0";
                        memory = hextobinary(code[l].innerText);
                        registerHex.memory = code[l].innerText;
                        AR = memory;
                        registerHex.AR = "0x" + registerHex.memory;
                        break;
                    }
                }
                writeTotable("5", "T3: AR <-M[AR]");
            } else
                errors = 1;
        } else if (opcode == "D") {
            if (versions > 4) {
                sym = "BSA";
                for (let l = 0; l < memoryAddress.length; l++)
                    if (memoryAddress[l].innerText == registerHex.AR) {
                        PSWfake = "0";
                        memory = hextobinary(code[l].innerText);
                        registerHex.memory = code[l].innerText;
                        AR = memory;
                        registerHex.AR = "0x" + registerHex.memory;
                        break;
                    }
                writeTotable("5", "T3: AR <-M[AR]");
            } else
                errors = 1;

        } else if (opcode == "E") {
            sym = "ISZ";
            for (let l = 0; l < memoryAddress.length; l++)
                if (memoryAddress[l].innerText == registerHex.AR) {
                    PSWfake = "0";
                    memory = hextobinary(code[l].innerText);
                    registerHex.memory = code[l].innerText;
                    AR = memory;
                    registerHex.AR = "0x" + registerHex.memory;
                    break;
                }
            writeTotable("5", "T3: AR <-M[AR]");
            for (let y = 0; y < memoryAddress.length; y++) {
                if (memoryAddress[y].innerText == registerHex.AR) {
                    memory = hextobinary(code[y].innerText);
                    registerHex.memory = code[y].innerText;
                    registerHex.DR = code[y].innerText;
                    DR = hextobinary(registerHex.DR);
                }
            }
        }

    }
    if (PSWfake == "1" && Int == "0") {
        PSW = "1";
        document.getElementById("back").classList.add("shutDown");
        document.getElementById("h").innerText = "CPU OFF";
        alert("CPU stoped beacuse PSW = 1")
        disableBtn(executeBtn);
        disableBtn(decodeBtn);
        disableBtn(fetchBtn);
        checkFlag();
    } else if (PSWfake == "1" && Int == "0") {
        PSW = "1";
        if (errors == 1) {
            errors = 0;
            error(sym)
            disableBtn(executeBtn);
            disableBtn(decodeBtn);
            disableBtn(fetchBtn);
        } else {
            enableBtn(executeBtn);
            disableBtn(decodeBtn);
            disableBtn(fetchBtn);
            writeLog(sym, 1);
            checkFlag();
        }
    } else {


        PSW = "0";
        PSWfake = "1";

        if (errors == 1) {
            errors = 0;
            error(sym)
            disableBtn(executeBtn);
            disableBtn(decodeBtn);
            disableBtn(fetchBtn);
        } else {
            enableBtn(executeBtn);
            disableBtn(decodeBtn);
            disableBtn(fetchBtn);
            writeLog(sym, 1);
            checkFlag();
        }

    }

}

//execute**************************************************
// var g=0;
function execute() {
    enableBtn(fetchBtn);
    disableBtn(decodeBtn);
    disableBtn(executeBtn);
    if (opcode == "7") {

        if (valu == "CLA") {
            CLA();
            writeTotable("5", "T3: AC <- 0");
            myString = " AC <- 0";

        } else if (valu == "CLE") {
            CLE();
            writeTotable("5", "T3: E <- 0");
            myString = " E <- 0";

        } else if (valu == "CMA") {
            CMA();
            writeTotable("5", "T3: AC <- complement(AC)");
            myString = " AC <- complement(AC)";

        } else if (valu == "CME") {
            CME();
            writeTotable("5", "T3: E <- complement(E)");
            myString = " E <- complement(E)"

        } else if (valu == "CIR") {
            CIR();
            writeTotable("5", "T3: AC <- shr AC\n, AC(15) <- E\n ,E <- AC(0)");
            myString = " AC <- shr AC\n AC(15) <- E\n E <- AC(0)";

        } else if (valu == "CIL") {
            CIL();
            writeTotable("5", "T3: AC <- shl AC\n, AC(0) <- E\n,E <- AC(15)");
            myString = " AC <- shl AC\n AC(0) <- E\n E <- AC(15)";

        } else if (valu == "INC") {
            INC();
            writeTotable("5", "T3: AC <- AC + 1");
            myString = " AC <- AC + 1"

        } else if (valu == "SPA") {
            SPA();
            writeTotable("5", "T3:If( AC(15) = 0)\n,then ( PC <- PC + 1)");
            myString = "If( AC(15) = 0)\n  then ( PC <- PC + 1)";

        } else if (valu == "SNA") {
            SNA();
            writeTotable("5", "T3:If( AC(15) = 1)\n,then ( PC <- PC + 1)");
            myString = "If( AC(15) = 1)\n then ( PC <- PC + 1)";

        } else if (valu == "SZA") {
            SZA();
            writeTotable("5", "T3:If( AC = 0)\n,then ( PC <- PC + 1)");
            myString = "If( AC = 0)\n then ( PC <- PC + 1)";

        } else if (valu == "SZE") {
            SZE();
            writeTotable("5", "T3:If( E = 0)\n,then ( PC <- PC + 1)");
            myString = "If( E = 0)\n then ( PC <- PC + 1)";
        } else if (valu == "HLT") {
            HLT();
            writeTotable("5", "T3:S <- 0");
            myString = "T3:S <- 0";
        } else if (valu == "RET") {
            RET();
            writeTotable("5", "T3:PC <- M[SP], SP <- SP - 1 ");
            myString = " T3:PC <- M[SP], SP <- SP - 1";
        }
    }
    if (opcode == "F") {
        if (valu == "INP") {

            if (FGI == 1) {
                FGI = "0";
                checkFlag();
                InputINPR();
                writeTotable("5", "T3: con not execute until you give a valu to the input");
                myString = "con not execute until you give a valu to the input";
            } else {
                alert("we are taking data");

            }
        } else if (valu == "OUT") {
            OUT();
            writeTotable("5", "T3: OUTR <- AC(0-7)");
            myString = " OUTR <- AC(0-7)\n, FGO <- 0";
        } else if (valu == "SKI") {
            SKI();
            writeTotable("5", "T3:If(FGI = 1) then (PC <- PC + 1)");
            myString = " If(FGI = 1) then (PC <- PC + 1)";

        } else if (valu == "SKO") {
            SKO();
            writeTotable("5", "T3:If(FGO = 1) then (PC <- PC + 1)");
            myString = " If(FGO = 1) then (PC <- PC + 1)";

        } else if (valu == "ION") {
            console.log("execut%%%%%%%%%%%%%%%%%%%%%%")
            ION();
            writeTotable("5", "T3: IEN <- 1");
            myString = "IEN <- 1";
        } else if (valu == "IOF") {
            IOF();
            writeTotable("5", "T3: IEN <- 0");
            myString = "IEN <- 0";
        } else if (valu == "CALL") {
            console.log("execut%%%%%%%%%%%%%%%%%%%%%%")
            CALL();
            writeTotable("5", "T3: M[SP] <- PC , SP <- SP + 1");
            myString = "  M[SP] <- PC , SP <- SP + 1";
        } else if (valu == "LDS") {
            writeTotable("6", "T4: DR <-M[AR]");
            LDS();
            writeTotable("7", "T5: SP <- DR");
            myString = "SP <- DR";
        } else if (valu == "STS") {
            sym = "STS";
            STS();
            writeTotable("5", "T3: M[AR] <- SP");
            myString = " M[AR] <- SP";
        }
    }
    if (opcode == 0) {
        sym = "AND";
        writeTotable("5", "T3: DR <-M[AR]");
        AC = hextobinary(and());
        registerHex.AC = binaryToHex(AC);
        writeTotable("6", "T4: AC <- AC ^ DR");
        myString = "AC <- AC ^ DR";
    } else if (opcode == 1) {
        sym = "ADD";
        writeTotable("5", "T3: DR <-M[AR]");
        AC = ADDlogic(DR, AC);
        registerHex.AC = binaryToHex(AC);
        writeTotable("6", "T4: AC <- AC + DR");
        myString = "AC <- AC + DR";
    } else if (opcode == 2) {
        sym = "LDA";
        writeTotable("5", "T3: DR <-M[AR]");
        LDA();
        writeTotable("6", "T4: AC <- DR");
        myString = "AC <- DR";

    } else if (opcode == 3) {
        sym = "STA";
        STA();
        writeTotable("5", "T3: M[AR] <- AC");
        myString = " M[AR] <- AC";
    } else if (opcode == 4) {
        sym = "BUN";
        BUN();
        writeTotable("5", "T3: PC  <- AR");
        myString = "PC  <- AR";
    } else if (opcode == 5) {
        sym = "BSA";
        BSA();
        writeTotable("5", "T3: M[AR] <- PC\nAR <- AR + 1");
        writeTotable("6", "T4: PC <- AR");
        myString = "PC <- AR";
    } else if (opcode == 6) {
        sym = "ISZ";
        writeTotable("5", "T3: DR <-M[AR]");
        ISZ();
        writeTotable("6", "T4: M[AR] <- DR IF(DR=0) ,\n then (PC <- PC + 1)");
        myString = " M[AR] <- DR IF(DR=0) ,\n then (PC <- PC + 1)";

    } else if (opcode == 8) {
        sym = "AND";
        writeTotable("6", "T4: DR <-M[AR]");
        AC = hextobinary(and());
        registerHex.AC = binaryToHex(AC);
        writeTotable("7", "T5: AC <- AC ^ DR");
        myString = "AC <- AC ^ DR";

    } else if (opcode == 9) {
        sym = "ADD";
        writeTotable("6", "T4: DR <-M[AR]");
        AC = ADDlogic(DR, AC);
        registerHex.AC = binaryToHex(AC);
        writeTotable("7", "T5: AC <- AC + DR");
        myString = "AC <- AC + DR";
    } else if (opcode == "A") {
        sym = "LDA";
        writeTotable("6", "T4: DR <-M[AR]");
        LDA();
        writeTotable("7", "T5: AC <- DR");
        myString = "AC <- DR";
    } else if (opcode == "B") {
        sym = "STA";
        STA();
        writeTotable("6", "T4: M[AR] <- AC");
        myString = " M[AR] <- AC";
    } else if (opcode == "C") {
        sym = "BUN";
        BUN();
        writeTotable("6", "T4: PC  <- AR");
        myString = "PC  <- AR";

    } else if (opcode == "D") {
        sym = "BSA";
        BSA();
        writeTotable("6", "T4: M[AR] <- PC\nAR <- AR + 1");
        writeTotable("7", "T5: PC <- AR");
        myString = "PC <- AR";
    } else if (opcode == "E") {
        sym = "ISZ";
        writeTotable("6", "T4: DR <-M[AR]");
        ISZ();
        writeTotable("7", "T5: M[AR] <- DR IF(DR=0),\nthen (PC <- PC + 1)");
        myString = " M[AR] <- DR IF(DR=0) ,\n then (PC <- PC + 1)";

    }


    checkFlag();
    led();
    writeLog(sym, 2);
    if (Int == "1") {
        if (FGI == "1" || FGO == "1") {
            R = "1";
            ShowLog = 1;
            console.log(R, "[[ffffffffffffffff[[[[[")
        }
        else if (PSW == "1" || V == "1") {
            R = "1";
            ShowLog = 2;
        }
    }
}