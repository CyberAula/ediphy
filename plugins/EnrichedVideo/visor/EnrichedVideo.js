export function EnrichedVideo(base) {

    return {
        init: function(){
            this.__marks = {};
            this.actualMark = "";
        },
        getRenderTemplate: function (state) {
            this.__marks = state.__marks;
            let time = "";
            if(state.currentValue){
                time = "#t=" + state.currentValue;
            }
            return "<video " +
                ((state.controls) ? " controls='true' " : "") +
                ((state.autoplay) ? " autoPlay " : "") +
                " style=\"width: 100%; height: 100%; pointer-events: 'none'; z-index:0;\" src=\"" +
                state.url + time + "\" ontimeupdate='$dali$.timeUpdate()'></video>";
        },
        timeUpdate: function (e, element) {
            var time = document.getElementById("box-" + element).getElementsByTagName('video')[0].currentTime;
            time = Math.floor(time);
            base.triggerMark(element, time.toString(), true);
        }
    };
}
