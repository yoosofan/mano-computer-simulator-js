// one methode
var count = 1;
var adrBox = document.getElementById("address");
const adr = document.getElementsByClassName("Address");
const ins = document.getElementById("insert");
var elementt = document.getElementsByClassName("data");
var getDataTextarea = document.getElementById("textarea");
ins.addEventListener("click", insert);

function natural() {
    document.getElementById("naturalInsertion").style.visibility = "visible";
    resetMem();
}


function insert() {
    console.log(count, ";;;")
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
    getDataTextarea.value=dataStore;
}
// local.addEventListener("click", localstore(data));

function localstore() {
    var array = [10];
    var number = Bazdid();
    array[number] = dataStore;
    localStorage.setItem(`DataFile${number}`, JSON.stringify(array[number]));
    alert("The data was saved as a" + `DataFile${number}`);
    getDataTextarea.value="";
}
var list = document.getElementById("list");
for (let i = 0; i < 5; i++) {
    var storedNames = JSON.parse(localStorage.getItem(`DataFile${i}`));
    if (storedNames == null) {} else {
        var tagli = document.createElement("li");
        tagli.classList.add("listData");
        tagli.innerHTML = `DataFile${i}`;
        list.appendChild(tagli);
        tagli.onclick = function () {
            var namelist = this.innerHTML;
            var inp = document.getElementsByTagName("input");
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
    // console.log()
    adrBox.innerText = "0x000";
}


// send data in texterea 
function sendText() {
    var data = document.getElementById('textarea').value;
    var a = data.split(',');
    let c = document.getElementsByClassName('data');
    let j = 0;
    for (let i = 0; i < c.length; i++) {
        if (a[j] == undefined || a[j] == " ") {
            console.log(a[j], ";;;;;;;;;;;;;")
        } else if (a[j] == "") {
            break
        } else {
            console.log(a[j])
            c[i].innerText = a[j];
        }
        j++;
    }
    document.getElementById('textarea').value="";

}

function showCPU(){
    var start = document.querySelectorAll(".cpu");
    var end =document.querySelectorAll(".endInput");
    [].forEach.call(start, function(el) {
        el.classList.remove("StartCPU");
    });
    [].forEach.call(end, function(el) {
        el.classList.add("StartCPU");
    });
}
function back(){
    var end = document.querySelectorAll(".cpu");
    var start =document.querySelectorAll(".endInput");
    [].forEach.call(start, function(el) {
        el.classList.remove("StartCPU");
    });
    [].forEach.call(end, function(el) {
        el.classList.add("StartCPU");
    });
}