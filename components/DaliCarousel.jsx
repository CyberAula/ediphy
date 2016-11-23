import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button,Col} from 'react-bootstrap';
import CarrouselList from '../components/CarrouselList';
import i18n from 'i18next';

export default class DaliCarousel extends Component {

    render() {
        let displayModeClassName = "";
        let carrouselContent;
        if (this.props.displayMode === "list") {
            /* jshint ignore:start */
            carrouselContent = <CarrouselList caller={0}
                                              boxes={this.props.boxes}
                                              navItemsIds={this.props.navItemsIds}
                                              navItems={this.props.navItems}
                                              navItemSelected={this.props.navItemSelected}
                                              onBoxAdded={this.props.onBoxAdded}
                                              onTitleChange={this.props.onTitleChange}
                                              onNavItemAdded={this.props.onNavItemAdded}
                                              onNavItemSelected={this.props.onNavItemSelected}
                                              onNavItemExpanded={this.props.onNavItemExpanded}
                                              onNavItemRemoved={this.props.onNavItemRemoved}
                                              onNavItemToggled={this.props.onNavItemToggled}
                                              onNavItemReorded={this.props.onNavItemReorded}/>;
            /* jshint ignore:end */
        }
        return (
            /* jshint ignore:start */
            <div style={{
                width: this.props.carouselShow ? (this.props.carouselFull ? '100%' : '16.66666%') : '80px',
                overflowX:  this.props.carouselFull ? 'hidden' : ''
                }} id="colLeft">
                <div className="wrapperCarousel">
                    <div style={{textAlign: this.props.carouselShow ? 'left' : 'center'}}
                       onClick={() => {this.props.onToggleWidth()}}
                       className={this.props.carouselShow ? 'carouselListTitle toolbarSpread':'carouselListTitle toolbarHide'}>
                        <i style={{fontSize: this.props.carouselShow ? "16px":"28px" }} className="material-icons">format_list_numbered</i>
                        {!this.props.carouselShow ? <br/> : null}
                        <div className="textIndex">{i18n.t('INDEX')}</div>
                        <i style={{
                            fontSize: this.props.carouselShow ? "16px":"32px",
                            position: this.props.carouselShow ? "absolute" : "initial",
                            right: 0
                            }}
                           className="material-icons"
                           onClick={e => {
                                this.props.onToggleFull();
                                e.stopPropagation();
                           }}>{!this.props.carouselFull ? "keyboard_arrow_right" : "keyboard_arrow_left"}
                        </i>
                        <div className="clear"></div>
                    </div>
                    <p className="courseTitleCarousel"> {this.props.title}</p>
                    <div id="indice"
                         className="daliCarousel"
                         key="indice"
                         style={{height: '100%'}}>
                        {this.props.carouselShow ? carrouselContent : <br/>}
                    </div>
                    <div className="pestanaCarousel"
                         id="pestcar"
                         onClick={() => {this.props.onToggleWidth() }}>

                    </div>

                </div>
            </div>
            /* jshint ignore:end */
        );
    }
}
