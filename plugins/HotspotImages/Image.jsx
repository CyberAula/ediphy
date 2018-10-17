import React from 'react';

export default class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        let { props, state, markElements } = this.props;
        let scale = state.scale || 1;
        let translateX = this.state.translateX || (state.translate ? state.translate.x : 0) || 0;
        let translateY = this.state.translateY || (state.translate ? state.translate.y : 0) || 0;
        let transform = `translate(${translateX + (this.state.dragging ? "px" : "%")},${translateY + (this.state.dragging ? "px" : "%")}) scale(${scale})`;
        return <div style={{ height: "100%", width: "100%" }} className="draggableImage"
            onDragStart={(e) => {
                let x = e.pageX;
                let y = e.pageY;
                this.setState({ x, y, translateX, translateY, dragging: true });
                let crt = e.target.cloneNode(true);
                crt.style.backgroundColor = "red";
                crt.style.display = "none"; /* or visibility: hidden, or any of the above */
                document.body.appendChild(crt);
                e.dataTransfer.setDragImage(crt, 0, 0);
            }}
            draggable
            onDrag={e=>{
                let x = e.pageX;
                let y = e.pageY;
                this.setState({ translateX: x - this.state.x, translateY: y - this.state.y });
            }}
            onDragEnd={e=>{
                let x = (e.pageX - this.state.x) * 100 / e.target.offsetWidth;
                let y = (e.pageY - this.state.y) * 100 / e.target.offsetHeight;
                this.setState({ translateX: 0, translateY: 0, dragging: false });
                props.update('translate', { x, y });
            }}
            onWheel={(e)=>{
                const delta = Math.sign(e.deltaY);
                props.update('scale', scale - delta / 5);
            }}
        >
            <img ref ="img" id={props.id + "-image"}
                className="basicImageClass"
                style={{ height: "100%", width: state.allowDeformed ? "auto" : "100%", transform }}
                src={state.url}
                onError={(e)=>{
                    e.target.onError = null;
                    e.target.src = img_broken; // Ediphy.Config.broken_link;
                }}
            />
            <div className="dropableRichZone" style={{ height: "100%", width: "100%", position: 'absolute', top: 0, left: 0 }} >
                {markElements}
            </div></div>;
    }

    componentDidMount() {
        this.dragImg = new Image(0, 0);
        this.dragImg.src =
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }
}
