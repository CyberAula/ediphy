import React, {Component} from 'react';

export default class DaliBox extends Component{
    render(){
        let box = this.props.box;
        box.style['position'] = 'absolute';
        box.style['left'] = box.position.x;
        box.style['top'] = box.position.y;
        box.style['borderColor'] = (this.props.isSelected) ? 'red' : 'black';

        return (<div style={box.style}
                     dangerouslySetInnerHTML={{__html: box.content}}
                     onClick={e => this.handleBoxSelection(this.props.id)}
                     onTouchStart={e => this.handleBoxSelection(this.props.id)}>
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
                onmove: function (event) {
                    var target = event.target;

                    target.style.left = (parseInt(target.style.left)||0) + event.dx + 'px';
                    target.style.top  = (parseInt(target.style.top )||0) + event.dy + 'px';
                }
            }).resizable({
                preserveAspectRatio: true,
                edges: { left: true, right: true, bottom: true, top: true }})
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

    componentWillUnmount() {
        this.interactable.unset();
        this.interactable = null;
    }
}