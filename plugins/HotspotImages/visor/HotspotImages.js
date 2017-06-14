import React from "react";

export function HotspotImages(base) {
    return {
        getRenderTemplate: function (state,id) {
            let template = state.children[0];
            let marks = state.children[1];
            let box_id = id;

            /* jshint ignore:start */
            let markElements = marks.map((e) =>{
               return(
                   <a key={e.key} style={{position: 'absolute', top :e.props.style.top + "%", left:  e.props.style.left + "%"}} href="#" onClick={()=>{this.onMarkClicked(box_id, parseFloat(e.props.style.top) + "," + parseFloat(e.props.style.left))}}><i style={{width:"100%",height:"100%"}} className="material-icons">room</i></a>
               );
            });

            return(
            <div>
                <img style={{height:"100%",width:"100%"}} src={template.props.src}/>
                {markElements}
            </div>);
            /* jshint ignore:end */
        },
        onMarkClicked(element,value){
            base.triggerMark(element,value, false);
        }
    };
}
