import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import i18n from 'i18next';

export default class VisorPlayer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        /*let navItemsIds = this.props.navItemsIds;*/
        /*Para permitir previsualizar secciones en el visor, descomentar la línea anterior y comentar la siguiente */
        let navItemsIds = this.props.navItemsIds.filter(this.isntSection);
        let navItemsById = this.props.navItemsById;
        let navItemSelected = this.props.navItemSelected;

        let index = navItemsIds.indexOf(navItemSelected);
        let maxIndex = navItemsIds.length;

        return(
            /* jshint ignore:start */
            <div id="player">
                <OverlayTrigger placement="bottom" delay={1} overlay={this.createTooltip("first","First")}>
                    <Button className="playerButton"
                            bsStyle="primary"
                            disabled={maxIndex==0}
                            onClick={(e)=>{this.props.changePage(navItemsIds[0])}}>
                        <i className="material-icons">first_page</i>
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" delay={0} trigger={['hover']} rootClose={true} overlay={this.createTooltip("previous","Previous")}>
                    <Button className="playerButton"
                            bsStyle="primary"
                            disabled={index==0 || maxIndex==0}
                            onClick={(e)=>{this.props.changePage(navItemsIds[Math.max(index-1, 0)])}}>
                        <i className="material-icons">chevron_left</i>
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" delay={0} trigger={['hover']} rootClose={true} overlay={this.createTooltip("next","Next")}>
                    <Button className="playerButton"
                            bsStyle="primary"
                            disabled={index==maxIndex-1 || maxIndex==0}
                            onClick={(e)=>{this.props.changePage(navItemsIds[Math.min(index+1, maxIndex-1)])}}>
                        <i className="material-icons">chevron_right</i>
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" delay={0} trigger={['hover']} rootClose={true} overlay={this.createTooltip("last","Last")}>
                    <Button className="playerButton"
                            bsStyle="primary"
                            disabled={maxIndex==0}
                            onClick={(e)=>{this.props.changePage(navItemsIds[maxIndex-1])}}>
                        <i className="material-icons">last_page</i>
                    </Button>
                </OverlayTrigger>
            </div>
            /* jshint ignore:end */
        );
    }

    isntSection(page){
        return (page.indexOf("se") === -1);
    }

    createTooltip(id, message){
        /* jshint ignore:start */
        /*Añadir aquí i18n next para traducir el tooltip*/
        return(<Tooltip className="visorNavTooltip" id={id}>{message}</Tooltip>);
        /* jshint ignore:end */
    }

}
