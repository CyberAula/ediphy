
describe('EditorApp (Snapshot)', () => {
    it('EditorApp renders things', () => {
        const component = renderer.create(<EditorApp />);
        const json = component.toJSON();
        expect(json).toMatchSnapshot();
    });
});

import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import EditorApp from '../EditorApp.jsx';

describe('EditorApp (Snapshot) Autosave', () => {
    it('should render with isRequired props', () => {
        const saving = shallow(
            <AutoSave save={() => {this.dispatchAndSetState(exportStateAsync({ present: this.props.store.getState().present }));}}/>);
        expect(shallowToJson(saving)).toMatchSnapshot();
    });
});

