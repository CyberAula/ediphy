import React, {Component} from 'react';

export default class DaliBox extends Component{
    render(){
        let box = this.props.box;
        box.style['position'] = 'absolute';
        box.style['left'] = 7;
        box.style['top'] = 7;

        return (<div onClick={e => this.handleBoxSelection(this.props.id)}
                     onTouchStart={e => this.handleBoxSelection(this.props.id)}
                     style={{position: 'absolute',
                            left: box.position.x,
                            top: box.position.y,
                            width: box.width + 14,
                            height: box.height + 14}}>
                    <div style={{visibility: (this.props.isSelected ? 'visible' : 'hidden'), width: '100%', height: '100%'}}>
                        <div style={{position: 'absolute', left: 0,  top: 0,    width: 10, height: 10, backgroundColor: 'gray'}}></div>
                        <div style={{position: 'absolute', right: 0, top: 0,    width: 10, height: 10, backgroundColor: 'gray'}}></div>
                        <div style={{position: 'absolute', left: 0,  bottom: 0, width: 10, height: 10, backgroundColor: 'gray'}}></div>
                        <div style={{position: 'absolute', right: 0, bottom: 0, width: 10, height: 10, backgroundColor: 'gray'}}></div>
                        <div style={{position: 'absolute', left: 5, top: 5, width: box.width, height: box.height, border: "2px dashed black"}}></div>
                    </div>
                    <div style={box.style} dangerouslySetInnerHTML={{__html: box.content}}></div>
        </div>);
    }


    handleBoxSelection(id){
        this.props.onSelectBox(id);
    }

    componentDidMount() {

        this.interactable = interact(React.findDOMNode(this));
        this.interactable
            .draggable({
                restrict: {
                    restriction: "parent",
                    endOnly: true,
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                },
                autoScroll: true,
                onmove: (event) => {
                    var target = event.target;

                    target.style.left = (parseInt(target.style.left)||0) + event.dx + 'px';
                    target.style.top  = (parseInt(target.style.top )||0) + event.dy + 'px';
                },
                onend: (event) => {
                    this.props.onMoveBox(this.props.id, parseInt(event.target.style.left), parseInt(event.target.style.top));
                }
            });
    }

    componentWillUnmount() {
        this.interactable.unset();
        this.interactable = null;
    }
}