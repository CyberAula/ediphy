import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap';
import { tree } from './../content';
import Markdown from 'react-remarkable';
import loaderSvg from '../img/Rolling.svg';
import Home from './Home';
import About from './About';
const loader = <div className="loader" ><img src={loaderSvg} /></div>;

export default class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            page: 1,
            subpage: 0,
            content: null,
            pages: {},
            self: true,
        };
    }

    changePage(page, subpage) {
        // this.setState({ page, subpage });
        this.reload(this.props.section, this.props.subsection, page, subpage);

    }

    render() {
        let pages = this.state.pages;
        let changePage = this.changePage.bind(this);
        let currentPage = this.state.page;
        let currentSubPage = this.state.subpage;
        let customComponent = null;
        if (this.state.self) {
            switch(this.props.section) {
            case 1:
                customComponent = <Home/>;
                break;
            case 2:
                customComponent = <About/>;
                break;
            default:
                break;
            }
        }

        let sideBarTitle = tree[this.props.section].title;
        if (tree[this.props.section].children && tree[this.props.section].children[this.props.subsection]) {
            sideBarTitle = tree[this.props.section].children[this.props.subsection].title;
        }
        sideBarTitle = sideBarTitle || this.state.title;

        let big = this.state.self || Object.keys(this.state.pages).length === 0;
        return (
            <Row>
                <Col xs={12} sm={3} className="mainCol" style={{ display: big ? 'none' : 'block' }}>
                    <h4 className="sidebarTitle">{sideBarTitle}</h4>
                    <ListGroup>
                        {Object.keys(pages).map(function(key) {
                            let item = pages[key];
                            return <div><ListGroupItem key={key}
                                className={currentPage === key && currentSubPage === 0 ? 'selectedNav navListItem' : 'navListItem'}
                                onClick={()=>{changePage(key, 0);}}>{item.title}</ListGroupItem>
                            {Object.keys(item.subpages || {}).map(function(sub) {
                                return <ListGroupItem style={{ paddingLeft: '25px' }}
                                    className={currentPage === key && currentSubPage === sub ? 'selectedNav navListItem subItem' : 'navListItem subItem'}
                                    key={ key + "_" + sub }
                                    onClick={()=>{changePage(key, sub);}}>{item.subpages[sub].title}</ListGroupItem>;
                            })}
                            </div>;
                        })}

                    </ListGroup>
                </Col>
                <Col xs={12} className="mainCol" sm={big ? 12 : 9 } >
                    {(this.state.self || !pages || !pages[currentPage] || (pages[currentPage] && pages[currentPage].hideTitle)) ? null : (<h1> {this.state.title}</h1>)}
                    {this.state.md ?
                        <div className="markdownContainer" style={{ padding: !big ? '0px' : '0px 50px' }}>
                            <Markdown>
                                { this.state.content }
                            </Markdown>
                        </div> :
                        (<div>{this.state.content}</div>)
                    }
                    {customComponent}

                </Col>
            </Row>);

    }

    reload(section, subsection, page, subpage) {
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
            url = content.src;

            $.ajax({
                url: url,
                method: "GET" })
                .done(function(data) {
                    this.setState({ content: data, md: content.md });
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
        if (this.props !== nextProps) {
            this.reload(nextProps.section, nextProps.subsection, 1, 0);
        }
    }
    componentDidMount() {
        this.reload(this.props.section, this.props.subsection, this.state.page, this.state.subpage);
    }
}
