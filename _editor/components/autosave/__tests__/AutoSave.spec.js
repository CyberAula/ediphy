import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import AutoSave from "../AutoSave.jsx";

describe('Autosave', () => {
    it('AutoSave renders Saving...', () => {
        const saving = shallow(<AutoSave save={() => {this.dispatchAndSetState(exportStateAsync({ present: this.props.store.getState().present }));}}/>);
        expect(toJson(saving)).toMatchSnapshot();
    });
});
