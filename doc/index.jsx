import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Navbar, Nav, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';
import Content from './src/components/Content';
import { tree } from './src/content';
import "./src/style/style.css";

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
        return (
            <Grid fluid>
                <Row id="nbRow">
                    <Navbar collapseOnSelect>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a href="#">Dalí Editor Docs</a>
                            </Navbar.Brand>
                        </Navbar.Header>
                        <Navbar.Toggle style={{ top: '0px', right: '0px', position: 'absolute' }}/>
                        <Navbar.Collapse>
                            <Nav>
                                <NavItem active={this.state.section === 1} eventKey={1} href="#" onClick={()=>this.handleNav(1, 0)}>{tree[1].title}</NavItem>
                                <NavItem active={this.state.section === 2} eventKey={2} href="#" onClick={()=>this.handleNav(2, 0)}>{tree[2].title}</NavItem>
                                <NavItem active={this.state.section === 3} eventKey={3} href="#" onClick={()=>this.handleNav(3, 0)}>{tree[3].title}</NavItem>
                                <NavDropdown active={this.state.section === 4} eventKey={4} title={tree[4].title} id="basic-nav-dropdown">
                                    <MenuItem eventKey={4.1} onClick={()=>this.handleNav(4, 1)}>{tree[4].children[1].title}</MenuItem>
                                    <MenuItem eventKey={4.2} onClick={()=>this.handleNav(4, 2)}>{tree[4].children[2].title}</MenuItem>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Row>
                <Content
                    section={this.state.section}
                    subsection={this.state.subsection}/>
            </Grid>);

    }
    handleNav(section, subsection) {
        this.setState({ section, subsection });
    }
}

ReactDOM.render((<DaliDocs />), document.getElementById('root'));
