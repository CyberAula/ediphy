import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Col, Input,Button, OverlayTrigger, Popover} from 'react-bootstrap';


export default class DaliNavBar extends Component {
    openPlugin(categoria){
            this.props.toggle(this.props.navItemSelected,false,0)
            this.props.setcat(categoria)
        }

    render() {
        
        return (
                <div className="navBar">

                    <Col id="iconBar" >

                        <button className="navButton" disabled={this.props.undoDisabled} onClick={() => this.props.undo()}><i className="fa fa-mail-reply fa-1"></i>  </button>
                        <button className="navButton" disabled={this.props.redoDisabled} onClick={() => this.props.redo()}><i className="fa fa-mail-forward fa-1 "></i>  </button>
                        <button className="navButton" disabled={this.props.undoDisabled} onClick={() =>this.props.visor()}><i className="fa fa-eye fa-1 "></i>  </button>
                        <button className="navButton" disabled={this.props.undoDisabled} onClick={() => this.props.export() }><i className="fa fa-download fa-1 "></i> </button>
                        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={<Popover id="is_busy_popover">{this.props.isBusy}</Popover>}>
                            <button  disabled={this.props.undoDisabled} className="navButton" onClick={() => { this.props.save()
                            }}><i className="fa fa-save fa-1 "></i>  </button>
                        </OverlayTrigger>
                        <OverlayTrigger trigger="click"  rootClose placement="bottom" overlay={<Popover id="is_busy_popover">{this.props.isBusy}</Popover>}>
                            <button style={{borderRight: '2px solid #f8a090'}}  className="navButton" onClick={() => {
                               this.props.opens()
                            }}><i className="fa fa-folder-open fa-1 "></i>  </button>
                        </OverlayTrigger>
                        <button className={ this.props.hideTab == 'show' && this.props.categoria == 'all' ? 'navButtonPlug active':'navButtonPlug' } title='All' disabled={(this.props.navItemsIds.length === 0 ? true : false)} onClick={() => {this.openPlugin('all') }}><i className="fa fa-th fa-1 "></i>  <span className="hideonresize">All</span> </button>
                        <button className={ this.props.hideTab == 'show' && this.props.categoria == 'temp' ? 'navButtonPlug active':'navButtonPlug' } title='Temp' disabled={(this.props.navItemsIds.length === 0 ? true : false)} onClick={() =>  {this.openPlugin('temp')} }><i className="fa fa-clock-o fa-1 "></i> <span className="hideonresize"> Temp</span> </button>                       
                        <button className={ this.props.hideTab == 'show' && this.props.categoria == 'text' ? 'navButtonPlug active':'navButtonPlug' } title='Text' disabled={(this.props.navItemsIds.length === 0 ? true : false)} onClick={() => {this.openPlugin('text')}}><i className="fa fa-edit fa-1 "></i> <span className="hideonresize">Texto</span>  </button>
                        <button className={ this.props.hideTab == 'show' && this.props.categoria == 'image' ? 'navButtonPlug active':'navButtonPlug' } title='Animaciones' disabled={(this.props.navItemsIds.length === 0 ? true : false)} onClick={() => { this.openPlugin('image')}}><i className="fa fa-photo fa-1 "></i><span className="hideonresize"> Imagen</span>  </button>
                        <button className={ this.props.hideTab == 'show' && this.props.categoria == 'multimedia' ? 'navButtonPlug active':'navButtonPlug' } title='Multimedia' disabled={(this.props.navItemsIds.length === 0 ? true : false)} onClick={() => {this.openPlugin('multimedia')}}><i className="fa fa-film fa-1 "></i> <span className="hideonresize">Multimedia</span>  </button>
                        <button className={ this.props.hideTab == 'show' && this.props.categoria == 'animations' ? ' navButtonPlug active':'navButtonPlug' } title='Animations' disabled={(this.props.navItemsIds.length === 0 ? true : false)} onClick={() => {this.openPlugin('animations')}}><i className="fa fa-play fa-1 "></i> <span className="hideonresize">Animaciones</span>  </button>
                        <button className={ this.props.hideTab == 'show' && this.props.categoria == 'exercises' ? 'navButtonPlug active':'navButtonPlug' } title='Exercises' disabled={(this.props.navItemsIds.length === 0 ? true : false)} onClick={() => {this.openPlugin('exercises') }}><i className="fa fa-mortar-board fa-1 "></i>  <span className="hideonresize">Ejercicios</span> </button>
                        
                   </Col>
                </div>
       

            );
    }



    componentDidMount() {

    }
}
