
export function aspectRatio(ratioparam, idEl = "airlayer", idParent = "canvas") {

    //change ratio to the global ratio store in the app
    let ratio = ratioparam;
    let parent = document.getElementById(idParent);
    let canvas = document.getElementById(idEl);
    canvas.style.height = "100%";
    canvas.style.width = "100%";

    /* this is to avoid get values from react flow when using event listeners that do not exist in react
     * get the values from window.object */

    if(window.canvasRatio === undefined){
        window.canvasRatio = ratio; //https://stackoverflow.com/questions/19014250/reactjs-rerender-on-browser-resize
    } else {
        ratio = window.canvasRatio;
    }

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.style.marginTop = 0 + 'px';
    if (h < 400 || w < 400){
        canvas.style.height = 0 + "px";
        canvas.style.width = 0 + "px";
    } else if (w > ratio * h) {
        canvas.style.width = (ratio * h) + "px";
    } else if (h > w/ratio) {
        let newHeight = w/ratio;
        canvas.style.height = newHeight + "px";
        if (parent/* && parent.offsetHeight - newHeight > 0*/){
            canvas.style.marginTop = ((parent.offsetHeight - canvas.offsetHeight)/2 -5)+ 'px';
        } 
    }

}

