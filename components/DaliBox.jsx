import React, {Component} from 'react';

export default class DaliBox extends Component{
    render(){
        let borderSize = 2;
        let cornerSize = 15;

        let box = this.props.box;
        box.style['position'] = 'absolute';
        box.style['left'] = (cornerSize / 2 + borderSize);
        box.style['top'] = (cornerSize / 2 + borderSize);

        return (<div onClick={e => this.handleBoxSelection(this.props.id)}
                     onTouchStart={e => this.handleBoxSelection(this.props.id)}
                     style={{position: 'absolute',
                            left: box.position.x,
                            top: box.position.y,
                            width: box.width + (cornerSize + borderSize * 2),
                            height: box.height + (cornerSize + borderSize * 2)}}>
                    <div style={{visibility: (this.props.isSelected ? 'visible' : 'hidden'), width: '100%', height: '100%'}}>
                        <div style={{position: 'absolute', left: 0,  top: 0,    width: cornerSize, height: cornerSize, backgroundColor: 'gray'}}></div>
                        <div style={{position: 'absolute', right: 0, top: 0,    width: cornerSize, height: cornerSize, backgroundColor: 'gray'}}></div>
                        <div style={{position: 'absolute', left: 0,  bottom: 0, width: cornerSize, height: cornerSize, backgroundColor: 'gray'}}></div>
                        <div style={{position: 'absolute', right: 0, bottom: 0, width: cornerSize, height: cornerSize, backgroundColor: 'gray'}}></div>
                        <div style={{position: 'absolute', left: (cornerSize / 2), top: (cornerSize / 2), width: box.width, height: box.height, border: (borderSize + "px dashed black")}}></div>
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