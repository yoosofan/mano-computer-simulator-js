// one methode
var count = 1;
var adrBox = document.getElementById("address");
const adr = document.getElementsByClassName("Address");
const ins = document.getElementById("insert");
var elementt = document.getElementsByClassName("data");
var getDataTextarea = document.getElementById("textarea");
var getDataAssembler = document.getElementById("assembler");
var instructionAssembler;
// var emptyRegister=document.querySelectorAll(".regList");
ins.addEventListener("click", insert);

function natural() {
    document.getElementById("naturalInsertion").style.visibility = "visible";
    resetMem();
}


function insert() {
    // console.log(count, ";;;")
    var data = document.getElementById("firstInput").value;
    if (data == "") {} else
        elementt[count - 1].innerText = data;

    console.log(data, "llllfjfhdjfgdj")
    adrBox.innerText = adr[count].innerText;
    count++;
    if (count == 100)
        count = 0;
    document.getElementById("firstInput").value = "";
}




function Bazdid() {
    if (localStorage.clickcount < 4) {
        localStorage.clickcount = Number(localStorage.clickcount) + 1;
    } else {
        localStorage.clickcount = 0;
    }
    return localStorage.clickcount;
}

const click = document.getElementById("submit");
click.addEventListener("click", store);
const local = document.getElementById("localstore");

var dataStore = [];

function store() {
    var tag;
    for (let b = 0; b < 100; b++) {
        console.log(elementt[b].innerText)
        tag = elementt[b].innerText;
        if (tag == "0000")
            if (b == 99)
                dataStore[b] = " ,";
            else
                dataStore[b] = " ";
        else
        if (b == 99)
            dataStore[b] = tag + ",";
        else
            dataStore[b] = tag;
    }
    getDataTextarea.value = dataStore;
}

function localstore() {
    var array = [10];
    var number = Bazdid();
    array[number] = getDataTextarea.value;
    // console.log(getDataTextarea.value, "datastor")
    localStorage.setItem(`DataFile${number}`, JSON.stringify(array[number]));
    alert("The data was saved as a" + `DataFile${number}`);
    getDataTextarea.value = "";
    var list = document.getElementsByClassName("listData");
    for (let i = listTest.length; i < 10; i++) {
        let o = i - 2;
        var storedNames = JSON.parse(localStorage.getItem(`DataFile${o}`));
        if (storedNames == null) {} else {
            list[i].innerHTML = `DataFile${o}`;
            list[i].onclick = function () {
                var namelist = this.innerHTML;
                var storedNames = JSON.parse(localStorage.getItem(namelist));
                console.log(storedNames, "lksaka");
                getDataTextarea.value = storedNames;
            }
        }
    }
}

// list test
var list = document.getElementsByClassName("listData");
for (let i = listTest.length; i < 10; i++) {
    let o = i - 2;
    var storedNames = JSON.parse(localStorage.getItem(`DataFile${o}`));
    // console.log(storedNames, "{{{{{{{{{[")
    if (storedNames == null) {} else {
        list[i].innerHTML = `DataFile${o}`;
        list[i].onclick = function () {
            var namelist = this.innerHTML;
            var storedNames = JSON.parse(localStorage.getItem(namelist));
            console.log(storedNames, "lksaka");
            getDataTextarea.value = storedNames;
        }
    }
}

function reset() {
    localStorage.clear();
}

function resetMem() {
    var inp = document.getElementsByClassName("data");
    for (let j = 0; j < inp.length; j++) {
        inp[j].innerText = "0000";
    }
    count = 1;
    adrBox.innerText = "0x000";
}


// send data in texterea 
function sendText() {
    var data = document.getElementById('textarea').value;
    var a = data.split(',');
    let c = document.getElementsByClassName('data');
    let j = 0;
    for (let i = 0; i < c.length; i++) {
        if (a[j] == undefined || a[j] == " ") {} else if (a[j] == "") {
            break
        } else {
            console.log(a[j])
            c[i].innerText = a[j];
        }
        j++;
    }
    document.getElementById('textarea').value = "";

}

function turnOFFled() {
    var led = document.getElementsByClassName("circle");
    // console.log(led[1], 'pppp')
    var ACLed = AC.split('');
    for (let k = 0; k < ACLed.length; k++) {
        led[k].style.backgroundColor = "white";
    }
}

function showCPU() {
    enableBtn(fetchBtn);
    disableBtn(executeBtn);
    disableBtn(decodeBtn);
    PC = '000000000000';
    IR = '0000000000000000';
    AC = '0000000000000000';
    DR = '0000000000000000';
    memory = '000000000000';
    registerHex.PC = binaryToHex(PC);
    registerHex.IR = binaryToHex(IR);
    registerHex.AC = binaryToHex(AC);
    registerHex.DR = binaryToHex(DR);
    registerHex.memory = binaryToHex(memory);
    var start = document.querySelectorAll(".cpu");
    var end = document.querySelectorAll(".endInput");
    document.getElementById("versions").style.display = "none";
    [].forEach.call(start, function (el) {
        el.classList.remove("StartCPU");
    });
    [].forEach.call(end, function (el) {
        el.classList.add("StartCPU");
    });
    var emptyLog = document.querySelectorAll(".logList");
    var emptyRegister = document.querySelectorAll(".regList");
    var emptyflag = document.querySelectorAll(".flagList");
    [].forEach.call(emptyLog, function (el) {
        el.remove();
    });

    [].forEach.call(emptyRegister, function (el) {
        el.innerText = "";
    });
    [].forEach.call(emptyflag, function (el) {
        el.innerText = "0";
    });
    turnOFFled();
}

function back() {
    document.getElementById("container").style.display = "block";
    document.getElementById("HLT").classList.remove("shutDown");
    document.getElementById("versions").style.display = "block";
    var end = document.querySelectorAll(".cpu");
    var start = document.querySelectorAll(".endInput");
    [].forEach.call(start, function (el) {
        el.classList.remove("StartCPU");
    });
    [].forEach.call(end, function (el) {
        el.classList.add("StartCPU");
    });
    [].forEach.call(code, function (el) {
        el.classList.remove("border");
    });
}

// TextAreaAssembler
function assembler() {
    var stringValu = getDataAssembler.value.split('\n');
    var opcode;
    var arr = [];
    for (let index = 0; index < stringValu.length; index++) {
        var s = 0;
        var b = 0;
        instructionAssembler = stringValu[index].split(' ');
        for (let i = 0; i < memory_instructions.length; i++) {
            var a = 0;
            if (memory_instructions[i][0] == instructionAssembler[0].toUpperCase()) {
                b = 1;
                s = 1;
                for (let j = 0; j < memoryAddress.length; j++) {
                    if (memoryAddress[j].innerText == instructionAssembler[1]) {
                        opcode = memory_instructions[i][2];
                        a = 1;
                        instructionAssembler[1] = instructionAssembler[1].slice(2, 5);
                        console.log(instructionAssembler[1].slice(2, 5), "kkkkkkkk");

                    }
                }
                if (a == 0)
                    opcode = memory_instructions[i][1];
                arr[index] = opcode + instructionAssembler[1] + ",";
                break;
            }

        }
        if (b == 0) {
            b = 2;
            for (let i = 0; i < register_instructions.length; i++) {
                if (register_instructions[i][0] == instructionAssembler[0].toUpperCase()) {
                    s = 1;
                    opcode = register_instructions[i][1];
                    arr[index] = opcode + ",";
                    break;
                }

            }
            if (s == 0) {
                for (let i = 0; i < memoryAddress.length; i++) {
                    if (instructionAssembler[0] == memoryAddress[i].innerText) {
                        // var ind=memoryAddress.indexOf(memoryAddress[i]);
                        arr[i] = instructionAssembler[1] + ",";
                    }

                }
            }
        }

    }
    for (let h = 0; h < memoryAddress.length; h++) {
        console.log(arr[h], ";ydhdjhdjnhgjhnh")
        if (arr[h] == undefined) {
            arr[h] = " ,";

        }
    }
    console.log(arr, "\n", arr.length, "llllllllllllllllllllllllllll")
    arr = arr.join('');
    getDataTextarea.value = arr;
}



// version 2 
function version() {
    console.log("dkdhjfhfj")
    var two = document.getElementsByClassName("vTwo");
    var ver = document.getElementById("versions").value;
    console.log(document.getElementById("versions").value, ";;;;;;;;");
    if ("version1" == ver) {
        versions = 1;
        [].forEach.call(two, function (el) {
            el.classList.add("dis");
        });
    }
    if ("version2" == ver) {
        versions = 2;
        [].forEach.call(two, function (el) {
            el.classList.remove("dis");
        });
        
    }

}