import React from "react";

export function HotspotImages(base) {
    return {
        getRenderTemplate: function (state,id) {
            let marks = state.__marks;
            let box_id = id;

            /* jshint ignore:start */
            let markElements = Object.keys(marks).map((e) =>{
                let position = marks[e].value.split(',');
               return(
                   <a key={marks[e].id} style={{position: 'absolute', top : position[0] + "%", left:  position[1] + "%"}} href="#" onClick={()=>{this.onMarkClicked(box_id, marks[e].value)}}><i style={{width:"100%",height:"100%"}} className="material-icons">room</i></a>
               );
            });

            return(
            <div>
                <img style={{height:"100%",width:"100%"}} src={state.url}/>
                {markElements}
            </div>);
            /* jshint ignore:end */
        },
        onMarkClicked(element,value){
            base.triggerMark(element,value, false);
        }
    };
}
