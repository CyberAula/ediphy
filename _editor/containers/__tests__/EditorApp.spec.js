import React from 'react';
import renderer from 'react-test-renderer';
import EditorApp from '../EditorApp.jsx';
describe('EditorApp (Snapshot)', () => {
    it('EditorApp renders things', () => {
        const component = renderer.create(<EditorApp />);
        const json = component.toJSON();
        expect(json).toMatchSnapshot();
    });
});

