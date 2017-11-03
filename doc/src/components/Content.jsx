import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, ListGroup, ListGroupItem, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { srcTree, WIKI_BASE_URL, editURL } from './../content';
import Markdown from 'react-remarkable';
import loaderSvg from '../img/Rolling.svg';
import editIcon from '../img/edit.svg';
import * as Components from '../components';
const loader = <div className="loader" ><img src={loaderSvg} /></div>;
import i18n from 'i18next';
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

    changePage(page, subpage) {
        this.reload(this.props.section, this.props.subsection, page, subpage);

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

    render() {
        let tree = srcTree(i18n.t("lang"));
        let pages = this.state.pages;
        let changePage = this.changePage.bind(this);
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
                    return <Components.ComponentDoc bsClass="default" component={x}/>;

                });

            content = children;

        }
        const tooltip = (
            <Tooltip id="tooltip">{i18n.t("EditDocs")}</Tooltip>
        );

        return (
            <Row className="mainRow">
                <Col xs={12} sm={3} md={2} className="mainCol" id="indexCol" style={{ display: big ? 'none' : 'block' }}>

                    <h4 className="sidebarTitle">
                        {/* <Glyphicon style={{ fontSize: '18px' }} glyph="list-alt"/> */}{sideBarTitle}
                    </h4>
                    <hr />
                    <ListGroup>
                        {Object.keys(pages).map((key) => {
                            let item = pages[key];
                            return <div>
                                <ListGroupItem key={key} className={currentPage === key && (!currentSubPage || currentSubPage === 0) ? 'selectedNav navListItem' : 'navListItem'} >
                                    <LinkContainer to={item.path || '#'}>
                                        <span>{item.title}</span>
                                    </LinkContainer>
                                </ListGroupItem>
                                {Object.keys(item.subpages || {}).map(function(sub) {
                                    return <ListGroupItem style={{ paddingLeft: '30px' }}
                                        className={currentPage === key && currentSubPage === sub ? 'selectedNav navListItem subItem' : 'navListItem subItem'}
                                        key={ key + "_" + sub }>
                                        <LinkContainer to={item.subpages[sub].path || '#'}>
                                            <span>{item.subpages[sub].title}</span>
                                        </LinkContainer>
                                    </ListGroupItem>;
                                })}
                            </div>;
                        })}

                    </ListGroup>
                </Col>
                <Col xs={12} className="mainCol contentCol" sm={big ? 12 : 9 } md={big ? 12 : 10} >
                    <OverlayTrigger placement="bottom" overlay={tooltip}>
                        <span className="editIcon"
                        style={{ display: content && content !== "" && content !== loader ? 'inline-block' : 'none' }}>
                        <a href={this.state.url}><img style={{width: '25px'}} src={editIcon}/></a>
                    </span>
                    </OverlayTrigger>
                    {(this.state.self || !pages || !pages[currentPage] || (pages[currentPage] && pages[currentPage].hideTitle)) ? null : (<h1> {this.state.title}</h1>)}
                    {this.state.md ?
                        <div className="markdownContainer" style={{ padding: !big ? '0px' : '0px 50px' }}>
                            <Markdown>
                                { content }
                            </Markdown>
                        </div> :
                        (<div>{content}</div>)
                    }
                    {customComponent}

                </Col>
            </Row>);

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
                    console.error('error', xhr);
                    this.setState({ content: " La página solicitada no está disponible", md: content.md });
                }.bind(this));
        } else {
            this.setState({ content: "" });
        }
        this.setState({ title: title, content: loader, /* md: content.md,*/ pages: pages, self: false, page, subpage });

    }

    componentWillReceiveProps(nextProps) {
        // if (this.props !== nextProps) {
        this.reload(nextProps.section, nextProps.subsection, nextProps.page || 1, nextProps.subpage || 0);
        // }
    }
    componentDidMount() {
        this.reload(this.props.section, this.props.subsection, this.props.page, this.props.subpage);
    }
}
