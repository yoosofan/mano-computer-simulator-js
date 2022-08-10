
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






