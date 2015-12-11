import React, {Component} from 'react';
import interact from 'interact.js';

export default class DaliBoxSortable extends Component{
    render(){
        let borderSize = 2;
        let cornerSize = 15;

        let box = this.props.box;
        box.style['backgroundColor'] = 'green';
        box.style['width'] = '100%';
        box.style['left'] = (cornerSize / 2 + borderSize);
        box.style['top'] = (cornerSize / 2 + borderSize);

        return (<div onClick={e => this.handleBoxSelection(this.props.id)}
                     onTouchStart={e => this.handleBoxSelection(this.props.id)}
                     style={{position: 'absolute', left: 0, top: 0, width: '100%', minHeight: 75}}>
            <div style={{backgroundColor: 'green', position: 'absolute', top: 0, left: 0, width: '100%'}}>
                <div>
                    <button style={{width: '100%', height: 80}}>a</button>
                    <button style={{width: '100%', height: 80}}>b</button>
                    <button style={{width: '100%', height: 80}}>c</button>
                    <button style={{width: '100%', height: 80}}>d</button>
                </div>
                <button style={{display: 'block', width: 75, height: 75, margin: 'auto'}} ><i className="fa fa-plus-circle fa-5x"></i></button>
            </div>
            <div style={{visibility: (this.props.isSelected ? 'visible' : 'hidden'), width: '100%'}}>
                <div style={{position: 'absolute', width: '100%', height: '100%', boxSizing: 'border-box', border: (borderSize + "px dashed black")}}></div>
                <div style={{position: 'absolute', left:  -cornerSize/2, top: -cornerSize/2,    width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
                <div style={{position: 'absolute', right: -cornerSize/2, top: -cornerSize/2,    width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
                <div style={{position: 'absolute', left:  -cornerSize/2, bottom: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
                <div style={{position: 'absolute', right: -cornerSize/2, bottom: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
            </div>
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
                autoScroll: false,
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