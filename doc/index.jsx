import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import createBrowserHistory from 'history/createBrowserHistory';
const supportsHistory = 'pushState' in window.history;
const history = createBrowserHistory();
import ReactDOM from 'react-dom';
import { Grid, Row, Navbar, Nav, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';
import Content from './src/components/Content';
import { srcTree, lookForPath } from './src/content';
import "./src/style/style.scss";
import i18n from './locales/i18n';

export default class DaliDocs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            section: 1,
            subsection: 0,
            page: 1,
            subpage: 0,
        };

        this.handleNav = this.handleNav.bind(this);
    }
    render() {
        console.log(i18n.t("lang"));
        let tree = srcTree(i18n.t("lang"));
        let navItems = <Nav>{Object.keys(tree).map(el =>{
            if (Object.keys(tree[el].children).length === 0) {
                return (<LinkContainer to={tree[el].path}>
                    <NavItem key={el} active={this.state.section === el} eventKey={el} href="#">
                        <span>{tree[el].title}</span>
                    </NavItem></LinkContainer>
                );
            }

            return (<NavDropdown key={el} active={this.state.section === el} eventKey={el} title={tree[el].title} id="basic-nav-dropdown">
                {Object.keys(tree[el].children).map(sub =>{
                    return (<LinkContainer to={tree[el].children[sub].path}>
                        <MenuItem key={el + '.' + sub} eventKey={el + '.' + sub}>
                            <span>{tree[el].children[sub].title}</span>
                        </MenuItem></LinkContainer>
                    );
                })}

            </NavDropdown>
            );

        })}</Nav>;

        const Comp = ({ match }) => {
            let url = lookForPath(match.url);
            url = url || {};
            return <Content
                section={ url.section || this.state.section }
                subsection={ url.subsection || this.state.subsection}
                page={ url.page || this.state.page }
                subpage={ url.subpage || this.state.subpage } />;
        };
        return (<Router forceRefresh={!supportsHistory}>
            <Grid fluid>
                <Row id="nbRow">
                    <Navbar collapseOnSelect >
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a href="#">Dalí Editor Docs</a>
                            </Navbar.Brand>
                        </Navbar.Header>
                        <Navbar.Toggle style={{ top: '0px', right: '0px', position: 'absolute' }}/>
                        <Navbar.Collapse>
                            {navItems}
                        </Navbar.Collapse>
                    </Navbar>
                </Row>
                <Route exact path="/" component={Comp}/>
                <Route exact path="/:section" component={Comp}/>
                <Route exact path="/:section/:page" component={Comp}/>
                <Route path="/:section/:page/:subpage" component={Comp}/>

            </Grid></Router>);

    }
    handleNav(section, subsection) {
        this.setState({ section, subsection });
    }
}

ReactDOM.render((<DaliDocs />), document.getElementById('root'));
