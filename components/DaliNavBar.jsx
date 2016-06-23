import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Col, Row, Input, Button, OverlayTrigger, Popover, Dropdown, Tooltip, MenuItem} from 'react-bootstrap';


export default class DaliNavBar extends Component {

    openPlugin(categoria) {
        this.props.setcat(categoria)
    }
 

    render() {
        let disablePlugins = (this.props.navItemsIds.length === 0  || this.props.navItemSelected == 0) ? true : false
        let modalTitle = ""
        let modalShow = false
        return (
            <Col id="iconBar">
                <img src="images/icon.png"/>
                <div className="navBarSpace" >
                  <i className="material-icons">mode_edit</i>   
                  <span className="tituloCurso" contentEditable suppressContentEditableWarning   onBlur={(e) => {this.props.changeTitle(e.target.innerHTML)}}>{this.props.title}</span>
                 </div>
 
                <button
                    className={ this.props.hideTab == 'show' && this.props.categoria == 'text' ? 'navButtonPlug active':'navButtonPlug' }
                    title='Text' disabled={false /*disablePlugins*/}
                    onClick={() => {this.openPlugin('text')}}><i className="material-icons">format_color_text</i><br/> <span
                    className="hideonresize">Texto</span></button>
                <button
                    className={ this.props.hideTab == 'show' && this.props.categoria == 'image' ? 'navButtonPlug active':'navButtonPlug' }
                    title='Images' disabled={false /*disablePlugins*/}
                    onClick={() => { this.openPlugin('image')}}><i className="material-icons">panorama</i><br/><span
                    className="hideonresize"> Imagen</span></button>
                <button
                    className={ this.props.hideTab == 'show' && this.props.categoria == 'multimedia' ? 'navButtonPlug active':'navButtonPlug' }
                    title='Multimedia' disabled={false /*disablePlugins*/}
                    onClick={() => {this.openPlugin('multimedia')}}><i className="material-icons">play_circle_filled</i><br/> <span
                    className="hideonresize">Multimedia</span></button>
                <button
                    className={ this.props.hideTab == 'show' && this.props.categoria == 'animations' ? ' navButtonPlug active':'navButtonPlug' }
                    title='Animations' disabled={false /*disablePlugins*/}
                    onClick={() => {this.openPlugin('animations')}}><i className="material-icons">toys</i><br/> <span
                    className="hideonresize">Animaciones</span></button>
                <button
                    className={ this.props.hideTab == 'show' && this.props.categoria == 'exercises' ? 'navButtonPlug active':'navButtonPlug' }
                    title='Exercises' disabled={false /*disablePlugins*/}
                    onClick={() => {this.openPlugin('exercises') }}><i className="material-icons">school</i><br/> <span
                    className="hideonresize">Ejercicios</span></button>

               

                <Dropdown  id="dropdown-menu" style={{float:'right'}}>
                    <Dropdown.Toggle noCaret className="navButton">
                        <i className="material-icons">more_vert</i><br/>
                        <span className="hideonresize" style={{fontSize: '12px'}}>Menu</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu  id="topMenu" className="pageMenu  super-colors topMenu">
                        <MenuItem disabled={this.props.undoDisabled} eventKey="1">
                            <button className="dropdownButton" title="Export HTML ZIP" disabled={this.props.undoDisabled}
                            onClick={() => this.props.export() }><i className="material-icons">file_download</i> Exportar a HTML
                            </button>
                        </MenuItem>
                        <MenuItem disabled={this.props.undoDisabled} eventKey="2">
                            <button className="dropdownButton" title="Scorm" disabled={this.props.undoDisabled}
                                    onClick={() => this.props.scorm() }><i className="material-icons">class</i> Exportar a Scorm
                            </button>
                        </MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="3"  >
                            <button  className="dropdownButton"
                                     onClick={(e) => {
                                        this.props.serverModalOpen()
                                        this.props.opens()
                               }}>
                               <i className="material-icons">folder_open</i> Abrir
                            </button>
                        </MenuItem>
                    </Dropdown.Menu>
                </Dropdown>

                <button className="navButton" 
                        style={{float:'right', marginRight: '30px'}} 
                        title="Preview" 
                        disabled={this.props.undoDisabled}
                        onClick={() =>this.props.visor()}><i className="material-icons">visibility</i>
                    <br/>
                    <span className="hideonresize" style={{fontSize: '12px'}}>Preview</span>
                </button>
            </Col>);
    }


 
}


