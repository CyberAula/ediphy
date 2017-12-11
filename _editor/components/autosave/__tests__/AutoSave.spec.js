import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import AutoSave from "../AutoSave.jsx";

describe('Autosave', () => {
    it('should render with isRequired props', () => {
        const saving = shallow(
            <AutoSave save={() => { console.log("Saving..."); }}/>);
        expect(shallowToJson(saving)).toMatchSnapshot();
    });
});
