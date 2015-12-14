import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import interact from 'interact.js';

export default class DaliBox extends Component{
    render(){
        let borderSize = 2;
        let cornerSize = 15;

        let box = this.props.box;

        let content = (<div style={{width: '100%', height: '100%'}} dangerouslySetInnerHTML={{__html: box.content}}></div>);
        let overlay = (
            <div style={{visibility: ((this.props.isSelected && box.type !== 'sortable') ? 'visible' : 'hidden')}}>
                <div style={{position: 'absolute', width: '100%', height: '100%', border: (borderSize + "px dashed black"), boxSizing: 'border-box'}}></div>
                <div style={{position: 'absolute', left:  -cornerSize/2, top: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
                <div style={{position: 'absolute', right: -cornerSize/2, top: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
                <div style={{position: 'absolute', left:  -cornerSize/2, bottom: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
                <div style={{position: 'absolute', right: -cornerSize/2, bottom: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray'}}></div>
            </div>);
        let position;
        switch(box.type){
            case 'normal':
                position = 'absolute';
                break;
            case 'inner-sortable':
                position = 'relative';
                break;
        }

        return (<div onClick={e => this.handleBoxSelection(this.props.id)}
                     onTouchStart={e => this.handleBoxSelection(this.props.id)}
                     style={{position: position,
                            left: box.position.x,
                            top: box.position.y,
                            width: box.width,
                            height: box.height}}>
            {overlay}
            {content}
        </div>);
    }

    handleBoxSelection(id){
        this.props.onBoxSelected(id);
    }

    componentDidMount() {
        if(this.props.box.type !== 'sortable') {
            interact(ReactDOM.findDOMNode(this))
                .draggable({
                    enabled: this.props.box.draggable,
                    restrict: {
                        restriction: "parent",
                        endOnly: true,
                        elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                    },
                    autoScroll: true,
                    onmove: (event) => {
                        var target = event.target;

                        target.style.left = (parseInt(target.style.left) || 0) + event.dx + 'px';
                        target.style.top = (parseInt(target.style.top) || 0) + event.dy + 'px';
                    },
                    onend: (event) => {
                        this.props.onBoxMoved(this.props.id, parseInt(event.target.style.left), parseInt(event.target.style.top));
                    }
                })
                .resizable({
                    enabled: this.props.box.resizable,
                    edges: {left: true, right: true, bottom: true, top: true}
                })
                .on('resizemove', function (event) {
                    var target = event.target,
                        x = (parseFloat(target.getAttribute('data-x')) || 0),
                        y = (parseFloat(target.getAttribute('data-y')) || 0);

                    // update the element's style
                    target.style.width = event.rect.width + 'px';
                    target.style.height = event.rect.height + 'px';

                    // translate when resizing from top or left edges
                    x += event.deltaRect.left;
                    y += event.deltaRect.top;

                    target.style.webkitTransform = target.style.transform =
                        'translate(' + x + 'px,' + y + 'px)';

                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                });
        }
    }

    /*
    componentWillUnmount() {
        if(this.props.box.type !== 'sortable') {
            this.interactable.unset();
            this.interactable = null;
        }
    }
    */
}