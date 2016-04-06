import React, {Component} from 'react';
import {Modal, Row, Col, Grid, Button, ButtonGroup} from 'react-bootstrap';

export default class Visor extends Component{
     constructor(props) {
        super(props);
      
        
    }
    render() {

        // console.log(this.props.state)
        var navItemsIds = this.props.state.navItemsIds
        var boxesById = this.props.state.boxesById
        var boxes = this.props.state.boxes
        var navItemsIds = this.props.state.navItemsIds
        var navItemSelected = this.props.state.navItemSelected || 0
        var navItemsById = this.props.state.navItemsById
        var toolbarsById = this.props.state.toolbarsById
        var elements = 0;

        var display = navItemsById[navItemSelected].type == "slide"? "sli slide":"sli doc";
        var firstparent = navItemsById[navItemSelected].parent||0
        var padre = navItemsById[firstparent].name || 'Section 0';
        var patt = /([0-9]+((\.[0-9]+)+)?)/;  //Detecta número de sección. Ej. Section (2.3.4.2)
        var sectiontitle = patt.exec(padre)? patt.exec(padre)[0]:'0';
        var today = new Date();
        var strDate = 'd-m-Y'
          .replace('d', today.getDate())
          .replace('m', today.getMonth()+1)
          .replace('Y', today.getFullYear());
        var cajas = navItemSelected!=-1? navItemsById[navItemSelected].boxes :[];

        return (
        <Modal className="visor"   show={this.props.visor} backdrop={true} bsSize="large" aria-labelledby="contained-modal-title-lg" onHide={e => {

           this.props.onVisibilityToggled()
           console.log('building')

        }}>
                <Modal.Header closeButton >
                    <Modal.Title>Preview</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{padding:'0px', height:'90%'}}>
                  <Grid fluid={true} style={{height: '100%'}} >
                      <Row style={{height: '100%', margin:'0'}}>
                
                        <Col md={12} xs={12} style={{padding: 0, height: '100%'}}>
                           <div className="outter" style={{paddingTop:'0px'}}>
                           <div id="maincontents" className={display} style={{visibility: 'visible'}} >
                           <div style={{visibility: 'visible', overflow: 'auto'}} className="caja">
                          
                           <div className="cab"> 
                                 <div className="cabtabla_numero">{sectiontitle}</div>
                                 <div className="tit_ud_cap">
                                   <h1> Título Curso -  {strDate}</h1>
                                   <h2>Título Unidad</h2>
                                 </div>
                                 <div className="cabtabla_lapiz">
                                   <img src="images/ico_alumno.gif" alt="Alumno"/><div id="alumno"> Alumno</div>
                                 </div>
                                 <div className="clear"></div>
                           </div>

                           <div className="contenido" style={{height:'auto', pointerEvents:'all !important'}}>
                           <h3>{padre}</h3>
                           <h4>{navItemsById[navItemSelected.name]}</h4> 
                           <div className="boxes" style={{position:'relative'}}>
                                {cajas.map(id => {
                                    console.log(navItemsById)
                                    console.log(id)
                                     if (boxesById[id].parent == navItemSelected){
                                        return (this.parseBox(boxesById[id]))          
                                    }
                                
                                    
                                
                            })
                         }
                           </div>
                           </div>
                           </div>
                           </div>
                           </div>
                                
                        </Col>
        
                        </Row>
                     </Grid>

                   
                </Modal.Body>
            </Modal>
        );
    }

    componentDidMount(){
        console.log('mount')
     
    }


    parseBox(box){
        console.log(box)
        var boxesById = this.props.state.boxesById
        var width = box.width[box.width.length -1]=='%' ? box.width : box.width+'px';
        var height = box.height? (box.height[box.height.length -1]=='%' ? box.height : box.height+'px'):'auto';
        var box = box

        var contenido = (box.id[1]!='s')?box.content:''

        return (<div style={{width: width, height:height, position: 'absolute', top: (box.position.y+'px'), left: (box.position.x+'px')}} >
             <div style={{pointerEvents:'all !important', height:'100%'}} dangerouslySetInnerHTML={{__html:  (box.id[1]!='s')?box.content:'' }} ></div>
             
             {box.children.map(b=>{
              
                    var nn = b; 
                    if (box.id[1]=='s') nn= b.replace('sc-','bo-');// Cambiar sc por bo en sortables
                    var alturadiv = boxesById[nn].height

                    var height2 = alturadiv? (alturadiv[alturadiv.length -1]=='%' ? alturadiv : alturadiv+'px'):'auto';
                   return ( <div style={{width:'100%', position:'relative',height:height2,display:'block'}} > {this.parseBox(boxesById[nn])}</div>)
                    })}

             </div>);
     

      

    }




}