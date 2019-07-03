import { FontManager } from 'font-picker';
import throttle from 'lodash.throttle';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const propTypes = {
    /**
     * a
     */
    apiKey: PropTypes.string.isRequired,
    /**
     * a
     */
    activeFont: PropTypes.string.isRequired,
    /**
     * a
     */
    onChange: PropTypes.func.isRequired,
    /**
     * a
     */
    options: PropTypes.shape({
        name: PropTypes.string,
        themeFont: PropTypes.string,
        families: PropTypes.arrayOf(PropTypes.string),
        categories: PropTypes.arrayOf(PropTypes.string),
        variants: PropTypes.arrayOf(PropTypes.string),
        limit: PropTypes.number,
        sort: PropTypes.oneOf(['alphabetical', 'popularity']),
    }),
};
const THROTTLE_INTERVAL = 250;

/**
 * React interface for the font picker
 * @see README.md
 */
export default class FontPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeFont: this.props.activeFont,
            errorText: '',
            expanded: false,
            loadingStatus: 'loading', // possible values: 'loading', 'finished', 'error'
        };

        // Determine selector suffix from font picker's name
        if (this.props.options && this.props.options.name) {
            this.pickerSuffix = `-${this.props.options.name}`;
        } else {
            this.pickerSuffix = '';
        }

        // initialize FontManager object and generate the font list
        this.fontManager = new FontManager(
            this.props.apiKey,
            this.props.activeFont,
            this.props.options
        );
        this.fontManager
            .init()
            .then(() => {
                // font list has finished loading
                this.setState({
                    errorText: '',
                    loadingStatus: 'finished',
                });
            })
            .catch(err => {
                // error while loading font list
                this.setState({
                    errorText: 'Error trying to fetch the list of available fonts',
                    loadingStatus: 'error',
                });
                // eslint-disable-next-line no-console
                console.error(this.state.errorText);
                // eslint-disable-next-line no-console
                console.error(err);
            });
    }

    /**
     * After every component update, check whether the activeFont prop has changed. If so, change the
     * font in the fontManager as well
     */
    componentDidUpdate() {
        if (this.state.activeFont !== this.props.activeFont) {
            this.setActiveFont(this.props.activeFont);
        }
    }

    /**
     * EventListener for closing the font picker when clicking anywhere outside it
     */
    onClose = (e) => {
        let targetElement = e.target; // clicked element

        do {
            if (targetElement === document.getElementById('font-picker')) {
                // click inside font picker
                return;
            }
            // move up the DOM
            targetElement = targetElement.parentNode;
        } while (targetElement);

        // click outside font picker
        this.toggleExpanded();
    };

    /**
     * Scroll event handler
     */
    onScroll = (e) => {
        e.persist();
        this.downloadPreviews(e);
    };

    /**
     * Set the font with the given font list index as the active one
     */
    setActiveFont = (fontFamily) => {
        const activeFontIndex = this.fontManager.setActiveFont(fontFamily);
        if (activeFontIndex === -1) {
            // error trying to change font
            this.setState({
                activeFont: fontFamily,
                errorText: `Cannot update activeFont: The font "${fontFamily}" is not in the font list`,
                loadingStatus: 'error',
            });
            // eslint-disable-next-line no-console
            console.error(this.state.errorText);
        } else {
            // font change successful
            this.setState({
                activeFont: fontFamily,
                errorText: '',
                loadingStatus: 'finished',
            });
        }
    };

    /**
     * Download the font previews for all visible font entries and the five after them
     */
    downloadPreviews = (e) => {
        const elementHeight = e.target.scrollHeight / this.fontManager.fonts.length;
        const downloadIndex = Math.ceil((e.target.scrollTop + e.target.clientHeight) / elementHeight);
        this.fontManager.downloadPreviews(downloadIndex + 5);
    };

    /**
     * Expand/collapse the picker's font list
     */
    toggleExpanded = () => {
        if (this.state.expanded) {
            this.setState({
                expanded: false,
            });
            document.removeEventListener('click', this.onClose);
        } else {
            this.setState({
                expanded: true,
            });
            document.addEventListener('click', this.onClose);
        }
    };

    render() {
        // generate <ul> with font list; fetch font previews on scroll
        let fontList;
        let themeFont;
        let themeFontLi;
        let themeFontId;

        if (this.state.loadingStatus === 'finished') {
            themeFont = (this.props.options && this.props.options.themeFont) ? this.fontManager.fonts.find(font => font.family === this.props.options.themeFont) : false;
            themeFont = { ...themeFont, themeDefaultFont: true };
            themeFontId = themeFont.family ? themeFont.family.replace(/\s+/g, '-').toLowerCase() : 'ubuntu';
            themeFontLi = !themeFont ? null :
                (
                    <li key={'33'}>
                        <button
                            style={ { borderTop: '1px solid #c3c3c3', borderBottom: '1px dashed #c3c3c3', fontFamily: this.props.options.themeFont }}
                            type="button"
                            className={`font-${themeFontId}${this.pickerSuffix} ${themeFont.family === this.state.activeFont ? ' active-font' : ''}`}
                            onClick={() => {
                                this.toggleExpanded();
                                this.props.onChange(themeFont);
                            }}
                            onKeyPress={() => {
                                this.toggleExpanded();
                                this.props.onChange(themeFont);
                            }}
                        >
                            Theme default font
                        </button>
                    </li>
                );
            fontList = (
                <ul className={this.state.expanded ? 'expanded' : ''} onScroll={this.onScroll}>
                    {themeFontLi}
                    {this.fontManager.fonts.map(font => {
                        const isActive = font.family === this.state.activeFont;
                        const fontId = font.family.replace(/\s+/g, '-').toLowerCase();
                        return (
                            <li key={font.family}>
                                <button
                                    type="button"
                                    className={`font-${fontId}${this.pickerSuffix} ${isActive ? 'active-font' : ''}`}
                                    onClick={() => {
                                        this.toggleExpanded();
                                        this.props.onChange(font);
                                    }}
                                    onKeyPress={() => {
                                        this.toggleExpanded();
                                        this.props.onChange(font);
                                    }}
                                >
                                    {font.family}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            );
        }

        // render font picker button and attach font list to it
        let activeFontId = this.props.activeFont.replace(/\s+/g, '-').toLowerCase();

        return (
            <div id={`font-picker${this.pickerSuffix}`} className={"font-picker-container"} title={this.state.errorText} style={{ width: '100%' }}>
                <button
                    type="button"
                    className={`dropdown-button ${this.state.expanded ? 'expanded' : ''}`}
                    onClick={this.toggleExpanded}
                    onKeyPress={this.toggleExpanded}
                    style={{ backgroundColor: 'white' }}
                >
                    <p className={`dropdown-font-name ${activeFontId ? 'font-' + activeFontId + this.pickerSuffix : ''}`}>{this.state.activeFont}</p>
                    <div className={`dropdown-icon ${this.state.loadingStatus}`} />
                </button>
                {this.state.loadingStatus === 'finished' && fontList}
            </div>
        );
    }
}

FontPicker.propTypes = propTypes;
