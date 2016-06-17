import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button,Col} from 'react-bootstrap';
import CarrouselList from '../components/CarrouselList';
 
export default class DaliCarousel extends Component{

    render(){
        let displayModeClassName = "";
        let carrouselContent;
        if (this.props.displayMode === "list") {
            displayModeClassName = "fa fa-th-large";
            carrouselContent = <CarrouselList boxes={this.props.boxes}
                                              navItemsIds={this.props.navItemsIds}
                                              navItems={this.props.navItems}
                                              navItemSelected={this.props.navItemSelected}
                                              onBoxAdded={this.props.onBoxAdded}
                                              onPageAdded={this.props.onPageAdded}
                                              onSectionAdded={this.props.onSectionAdded}
                                              onNavItemSelected={this.props.onNavItemSelected}
                                              onNavItemExpanded={this.props.onNavItemExpanded}
                                              onNavItemRemoved={this.props.onNavItemRemoved}
                                              onNavItemReorded={this.props.onNavItemReorded}  />;
        }
        return( 

          <div  style={{ width: this.props.carouselShow ? '16.66666%':'80px' }} id="colLeft">
            <div className="wrapperCarousel">
            <p  style={{textAlign: this.props.carouselShow ? 'left' : 'center'}} 
                onClick={() => {this.toggleWidth()}} 
                className={this.props.carouselShow ? 'carouselListTitle toolbarSpread':'carouselListTitle toolbarHide'}>
              <i className={this.props.carouselShow ? "fa fa-list-ol":"fa fa-list-ol fa-2x" }></i> {!this.props.carouselShow ? <br/>:null} ÍNDICE
            </p>
            <div id="indice" 
                 className="daliCarousel" 
                 key="indice" 
                 style={{height: '100%'}} >
                {this.props.carouselShow ? carrouselContent : <br/>}
            </div>
            <div className="pestanaCarousel"  
                 id="pestcar" 
                 onClick={() => {this.toggleWidth() }}>
                 {/*  <i className="fa fa-list-alt fa-2x"> </i> */}           
             </div>
         
            </div>
          </div>
        );
    }

  toggleWidth(){ // DaliCarousel slider
    this.props.onToggleWidth();
  }

}
