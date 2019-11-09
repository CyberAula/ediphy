import React from 'react';
import ReactDOM from 'react-dom';
import { FormControl, InputGroup, Glyphicon } from 'react-bootstrap';
import i18n from 'i18next';
import PropTypes from 'prop-types';

export default class SearchComponent extends React.Component {
    render() {
        const { disabled, onChange, onSearch } = this.props;
        return <InputGroup className="searchInputTopBar">
            <FormControl onChange={onChange} autoFocus ref="query" type="text" disabled={disabled}/>
            <InputGroup.Addon className="inputSearch" onClick={(e) => {
                onSearch(ReactDOM.findDOMNode(this.refs.query).value);
                e.preventDefault();
            }}>
                <Glyphicon glyph="search" />  {i18n.t("FileModal.APIProviders.search")}
            </InputGroup.Addon>
        </InputGroup>;
    }
}
SearchComponent.propTypes = {
    /**
     * Function called when the user clicks the search button
     */
    onSearch: PropTypes.func,
    /**
     * Function called when the user types on the search box
     */
    onChange: PropTypes.func,
    /**
   * Input disabled
   */
    disabled: PropTypes.bool,
};
