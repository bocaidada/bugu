function resize() {
    var docEl = document.documentElement;
    var clientWidth = window.innerWidth;
    if(clientWidth<=375){
        docEl.style.fontSize='50px';
    }else if(clientWidth>=750){
        docEl.style.fontSize='100px';
    }else{
        docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
    }
}
resize();




