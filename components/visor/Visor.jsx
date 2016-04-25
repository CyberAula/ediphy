import React, {Component} from 'react';
import {Modal, Row, Col, Grid, Button, ButtonGroup} from 'react-bootstrap';
import PluginPlaceholder from '../PluginPlaceholder';
import DaliTitle from '../DaliTitle';
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
        var navItem = navItemsById[navItemSelected]
        var elements = 0;

        var display = navItem.type == "slide"? "sli slide":"sli doc";
        var firstparent = navItem.parent||0
        var padre = navItemsById[firstparent].name || 'Section 0';
        var patt = /([0-9]+((\.[0-9]+)+)?)/;  //Detecta número de sección. Ej. Section (2.3.4.2)
        var sectiontitle = patt.exec(padre)? patt.exec(padre)[0]:'0';
        var today = new Date();
        var strDate = 'd-m-Y'
          .replace('d', today.getDate())
          .replace('m', today.getMonth()+1)
          .replace('Y', today.getFullYear());
        var cajas = navItemSelected!=-1? navItem.boxes :[];
               let titles = [];
        if (navItemSelected !== 0) {
            titles.push(navItem.name);
            let parent = navItem.parent;
            while (parent !== 0) {
                titles.push(navItem.name);
                parent = navItemsById[parent].parent;
            }
            titles.reverse();

        }















        return (
        <Modal className="visor"   show={this.props.visor} backdrop={true} bsSize="large" aria-labelledby="contained-modal-title-lg" onHide={e => {
           this.props.onVisibilityToggled() }}>

                <Modal.Header closeButton >
                    <Modal.Title>Preview</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{padding:'0px', height:'90%'}}>
                    <Grid fluid={true} style={{height: '100%'}} >
                        <Row style={{height: '100%', margin:'0'}}>
                
                            <Col md={12} xs={12} style={{padding: 0, height: '100%'}}>
                                <div className="outter" style={{paddingTop:'0px'}}>
                                    <div id="maincontents" className={display} style={{visibility: 'visible'}} >
                                        <DaliTitle titles={titles}
                                                   isReduced={navItem.titlesReduced}
                                                   navItemId={navItem}
                                                   titleModeToggled={this.props.state.titleModeToggled}
                                                   showButton={false} /> <br/> 
                                        {navItem.boxes.map((main,index)=>{
                                            console.log( boxesById[main].content)
                                          // return( this.renderChildren(main, boxesById[main].content.node, boxesById[main].content.child ))
                                              }
                                        )}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Modal.Body>
            </Modal>
        )
    }

        renderChildren(id, markup, key){
            
            let toolbar = this.props.state.toolbarsById[id]

       let style = {
            width: '100%',
            height: '100%',
            position: 'relative',
            wordWrap: 'break-word',
            visibility: (toolbar.showTextEditor ? 'hidden' : 'visible')};

        let textareaStyle = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            resize: 'none',
            visibility: (toolbar.showTextEditor ? 'visible' : 'hidden')}
        let attrs = {};
       
        if(toolbar.buttons) {
            toolbar.buttons.map((item, index) => {
                if (item.autoManaged) {
                    if (!item.isAttribute) {
                        if(item.name !== 'width' && item.name !== 'height') {

                            style[item.name] = item.value;
                            if (item.units)
                                style[item.name] += item.units;
                        }
                    } else {
                        attrs['data-' + item.name] = item.value;
                    }
                }
                if(item.name === 'fontSize'){
                    textareaStyle['fontSize'] = item.value;
                    if (item.units)
                        textareaStyle['fontSize'] += item.units;
                }else if(item.name === 'color'){
                    textareaStyle['color'] = item.value;
                } 
            });
        }


              
            let component;
            let props = {};
            let children;
            console.log(markup)
             switch (markup.node) {
                case 'element':
                    if(markup.attr){
                        props = markup.attr;
                    }
                    props.key = key+"_visor";
                    if(markup.tag === 'plugin'){
                        component = PluginPlaceholder;
                        props = Object.assign({}, props, {
                            pluginContainer: markup.attr["plugin-data-id"]

                        });
                    }else{
                        console.log(markup.tag)
                        component = markup.tag;
                    }
                    break;
                case 'text':
                    component = "span";
                    break;
                case 'root':
                    component = "div";
                    props = {style: {width: '100%', height: '100%'}}
                    break;
             }


               if (markup.child) {children = []
                    markup.child.forEach((child, index) => {
                        
                        children.push(this.renderChildren(child, index))
                    });
                }

                    console.log(component)
                  return (<div style={style} {...attrs}>{React.createElement(component, props, children)}</div>);
       /* let component;
        let props = {};
        let children;
        switch (markup.node) {
            case 'element':
                if(markup.attr){
                    props = markup.attr;
                }
                props.key = key+"_visor";
                if(markup.tag === 'plugin'){
                    component = PluginPlaceholder;
                    props = Object.assign({}, props, {
                        pluginContainer: markup.attr["plugin-data-id"],

                    });
                }else{
                    component = markup.tag;
                }
                break;
            case 'text':
                component = "span";
                break;
            case 'root':
                component = "div";
                props = {style: {width: '100%', height: '100%'}}
                break;
        }

        if (markup.child) {
            children = [];
            markup.child.forEach((child, index) => {
                children.push(this.renderChildren(child, index))
            });
        }
        return React.createElement(component, props, children);*/
    }




    iterations(box){
        let boxes = this.props.state.boxesById
              
        if(boxes[box].children && boxes[box].children.length > 0){
            return (boxes[box].children.map((sc)=>{
                return    (<span>{sc}{boxes[box].sortableContainers[sc].children.map((child)=>{ 
                    return (<span>{this.iterations(child)}</span> )
                
            })} </span>)}))

        } else return (<p>{box}</p>)
    }



    componentDidMount(){
     
    }



    parseBox(box){

        var boxesById = this.props.state.boxesById;
        var width = box.width[box.width.length -1]=='%' ? box.width : box.width+'px';
        var height = box.height? (box.height[box.height.length -1]=='%' ? box.height : box.height+'px'):'auto';
        var box = box;
        var contenido = (box.id[1]!='s')?box.content:''

        return (<div style={{width: width, height:height, position: 'absolute', top: (box.position.y+'px'), left: (box.position.x+'px')}} >
             <div style={{pointerEvents:'all !important', height:'100%'}} dangerouslySetInnerHTML={{__html:  (box.id[1]!='s')?box.content:'' }} ></div>
             
                {
                    box.children.map(b=>{
                        var nn = b; 
                        if (box.id[1]=='s') nn= b.replace('sc-','bo-');// Cambiar sc por bo en sortables
                        var alturadiv = boxesById[nn].height;
                        var height2 = alturadiv? (alturadiv[alturadiv.length -1]=='%' ? alturadiv : alturadiv+'px'):'auto';
                       return ( <div style={{width:'100%', position:'relative',height:height2,display:'block'}} > {this.parseBox(boxesById[nn])}</div>);
                        })
                }

             </div>

             );
     

      

    }




}