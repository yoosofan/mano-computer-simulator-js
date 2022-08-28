var nameListTest=["ADD","AND"]
var listTest = ["2063,1062,3061,7001, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1010,1111,", "2063,0062,3061,7001, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1110,1010,"]
var list = document.getElementsByClassName("listData");
for (let i = 0; i < listTest.length; i++) {
    // console.log(i,";;;lll")
    var storedNames = listTest[i];
    list[i].innerHTML = `${nameListTest[i]}`;
    list[i].onclick = function () {
        var namelist = nameListTest.indexOf(this.innerHTML) ;
        getDataTextarea.value = listTest[namelist];
    }

}
