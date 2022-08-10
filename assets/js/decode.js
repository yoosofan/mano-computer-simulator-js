// let start = 0;
// let numberOfAddress = 0;
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
    if (hexadecimal.length < 4) {
        let numberOfZero = [];
        for (let i = 0; i < 4 - hexadecimal.length; i++) {
            numberOfZero.push("0");
        }
        let arr = hexadecimal.split('');
        arr.splice(2, 0,numberOfZero);
        // console.log(arr)
        outcome = arr.join('');
        // console.log(outcome)
        hexadecimal = outcome;
    }
    if (hexadecimal.length > 4) {
        hexadecimal = hexadecimal.split('').slice(-4).join('');
    }
    // console.log(hexadecimal)
    return hexadecimal;

}


const ramTable = document.createElement('table');
const memoryTable = document.querySelector('.ramtable');
var storedNames = JSON.parse(localStorage.getItem(`Datafatch`));
console.log(storedNames[1]);
for (let i = -1; i <100; i++) {
    var datacel=storedNames[i+1];
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
        }
        else if (j == 2) {
            c.innerText = datacel;
            c.classList.add('text');
        }
        c.classList.add('center');
        r.appendChild(c);
    }
    ramTable.appendChild(r);
}
memoryTable.appendChild(ramTable);








// var list = document.getElementById("list");
// for (let i = 0; i < 5; i++) {
//     var storedNames = JSON.parse(localStorage.getItem(`DataFile${i}`));
//     if (storedNames == null) {} else {
//         var tagli = document.createElement("li");
//         tagli.classList.add("listData");
//         tagli.innerHTML = `DataFile${i}`;
//         list.appendChild(tagli);
//         tagli.onclick = function () {
//             var namelist = this.innerHTML;
//             var inp = document.getElementsByTagName("input");
//             var storedNames = JSON.parse(localStorage.getItem(namelist));
//             for (let j = 1; j <= 100; j++) {
//                 var d = j % 10;
//                 var f = ((j - d) / 10) + 1;
//                 var a;
//                 if (d == 1) {

//                     a = "A" + f;
//                 } else if (d == 2) {
//                     a = "B" + f;
//                 } else if (d == 3) {

//                     a = "C" + f;
//                 } else if (d == 4) {

//                     a = "D" + f;
//                 } else if (d == 5) {

//                     a = "E" + f;
//                 } else if (d == 6) {

//                     a = "F" + f;
//                 } else if (d == 7) {

//                     a = "G" + f;
//                 } else if (d == 8) {
//                     a = "H" + f;
//                 } else if (d == 9) {

//                     a = "I" + f;
//                 } else {

//                     a = "J" + f;
//                 }
//                 if (a == inp[j - 1].name) {
//                     inp[j - 1].value = storedNames[j];
//                 }
//             }
//         }
//     }
// }
// const table = document.querySelector('.ram table');
// const rows = table.getElementsByTagName('tr');
// const columns = table.getElementsByTagName('td');

// function updateContentsColumn() {
//     let counter = start;
//     console.log(numberOfAddress)
//     for (let i = parseInt('0x' + start) + 1; i < parseInt('0x' + start) + numberOfAddress + 1; i++) {
//         columns[i * 3 + 2].innerText = memory_table_contents[counter];
//         counter = addHexNumbers(counter, '1');
//     }
//     // scrollToRow(parseInt('0x' + startAddress) + 1);
// }
// updateContentsColumn();