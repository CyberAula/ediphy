import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AreaCreator = (props) => {
    const [canvasPosition, setCanvasPosition] = useState({ top: 0, left: 0 });
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [hoverPoint, setHoverPoint] = useState({ x: 0, y: 0 });
    const [points, setPoints] = useState([]);
    const [nextToVertex, setNextToVertex] = useState(false);
    useEffect(() => {
        if (props.active) {
            try {
                const canvas = document.getElementById(props.canvas);
                const height = canvas.clientHeight;
                const width = canvas.clientWidth;
                const top = canvas.getBoundingClientRect().y;
                const left = canvas.getBoundingClientRect().x;
                if(height !== canvasSize.height || width !== canvasSize.width) {
                    setCanvasSize({ width, height });
                    setCanvasPosition({ top, left });
                }
            } catch (e) {
            }
        }
    }, [canvasSize, props]);

    const addPoint = e => {
        const newPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
        if(isNextToVertex(newPoint)) {finishDrawing();} else {
            setPoints([...points, newPoint]);
        }
    };

    // eslint-disable-next-line no-shadow
    const tracePath = pathPts => {
        // eslint-disable-next-line no-shadow
        const pathMaker = (trace, newPoint, index, points) => {
            if (index === 0) {
                return `M${newPoint.x} ${newPoint.y}`;
            } else if (index === points.length - 1) {
                return `${trace} L${newPoint.x} ${newPoint.y} Z`;
            }
            return `${trace} L${newPoint.x} ${newPoint.y}`;
        };
        return pathPts.reduce(pathMaker, '');
    };

    // eslint-disable-next-line no-shadow
    const drawVertex = points => {
        return points.map((point, i) => <circle key={i} cx={point.x} cy={point.y} r="2" fill="white" />);
    };

    const getPosition = (e) => {
        const hPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
        setHoverPoint(hPoint);
        setNextToVertex(isNextToVertex(hPoint));
    };

    const finishDrawing = () => {
        if (typeof props.onEnd === 'function') {
            const svg = <svg key={Date.now().toString()} style={{ position: 'absolute', top: canvasPosition.top + 'px', left: canvasPosition.left + 'px' }}
            >
                <path d={tracePath(points)} />
            </svg>;

            const response = {
                canvasPosition: canvasPosition,
                canvasSize: canvasSize,
                svgPoints: points,
                svgPath: tracePath(points),
                svg: svg,
            };
            props.onEnd(response);
            setPoints([]);
        }
    };

    const isNextToVertex = (point, tolerance = 2) => {
        return points.find(p => Math.sqrt(Math.pow((p.x - point.x), 2) + Math.pow((p.y - point.y), 2)) < tolerance);
    };

    const handleKeyDown = e => {
        if (e.keyCode === 13) {
            finishDrawing();
        }
    };

    const undoVertex = e => {
        if (props.undo) {
            e.preventDefault();
            const newPoints = points.length > 0 ? points.slice(0, points.length - 1) : [];
            setPoints(newPoints);
        }
    };

    return props.active ? (
        <div style={{ position: 'absolute',
            backgroundColor: 'rgba(255,255,255,0.1)',
            cursor: 'crosshair',
            top: canvasPosition.top + 'px',
            left: canvasPosition.left + 'px',
            height: canvasSize.height + 'px',
            width: canvasSize.width + 'px' }}>
            <svg version={'1.1'} onClick={addPoint} width={'100%'} height={'100%'}
                onContextMenu={undoVertex} onMouseMove={getPosition}
                fillOpacity="0.8" tabIndex={'0'} onKeyDown={handleKeyDown}>
                <path d={tracePath([...points, hoverPoint])}
                    strokeDasharray={nextToVertex ? '5,0' : '5,5'} fill="white" fillOpacity="0.4"
                    strokeWidth={nextToVertex ? '4' : '2'} stroke='white'/>
                <path d={tracePath(points)} fill={props.color || 'black'}/>
                {drawVertex(points)}
            </svg>
        </div>

    ) : <div />;
};

export default AreaCreator;

AreaCreator.propTypes = {
    /**
     * Canvas size
     */
    canvas: PropTypes.object,
    /**
     * Callback triggered when area is created
     */
    onEnd: PropTypes.func,
    /**
      * Undo function enabled
      */
    undo: PropTypes.bool,
    /**
      * Area creator enabled
      */
    active: PropTypes.bool,
    /**
   * Area color
   */
    color: PropTypes.any,
};
