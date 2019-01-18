import React from 'react';
import interact from 'interactjs';
import ReactDOM from 'react-dom';
import img_broken from './../../dist/images/broken_link.png';

/* eslint-disable react/prop-types */

export default class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        let { props, state, markElements } = this.props;
        let scale = state.scale || 1;
        let translateX = (state.translate ? state.translate.x : 0) || 0;
        let translateY = (state.translate ? state.translate.y : 0) || 0;
        let transform = `translate(${translateX + "%"},${translateY + "%" }) scale(${scale})`;
        return <div style={{ height: "100%", width: "100%" }} className="draggableImage" ref="draggableImage" onWheel={(e) => {
            const delta = Math.sign(e.deltaY);
            props.update('scale', Math.round(10 * Math.min(20, Math.max(0, scale - delta / 10))) / 10);
        }}>
            <img ref ="img" id={props.id + "-image"}
                className="basicImageClass"
                style={{ width: state.allowDeformed ? "100%" : "100%", height: state.allowDeformed ? "" : "auto", transform, WebkitTransform: transform, MozTransform: transform }}
                src={state.url}
                onError={(e) => {
                    e.target.onError = null;
                    e.target.src = img_broken; // Ediphy.Config.broken_link;
                }}
            />
            <div className="dropableRichZone" style={{ height: "100%", width: "100%", position: 'absolute', top: 0, left: 0 }} >
                {markElements}
            </div>
        </div>;
    }

    componentDidMount() {
        let scale = this.props.state.scale || 1;
        interact(ReactDOM.findDOMNode(this))
            // .origin("parent")
            .draggable({
                enabled: true,
                // snap: {
                //     targets: [{ x: 0, y: 0, range: 25 }],
                //     relativePoints: [{ x: 0, y: 0 }],
                // },
                ignoreFrom: 'a, .pointerEventsEnabled, .markeditor',
                onstart: (event) => {
                    event.stopPropagation();
                    let parent = event.target;
                    let original = parent.childNodes[0];
                    scale = this.props.state.scale || 1;
                    // Clone, assign values and hide original
                    let clone = original.cloneNode(true);
                    let originalRect = original.getBoundingClientRect();
                    let parentRect = parent.getBoundingClientRect();
                    let x = originalRect.left - parentRect.left;
                    let y = originalRect.top - parentRect.top;
                    clone.setAttribute("id", "clone2");
                    clone.setAttribute('data-x', x);
                    clone.setAttribute('data-y', y);
                    clone.style.zIndex = '9999 !important';
                    original.setAttribute('data-x', x);
                    original.setAttribute('data-y', y);
                    clone.style.position = 'absolute';
                    clone.style.webkitTransform =
                    clone.style.MozTransform =
                      clone.style.msTransform =
                        clone.style.OTransform = 'translate(' + (x) + 'px, ' + (y) + 'px) scale(' + scale + ')';
                    parent.appendChild(clone);
                    original.style.opacity = 0;
                },
                onmove: (event) => {
                    event.stopPropagation();
                    scale = this.props.state.scale || 1;
                    let target = document.getElementById('clone2');
                    let original = event.target.childNodes[0];
                    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                    target.style.webkitTransform =
                    target.style.MozTransform =
                      target.style.msTransform =
                        target.style.OTransform = 'translate(' + (x) + 'px, ' + (y) + 'px) scale(' + scale + ')';
                    target.style.zIndex = '9999';
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                    original.setAttribute('data-x', x);
                    original.setAttribute('data-y', y);
                },
                onend: (event) => {
                    event.stopPropagation();
                    let target = event.target.childNodes[0];
                    scale = this.props.state.scale || 1;
                    target.style.zIndex = '0';
                    target.style.opacity = 1;
                    // Get position and if contained in sortableContainer || PluginPlaceHolder, convert to %
                    let actualLeft = target.getAttribute('data-x');
                    let actualTop = target.getAttribute('data-y');
                    let x = (parseFloat(actualLeft) * 100) / target.offsetWidth;
                    let y = (parseFloat(actualTop) * 100) / target.offsetHeight; //* target.parentElement.offsetHeight / target.offsetHeight;
                    // Delete clone and unhide original
                    let clone = document.getElementById('clone2');
                    if (clone) {
                        clone.parentElement.removeChild(clone);
                    }
                    this.props.props.update('translate', { x, y });
                    event.stopPropagation();

                },
            });
    }
}
/* eslint-enable react/prop-types */
