var nameListTest=["ADD","BUN ex-version 2","OUT ex-version 3","INP ex-version 4","BSA ex-version 5"]
var listTest = ["2063,1062,3061,7001, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1010,1111,", 
"7800,1006,4004,7001,0007,4003,11AC,93c6, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,",
"1063,3062,4004,0062,F100,7020,2061,F400,7001, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1010, ,1111,",
"2063,F800,F200,4002,F400,7001, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1101,",
"2063,1062,D05D,7001, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,05E, ,7800,C05E, ,1010,1111,"]
var list = document.getElementsByClassName("listData");
for (let i = 0; i < 10; i++) {
  if(i < listTest.length){
    // console.log(i,";;;lll")
    var storedNames = listTest[i];
    list[i].innerHTML = `${nameListTest[i]}`;
    list[i].onclick = function (e) {
        var namelist = nameListTest.indexOf(this.innerHTML) ;
        getDataTextarea.value = listTest[namelist];
        /*
        document.querySelector('ul#list > li.listData:nth-of-type(even)').style.backgroundColor = 'blue';//'#eee';
        document.querySelector('ul#list > li.listData:nth-of-type(odd)').style.backgroundColor = 'yellow'; //'#ddd';
        e.target.style.backgroundColor = 'red';
        console.log('click'+i);
        */
    }
  }else{
    let o = i - listTest.length;
    var storedNames = JSON.parse(localStorage.getItem(`DataFile${o}`));
    if (storedNames == null) { } else {
        list[i].innerHTML = `DataFile${o}`;
        list[i].onclick = function () {
            var namelist = this.innerHTML;
            var storedNames = JSON.parse(localStorage.getItem(namelist));
            getDataTextarea.value = storedNames;

        }
    }
  }
}
