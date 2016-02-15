import React, {Component} from 'react';
import Thumbnail from '../components/Thumbnail';

export default class CarrouselThumbnail extends Component {
    render(){
        return (
            <div style={{overflowY: 'auto', height: '100%'}}>
            {
                this.props.navItemsIds.map( id => {
                    let isSelected = false;
                    if(this.props.navItemSelected === id)
                        isSelected = true;
                    return <Thumbnail id={id}
                                      key={id}
                                      boxes={this.props.boxes}
                                      isSelected={isSelected}
                                      navItemsIds={this.props.navItemsIds}
                                      navItems={this.props.navItems}
                                      onNavItemSelected={this.props.onNavItemSelected}
                                      onNavItemRemoved={this.props.onNavItemRemoved} />;
                })
            }
            </div>
        );
    }




}
