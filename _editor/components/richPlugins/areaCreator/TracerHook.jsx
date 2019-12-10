import React, { useState, useEffect } from 'react';

export default function TracerHook(props) {
    const [canvasPosition, setCanvasPosition] = useState({ top: 0, left: 0 });
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [hoverPoint, setHoverPoint] = useState({ x: 0, y: 0 });
    const [points, setPoints] = useState([]);
    const [nextToVertex, setNextToVertex] = useState(false);

    useEffect(() => {
        const canvas = document.getElementById(props.canvas);
        const height = canvas.clientHeight;
        const width = canvas.clientWidth;
        const top = canvas.offsetTop;
        const left = canvas.offsetLeft;
        if(height !== canvasSize.height || width !== canvasSize.width) {
            setCanvasSize({ width, height });
            setCanvasPosition({ top, left });
        }
    }, [canvasSize, props]);

    const addPoint = e => {
        const newPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
        if(isNextToVertex(newPoint)) {finishDrawing();} else {
            setPoints([...points, newPoint]);
        }
    };

    const tracePath = points => {
        const pathMaker = (trace, newPoint, index, points) => {
            if (index === 0) {
                return `M${newPoint.x} ${newPoint.y}`;
            } else if (index === points.length - 1) {
                return `${trace} L${newPoint.x} ${newPoint.y} Z`;
            }
            return `${trace} L${newPoint.x} ${newPoint.y}`;

        };
        return points.reduce(pathMaker, '');
    };

    const drawVertex = points => {
        return points.map((point, i) => <circle key={i} cx={point.x} cy={point.y} r="2" fill="white" />);
    };

    const getPosition = (e) => {
        const hoverPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
        setHoverPoint(hoverPoint);
        setNextToVertex(isNextToVertex(hoverPoint));
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
        return points.find(p => Math.sqrt((p.x - point.x) ^ 2 + (p.y - point.y) ^ 2) < tolerance);
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

    return (
        props.active &&
            <div style={{ position: 'absolute', top: canvasPosition.top + 'px', left: canvasPosition.left + 'px', height: canvasSize.height + 'px', width: canvasSize.width + 'px' }}>
                <svg version={'1.1'} onClick={addPoint} width={'100%'} height={'100%'}
                    onContextMenu={undoVertex} onMouseMove={getPosition}
                    fillOpacity="0.8" tabIndex={'0'} onKeyDown={handleKeyDown}>
                    <path d={tracePath([...points, hoverPoint])}
                        strokeDasharray={nextToVertex ? '5,0' : '5,5'} fill="white" fillOpacity="0.4"
                        strokeWidth={nextToVertex ? '4' : '2'} stroke='white'/>
                    <path d={tracePath(points)}/>
                    {drawVertex(points)}
                </svg>
            </div>

    );
}
