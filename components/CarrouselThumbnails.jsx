import React, {Component} from 'react';
import Thumbnail from '../components/Thumbnail';

export default class CarrouselThumbnail extends Component {
    render(){
        return (
            <div>
            {
                this.props.navItemsIds.map( id => {
                    let isSelected = false;
                    if(this.props.navItemSelected === id)
                        isSelected = true;
                    return <Thumbnail id={id}
                                      key={id}
                                      isSelected={isSelected}
                                      onNavItemSelected={this.props.onNavItemSelected}
                                      onNavItemRemoved={this.props.onNavItemRemoved} />;
                })
            }
            </div>
        );
    }
}
