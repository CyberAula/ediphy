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
// import {languages} from './scripts/reactdocgenmd';
export default class Docs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            section: 1,
            subsection: 0,
            page: 1,
            subpage: 0,
            lang: "",
        };

        this.handleNav = this.handleNav.bind(this);
    }
    render() {
        let tree = srcTree(i18n.t("lang"));
        let navItems = <Nav>{Object.keys(tree).map(el =>{
            if (tree[el].isExternal) {
                return (<NavItem key={el} active={this.state.section === el} eventKey={el} href={tree[el].path}
                    onClick={()=>{window.location = tree[el].path;}}>
                    <span className="ediphy_blue" >{tree[el].title}</span>
                </NavItem>);

            }

            if (Object.keys(tree[el].children).length === 0) {
                return (<LinkContainer to={tree[el].path} key={el}>
                    <NavItem key={"nav_" + el} active={this.state.section === el} href="#">
                        <span>{tree[el].title}</span>
                    </NavItem></LinkContainer>
                );
            }

            return (<NavDropdown key={el} active={this.state.section === el} title={tree[el].title} id="basic-nav-dropdown">
                {Object.keys(tree[el].children).map(sub =>{
                    return (<LinkContainer to={tree[el].children[sub].path} key={sub}>
                        <MenuItem key={el + '.' + sub} eventKey={el + '.' + sub}>
                            <span>{tree[el].children[sub].title}</span>
                        </MenuItem></LinkContainer>
                    );
                })}

            </NavDropdown>
            );

        })}

        </Nav>;

        const Comp = ({ match, key }) => {
            console.log(match);
            let url = lookForPath(match.url);
            url = url || {};
            return <Content key={key}
                section={ url.section || this.state.section }
                subsection={ url.subsection || this.state.subsection}
                page={ url.page || this.state.page }
                subpage={ url.subpage || this.state.subpage } />;
        };

        const ChangeLang = ({ lang }) => {
            return <button className="langButton" onClick={()=>{i18n.changeLanguage(lang); this.forceUpdate();}}>{lang}</button>;
        };

        return (<Router onUpdate={() => window.scrollTo(0, 0)} forceRefresh={!supportsHistory}>
            <Grid fluid id="grid">
                <Navbar collapseOnSelect id="nb">
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#">Ediphy Docs</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Navbar.Toggle style={{ top: '0px', right: '0px', position: 'absolute' }}/>
                    <Navbar.Collapse>
                        {navItems}

                    </Navbar.Collapse>
                    <span id="langSelector">
                        <ChangeLang lang="en"/>・<ChangeLang lang="es"/>
                    </span>
                </Navbar>

                <Route key={1} exact path="/:section" component={Comp}/>
                <Route key={2} exact path="/:section/:page" component={Comp}/>
                <Route key={3} path="/:section/:page/:subpage" component={Comp}/>
                <Route key={4} exact path="/" component={Comp}/>
            </Grid>
        </Router>);

    }
    handleNav(section, subsection) {
        this.setState({ section, subsection });
    }
}

ReactDOM.render((<Docs />), document.getElementById('root'));

