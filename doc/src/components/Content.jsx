import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Grid, Row, Col, ListGroup, ListGroupItem, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { srcTree, WIKI_BASE_URL, editURL } from './../content';
import Markdown from 'react-remarkable';
import loaderSvg from '../img/Rolling.svg';
import * as Components from '../components';
import Prism from 'prismjs';
const loader = <div className="loader" ><img src={loaderSvg} /></div>;
import i18n from 'i18next';
import PropTypes from 'prop-types';
import SideTree from './SideTree';
import EditDocButton from './EditDocButton';
/* eslint-disable react/prop-types */

export default class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            content: null,
            pages: {},
            self: true,
        };
    }

    render() {
        console.log(this.props);
        let tree = srcTree(i18n.t("lang"));
        let pages = this.state.pages;
        let currentPage = this.props.page;
        let currentSubPage = this.props.subpage;
        let customComponent = null;
        if (this.state.self) {
            customComponent = React.createElement(tree[this.props.section].componentName && Components[tree[this.props.section].componentName] ? Components[tree[this.props.section].componentName] : 'span', []);
        }

        let sideBarTitle = tree[this.props.section].title;
        if (tree[this.props.section].children && tree[this.props.section].children[this.props.subsection]) {
            sideBarTitle = tree[this.props.section].children[this.props.subsection].title;
        }
        sideBarTitle = sideBarTitle || this.state.title;

        let big = this.state.self || Object.keys(this.state.pages).length === 0;
        let content = this.state.content;

        if (content && typeof content === "string" && this.state.rdg && this.state.md) {
            let parts = content.split(/<!-- (.*) -->/g);

            // render the values in <strong> tags
            let children = this.mapAlternate(parts,
                function(x) { return x; },
                function(x) {
                    return <Components.ComponentDoc bsClass="default" component={x} key={Math.random() * 10}/>;

                });

            content = children;

        }

        return (
            customComponent ? customComponent : <Row className="mainRow">
                <SideTree big={big} sideBarTitle={sideBarTitle} pages={pages} currentPage={currentPage} currentSubPage={currentSubPage} />
                <Col xs={12} className="mainCol contentCol" sm={big ? 12 : 9 } md={big ? 12 : 10} >
                    <EditDocButton show={content && content !== "" && content !== loader} link={this.state.url}/>
                    {(this.state.self || !pages || !pages[currentPage] || (pages[currentPage] && pages[currentPage].hideTitle)) ? null : (<h1> {this.state.title}</h1>)}
                    {this.state.md ?
                        <div className="markdownContainer" style={{ padding: !big ? '0px' : '0px 50px' }}>
                            <Markdown>
                                { content }
                            </Markdown>
                        </div> :
                        (<div>{content}</div>)
                    }

                </Col>
            </Row>
        );

    }

    reload(section, subsection, page, subpage) {
        let tree = srcTree(i18n.t("lang"));
        let content = tree[section];
        let url = "";
        if (subsection !== 0) {
            content = content.children[subsection];

        }

        if (content.self) {
            this.setState({ title: content.title, self: true, content: "", md: false, pages: {} });
            return;
        }
        let pages = content.pages || {};

        if (content.pages) {
            content = content.pages[page];
            if (content.subpages && subpage !== 0) {
                content = content.subpages[subpage];
            }

        }
        let title = content.title;
        if (content.fromURL && content.src) {
            url = WIKI_BASE_URL + content.src;
            let editUrl = editURL(content.src);
            $.ajax({
                url: url,
                method: "GET",
            })
                .done(function(data) {

                    this.setState({ content: data, md: content.md, rdg: content.react_docgen, url: editUrl });
                    let tableList = $('table');
                    tableList.map(table => tableList[table].classList.add('table', 'table-striped'));

                }.bind(this))
                .fail(function(xhr) {
                    // eslint-disable-next-line no-console
                    console.error('error', xhr);
                    this.setState({ content: " La página solicitada no está disponible", md: content.md });
                }.bind(this));
        } else {
            this.setState({ content: "" });
        }
        this.setState({ title: title, content: loader, /* md: content.md,*/ pages: pages, self: false, page, subpage });

    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // if (this.props !== nextProps) {
        this.reload(nextProps.section, nextProps.subsection, nextProps.page || 1, nextProps.subpage || 0);
        // }
    }
    componentDidUpdate(prevProps, prevState) {
        Prism.highlightAll();
    }
    componentDidMount() {

        this.reload(this.props.section, this.props.subsection, this.props.page, this.props.subpage);
        Prism.highlightAll();
    }
    mapAlternate(array, fn1, fn2, thisArg) {
        let fn = fn1, output = [];
        for (let i = 0; i < array.length; i++) {
            output[i] = fn.call(thisArg, array[i], i, array);
            // toggle between the two functions
            fn = fn === fn1 ? fn2 : fn1;
        }
        return output;
    }

}
Content.propTypes = {
    /**
   * Section of docs in top navbar
   */
    section: PropTypes.any,
    /**
   * Subsection of docs in top navbar (dropdown)
   */
    subsection: PropTypes.any,
    /**
   * Page of docs (left bar)
   */
    page: PropTypes.any,
    /**
   * Subpage of docs (left bar)
   */
    subpage: PropTypes.any,
};
/* eslint-enable react/prop-types */
