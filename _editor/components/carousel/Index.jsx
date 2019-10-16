import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Sortly, { ContextProvider, add, isNextSibling } from 'react-sortly';

const ItemRenderer = (props) => {
    const { data: { name, depth }, drag, drop } = props;
    const ref = React.useRef(null);

    drag(drop(ref));

    return (
        <div ref={ref} style={{ marginLeft: depth * 20 }}>
            {name}
        </div>
    );
};

export const MySortableTree = (params) => {
    console.log(params);
    const processItems = (i) => i.map(item => item.depth ? item : { ...item, depth: 0 });
    const [items, setItems] = React.useState(processItems(params.items));
    const handleChange = (newItems) => {
        console.log(newItems);
        console.log(params.selected);
        setItems(newItems);
    };

    useEffect(() => {
        console.log(processItems(params.items));
        console.log(items);
        console.log(params.selected);
        const item = params.items.find(item => item.id === params.selected);
        const isNew = !items.some(item => item.id === params.selected);
        if (item && isNew) {
            console.log(item);
            // add({ ...newItem, depth: 0 });
            console.log(isNextSibling(items, 0, 2));
            add(items, { ...item });
            setItems([...items, item]);
        }
        console.log(item, isNew);
    }, [params.items]);

    return (
        <ContextProvider>
            <Sortly key={Date.now()} items={items} onChange={handleChange}>
                {(props) => <ItemRenderer {...props} />}
            </Sortly>
        </ContextProvider>
    );
};
