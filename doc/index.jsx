import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();
import ReactDOM from 'react-dom';
import { Grid, Row, Navbar, Nav, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';
import Content from './src/components/Content';
import { tree } from './src/content';
import "./src/style/style.scss";

export default class DaliDocs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            section: 1,
            subsection: 0,
        };

        this.handleNav = this.handleNav.bind(this);
    }
    render() {
        let navItems = <Nav>{Object.keys(tree).map(el =>{
            if (Object.keys(tree[el].children).length === 0) {
                return (
                    <NavItem key={el} active={this.state.section === el} eventKey={el} href="#" onClick={()=>this.handleNav(el, 0)}>{tree[el].title}</NavItem>
                );
            }

            return (<NavDropdown key={el} active={this.state.section === el} eventKey={el} title={tree[el].title} id="basic-nav-dropdown">
                {Object.keys(tree[el].children).map(sub =>{
                    return (
                        <MenuItem key={el + '.' + sub} eventKey={el + '.' + sub} onClick={()=>this.handleNav(el, sub)}>{tree[el].children[sub].title}</MenuItem>
                    );
                })}

            </NavDropdown>
            );

        })}</Nav>;
        return (
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
                <Content
                    handleNav={this.handleNav}
                    section={this.state.section}
                    subsection={this.state.subsection}/>
            </Grid>);

    }
    handleNav(section, subsection) {
        this.setState({ section, subsection });
    }
}

ReactDOM.render((<DaliDocs />), document.getElementById('root'));
