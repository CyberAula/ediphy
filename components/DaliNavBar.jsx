import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Col, Row, Input, Button, OverlayTrigger, Popover, Dropdown, Tooltip, MenuItem} from 'react-bootstrap';


export default class DaliNavBar extends Component {
    openPlugin(categoria) {
        this.props.setcat(categoria)
    }

    render() {
        let disablePlugins = (this.props.navItemsIds.length === 0  || this.props.navItemSelected == 0) ? true : false
        return (
            <Col id="iconBar">
                <img src="images/icon.png"/>

                <button className="navButton" title="Undo" disabled={this.props.undoDisabled} style={{width:80}}
                        onClick={() => this.props.undo()}><i className="fa fa-mail-reply fa-1"></i></button>
                <button className="navButton" title="Redo" disabled={this.props.redoDisabled} style={{width:80}}
                        onClick={() => this.props.redo()}><i className="fa fa-mail-forward fa-1 "></i></button>
               
                
                <button
                    className={ this.props.hideTab == 'show' && this.props.categoria == 'all' ? 'navButtonPlug active':'navButtonPlug' }
                    title='All' disabled={disablePlugins}
                    onClick={() => {this.openPlugin('all') }}><i className="fa fa-th fa-1 "></i><br/> <span
                    className="hideonresize">All</span></button>
                <button
                    className={ this.props.hideTab == 'show' && this.props.categoria == 'text' ? 'navButtonPlug active':'navButtonPlug' }
                    title='Text' disabled={disablePlugins}
                    onClick={() => {this.openPlugin('text')}}><i className="fa fa-edit fa-1 "></i><br/> <span
                    className="hideonresize">Texto</span></button>
                <button
                    className={ this.props.hideTab == 'show' && this.props.categoria == 'image' ? 'navButtonPlug active':'navButtonPlug' }
                    title='Images' disabled={disablePlugins}
                    onClick={() => { this.openPlugin('image')}}><i className="fa fa-photo fa-1 "></i><br/><span
                    className="hideonresize"> Imagen</span></button>
                <button
                    className={ this.props.hideTab == 'show' && this.props.categoria == 'multimedia' ? 'navButtonPlug active':'navButtonPlug' }
                    title='Multimedia' disabled={disablePlugins}
                    onClick={() => {this.openPlugin('multimedia')}}><i className="fa fa-film fa-1 "></i><br/> <span
                    className="hideonresize">Multimedia</span></button>
                <button
                    className={ this.props.hideTab == 'show' && this.props.categoria == 'animations' ? ' navButtonPlug active':'navButtonPlug' }
                    title='Animations' disabled={disablePlugins}
                    onClick={() => {this.openPlugin('animations')}}><i className="fa fa-play fa-1 "></i><br/> <span
                    className="hideonresize">Animaciones</span></button>
                <button
                    className={ this.props.hideTab == 'show' && this.props.categoria == 'exercises' ? 'navButtonPlug active':'navButtonPlug' }
                    title='Exercises' disabled={disablePlugins}
                    onClick={() => {this.openPlugin('exercises') }}><i className="fa fa-mortar-board fa-1 "></i><br/> <span
                    className="hideonresize">Ejercicios</span></button>

                

                <Dropdown  id="dropdown-menu" style={{float:'right'}}>
                    <Dropdown.Toggle noCaret className="navButton">
                        <i className="fa fa-ellipsis-v fa-1"></i><br/>
                        <span style={{fontSize: '12px'}}>Menu</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu  className="super-colors">
                        <MenuItem disabled={this.props.undoDisabled} eventKey="1">
                            <button className="dropdownButton" title="Export HTML ZIP" disabled={this.props.undoDisabled}
                            onClick={() => this.props.export() }><i className="fa fa-download fa-1 "></i> Exportar a HTML
                            </button>
                        </MenuItem>
                        <MenuItem disabled={this.props.undoDisabled} eventKey="2">
                            <button className="dropdownButton" title="Scorm" disabled={this.props.undoDisabled}
                                    onClick={() => this.props.scorm() }><i className="fa fa-cart-arrow-down fa-1 "></i> Exportar a Scorm
                            </button>
                        </MenuItem>
                        <MenuItem divider />
                        <MenuItem disabled={this.props.undoDisabled} onSelect={this.props.save} eventKey="3">
                            <OverlayTrigger trigger="click"   
                                            placement="bottom"
                                            overlay={<Popover id="is_busy_popover">{this.props.isBusy}</Popover>}>
                                <button disabled={this.props.undoDisabled} 
                                        className="dropdownButton"
                                        onClick={(e) => {
                                         this.props.save()
                                        }}>
                                        <i className="fa fa-save fa-1 "></i> Guardar
                                </button>
                            </OverlayTrigger>
                        </MenuItem>
                        <MenuItem eventKey="4" onSelect={this.props.opens}>
                            <OverlayTrigger trigger="click"  
                                            placement="bottom" 
                                            overlay={<Popover id="is_busy_popover">{this.props.isBusy}</Popover>}>
                                <button  className="dropdownButton"
                                         onClick={(e) => {
                                    this.props.opens()
                                   }}>
                                   <i className="fa fa-folder-open fa-1 "></i> Abrir
                                </button>

                            </OverlayTrigger>
                        </MenuItem>
                    </Dropdown.Menu>
                </Dropdown>
                <button className="navButton" 
                        style={{float:'right', marginRight: '30px'}} 
                        title="Preview" 
                        disabled={this.props.undoDisabled}
                        onClick={() =>this.props.visor()}><i className="fa fa-eye fa-1 "></i>
                    <br/>
                    <span style={{fontSize: '12px'}}>Preview</span>
                </button>
            </Col>);
    }
}


