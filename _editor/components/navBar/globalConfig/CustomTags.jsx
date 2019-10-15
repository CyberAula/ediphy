import React from 'react';
import Sortly, { ContextProvider } from 'react-sortly';
import i18n from "i18next";
import styled from 'styled-components';

export const CloseButton = styled.i`
    color: #fff;
    &.material-icons{
        opacity: 0.5;
        font-size: 0.9em;
    }
    &.material-icons:hover{
        opacity: 1;
    }
`;

export const Tag = styled.div`
    display: inline-block;
    background-color: ${props => props.color ?? '#17CFC8'};
    color: ${props => props.textColor ?? 'white'};
    margin: 2px;
`;

export const TextInput = styled.input.attrs({ type: 'text' })`
    display: block;
    width: 100%;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857;
    margin-top: 6px;
    color: #555555;
    border-radius: 0;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
`;

const ItemRenderer = (props) => {
    // eslint-disable-next-line react/prop-types
    const { data: { name }, drag, drop } = props;
    const ref = React.useRef(null);

    drag(drop(ref));
    return (
        // eslint-disable-next-line react/prop-types
        <Tag key={props.data.id} ref={ref}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '2px', paddingLeft: '5px' }}>
                {name}
                {/* eslint-disable-next-line react/prop-types */}
                <CloseButton className="material-icons" onClick={ () => props.onDelete(props.data.id)}>
                close
                </CloseButton>
            </div>
        </Tag>
    );
};

const Input = (props) => {
    const [value, setValue] = React.useState('');
    const onKeyDown = e => {
        if(e.key === 'Enter') {
            if ((/\S/).test(e.target.value)) {
                // string is not empty and not just whitespace
                // eslint-disable-next-line react/prop-types
                props.onEnter(e.target.value);
                setValue('');
            }
        }
    };

    return (
        <TextInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={i18n.t('globalConfig.course_title')}
            onKeyDown={onKeyDown}
        />
    );
};
const MySortableTree = (props) => {
    const [items, setItems] = React.useState([
    ]);
    const handleChange = (newItems) => {
        // Parche porque parece que la prop maxDepth no esta funcionando correctamente
        let processedItems = newItems.map(item => ({ ...item, depth: 1 }));
        setItems(processedItems);
        let tags = processedItems.map(i => i.name);
        // eslint-disable-next-line react/prop-types
        props.handleTagsChange(tags);
    };

    const onEnter = (newVal) => {
        let maxKey = items.reduce((prev, current) => (prev.id > current.id) ? prev : current, { id: 0 });
        const newItem = { id: maxKey.id + 1, name: newVal, depth: 1 };
        setItems([...items, newItem]);
    };

    const onDelete = id => {
        let newItems = items.filter(item => item.id !== id);
        setItems(newItems);
    };

    return (
        <ContextProvider>
            <div style={{ width: '100%' }}>
                <Sortly key={items.length} items={items} onChange={handleChange} horizontal maxDepth={1}>
                    {/* eslint-disable-next-line no-shadow */}
                    {(props) => <ItemRenderer {...props} onDelete={onDelete}/>}
                </Sortly>
            </div>
            <Input onEnter={onEnter}/>
        </ContextProvider>
    );
};

export default class CustomTags extends React.Component {
    render() {
        return (
            <ContextProvider>
                <MySortableTree { ...this.props }/>
            </ContextProvider>
        );
    }
}
