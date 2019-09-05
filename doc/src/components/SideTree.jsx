import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Col, ListGroup, ListGroupItem } from 'react-bootstrap';
/* eslint-disable react/prop-types */
export default class SideTree extends Component {

    render() {
        let { sideBarTitle, currentPage, currentSubPage, big, pages } = this.props;
        return (<Col xs={12} sm={3} md={2} className="mainCol" id="indexCol" style={{ display: big ? 'none' : 'block' }}>
            <div className="floatingIndex">
                <h4 className="sidebarTitle">
                    {sideBarTitle}
                </h4>
                <hr />
                <ListGroup>
                    {Object.keys(pages).map((key) => {
                        let item = pages[key];
                        return <div key={key}>
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
            </div>
        </Col>);
    }
}
/* eslint-enable react/prop-types */
