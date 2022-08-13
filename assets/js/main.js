var element = document.getElementById("RAM");
for (let i = 1; i <= 100; i++) {
    var tag = document.createElement("input");
    tag.classList.add("block")
    var d = i % 10;
    var f = ((i - d) / 10) + 1;
    if (d == 1) {
        tag.name = "A" + f;
    } else if (d == 2) {
        tag.name = "B" + f;
    } else if (d == 3) {

        tag.name = "C" + f;
    } else if (d == 4) {

        tag.name = "D" + f;
    } else if (d == 5) {

        tag.name = "E" + f;
    } else if (d == 6) {

        tag.name = "F" + f;
    } else if (d == 7) {

        tag.name = "G" + f;
    } else if (d == 8) {
        tag.name = "H" + f;
    } else if (d == 9) {

        tag.name = "I" + f;
    } else {

        tag.name = "J" + f;
    }
    element.appendChild(tag);
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

function store() {
    var array = [5]
    var data = [];
    for (let b = 1; b <= 100; b++) {
        var tag = element.childNodes[b].value;
        data[b] = tag
    }
    var number = Bazdid();
    array[number] = data;
    localStorage.setItem(`DataFile${number}`, JSON.stringify(array[number]));
    alert("The data was saved as a" + `DataFile${number}`)
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
            for (let j = 1; j <= 100; j++) {
                var d = j % 10;
                var f = ((j - d) / 10) + 1;
                var a;
                if (d == 1) {

                    a = "A" + f;
                } else if (d == 2) {
                    a = "B" + f;
                } else if (d == 3) {

                    a = "C" + f;
                } else if (d == 4) {

                    a = "D" + f;
                } else if (d == 5) {

                    a = "E" + f;
                } else if (d == 6) {

                    a = "F" + f;
                } else if (d == 7) {

                    a = "G" + f;
                } else if (d == 8) {
                    a = "H" + f;
                } else if (d == 9) {

                    a = "I" + f;
                } else {

                    a = "J" + f;
                }
                if (a == inp[j - 1].name) {
                    inp[j - 1].value = storedNames[j];
                }
            }
        }
    }
}

function reset() {
    localStorage.clear();
}

function newData() {
    var inp = document.getElementsByTagName("input");
    for (let j = 1; j <= 100; j++) {
        var d = "input" + j;
        if (d == inp[j - 1].name) {
            inp[j - 1].value = " ";
        }
    }
}

let selectedFile;
document.getElementById('input').addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
})
let data = [{
    "name": "jayanth",
    "data": "scd",
    "abc": "sdef"
}]
document.getElementById('button').addEventListener("click", () => {
    XLSX.utils.json_to_sheet(data, 'out.xlsx');
    if (selectedFile) {
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event) => {
            let data = event.target.result;
            let workbook = XLSX.read(data, {
                type: "binary"
            });
            workbook.SheetNames.forEach(sheet => {
                var obj = Object.entries(workbook.Sheets[sheet]);
                var All = document.getElementsByTagName("input");
                for (let i = 1; i < obj.length; i++) {
                    for (var j = 0; j < All.length; j++) {
                        if (All[j].getAttribute("name") == obj[i][0]) {
                            All[j].setAttribute("value", obj[i][1].w);
                        }
                    }

                }
            });
        }
    }
});

document.getElementById('sendText').addEventListener("click", () => {
    var data = document.getElementById('textarea').value;
    var a = data.split('\n');
    var arraydata;
    for (let index = 0; index < a.length; index++) {
        var mysplit = a[index].split(',');
        // console.log(mysplit)
        for (let i = 0; i < mysplit.length; i++) {
            var element;
            if (i == 0) {
                var twoPar = mysplit[i].split('');
                mysplit[i] = twoPar[1];
                // console.log(twoPar[1],"hlkhoihj")
            } else if (i == 9) {
                var twoPar = mysplit[i].split('');
                mysplit[i]= twoPar[0];
            }
        }
        if(index==0)
            arraydata=mysplit;
        else
            arraydata=arraydata.concat(mysplit)
        
    }
    console.log(arraydata,";lkl") 
    var ALL=document.getElementById("RAM").getElementsByTagName("input");
    console.log(ALL);
    for (let j = 0; j < ALL.length; j++) {
        ALL[j].setAttribute("value",arraydata[j] );
        
    }
})
const Datafetch = document.getElementById("fetch");
Datafetch.addEventListener("click", fetch);

function fetch() {
    console.log("djdjfhggd")
    var array = [5]
    var data = [];
    for (let b = 1; b <= 100; b++) {
        var tag = element.childNodes[b].value;
        data[b] = tag
    }
    var number = Bazdid();
    array[number] = data;
    localStorage.setItem(`Datafatch`, JSON.stringify(array[number]));
}