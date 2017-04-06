export function EnrichedVideo(base) {

    return {
        init: function () {
        },
        getRenderTemplate: function (state) {
            /*return "<video " + (state.controls && state.controls !== "on" ? "controls='true' " : "") +
             (state.autoplay ? " autoplay " : "") +
              " style=\"width: 100%; height: 100%; z-index:0;\" src=\"" +
               state.url +
                "\"  class=\"basicVideoClass\"></video>";*/
            return "<video " +
                ((state.controls) ? " controls='true' " : "") +
                ((state.autoplay) ? " autoPlay " : "") +
                " style=\"width: 100%; height: 100%; pointer-events: 'none'; z-index:0;\" src=\"" +
                state.url + "\" ontimeupdate='$dali$.timeUpdate()'></video>";
        },
        getMarkArray: function(element){
            var marks = base.getMarks(element);
            if (Object.keys(marks).length <= 0) {
                return false;
            }
            var marksArray = [];
            Object.keys(marks).map((mark) =>{
                let inner_mark = marks[mark];
                let value = inner_mark.value.toString();
                marksArray.push(value);
            });

            return marksArray;

        },
        getMarkKeys: function(element){
            var marks = base.getMarks(element);
            var markKeys = {};
            Object.keys(marks).map((mark) =>{
                let inner_mark = marks[mark];
                let value = inner_mark.value.toString();
                markKeys[value] = inner_mark.id;
            });
            return markKeys;
        },
        timeUpdate: function (e, element) {
            var time = document.getElementById("box-" + element).getElementsByTagName('video')[0].currentTime;
            time = Math.floor(time);

            if(this.getMarkArray(element) && this.getMarkArray(element).indexOf(time.toString() !== -1)){
                base.triggerMark(element, this.getMarkKeys(element)[time]);
            }
        }
    };
}
