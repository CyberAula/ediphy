import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import AutoSave from "../AutoSave.jsx";

describe('Autosave', () => {
    it('should render with isRequired props', () => {
        const saving = shallow(
            <AutoSave save={() => {
                // eslint-disable-next-line no-console
                console.log("Saving...");
            }}/>);
        expect(shallowToJson(saving)).toMatchSnapshot();
    });
});
