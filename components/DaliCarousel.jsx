import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import CarrouselList from '../components/CarrouselList';
import CarrouselThumbnails from '../components/CarrouselThumbnails';

export default class DaliCarousel extends Component{
    render(){
        let displayModeClassName = "";
        let carrouselContent;
        if(this.props.displayMode === "thumbnail") {
            displayModeClassName = "fa fa-th-list";
            carrouselContent = <CarrouselThumbnails navItemsIds={this.props.navItemsIds}
                                                    navItems={this.props.navItems}
                                                    boxes={this.props.boxes}
                                                    navItemSelected={this.props.navItemSelected}
                                                    onNavItemSelected={this.props.onNavItemSelected}
                                                    onNavItemRemoved={this.props.onNavItemRemoved} />;
        } else if (this.props.displayMode === "list") {
            displayModeClassName = "fa fa-th-large";
            carrouselContent = <CarrouselList boxes={this.props.boxes}
                                              navItemsIds={this.props.navItemsIds}
                                              navItems={this.props.navItems}
                                              navItemSelected={this.props.navItemSelected}
                                              onPageAdded={this.props.onPageAdded}
                                              onSectionAdded={this.props.onSectionAdded}
                                              onNavItemSelected={this.props.onNavItemSelected}
                                              onNavItemExpanded={this.props.onNavItemExpanded}
                                              onNavItemRemoved={this.props.onNavItemRemoved} />;
        }
        return(
            <div className="daliCarousel" >
                {carrouselContent}
                <Button style={{position: 'absolute', right: 0, bottom: 0}} onClick={e => {
                    let newMode = "list";
                    switch(this.props.displayMode){
                        case "list":
                            newMode = "thumbnail";
                            break;
                        case "thumbnail":
                            newMode = "list";
                            break;
                    }
                    this.props.onDisplayModeChanged(newMode);
                    e.stopPropagation();
                }}>
                    <i className={displayModeClassName}></i>
                </Button>
            </div>
        );
    }
}