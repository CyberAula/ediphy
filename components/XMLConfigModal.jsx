import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

export default class XMLConfigModal extends Component {
    render() {
        return (
            <Modal backdrop={true} bsSize="large" show={this.props.visible}>
                <Modal.Header>
                    <Modal.Title>XML Configuration</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div ref={"container"}>
                        Import XML
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={e => {
                        this.props.onXMLEditorToggled();
                    }}>Cancel</Button>
                    <Button bsStyle="primary" onClick={e => {
                        let state = this.props.toolbar.state;
                        state["__xml"] = this.generateXMLFromView();
                        Dali.Plugins.get(this.props.toolbar.config.name).forceUpdate(state, this.props.id);
                        this.props.onXMLEditorToggled();
                    }}>Save changes</Button>
                </Modal.Footer>

            </Modal>
        );
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.visible && !prevProps.visible){
            this.refs.container.innerHTML = this.generateViewFromXML(this.props.toolbar.state["__xml"])
        }
    }

    componentDidMount(){
        if(this.props.toolbar && this.props.toolbar.state["__xml"]){
            this.refs.container.innerHtml = this.generateViewFromXML(this.props.toolbar.state["__xml"])
        }
    }
    //Como hay un xml por parametro entiendo que este xml viene del estado cargado antes(Como se hace en el componentDidMount)
    //además enteindo que esta función sirve para generar el formulario
    generateViewFromXML(xml){
        console.log("modal")
        console.log(xml)

        //Esto es por si se quiere hacer un diccionario
        var scormWords = ['tries', 'notaCorteGlobal', 'scoreBase', 'recordScore'];
        var tipo = '', scorm = '', stuffItems = '', stuffItem = '', moreStuff = '', enunciado='', preguntas='', respuestas='', preguntasArray = [], respuestasArray = [], solArr = [], feedBack = '';

        const colX12 = '<div class="col-xs-12">', colX6 = '<div class="col-xs-6">', colX4 = '<div class="col-xs-4">', colX3 = '<div class="col-xs-3">', close = '</div>', raw = '<div class="raw">';
        var auxName = '';
        var auxValue = '';

        var auxTemplate = '';

        //Col xs={12}
        //return "Import " + xml;
        //var palabrasReservadas = ["a","b"]
        // palabrasReservadas.indexOf("n") ++++ -1
        // palabrasReservadas.indexOf("a") ++++ 0
         //var parsed = new DOMParser().parseFromString(this.result, "text/xml");
          x = xml.getElementsByTagName('ITEMS');
          console.log(x);
        for( i = 0; i < x.length; i++){
            console.log("relativo a ITEMS")
            for( j = 0; j < x[i].attributes.length; j++){
              auxName = x[i].attributes[j].name;
              auxValue = x[i].attributes[j].value;
              if(auxName.match('col') || auxName == 'esquinas' || auxName == 'grosLine' ){
                stuffItems += colX3 + '<label for="'+auxName+'">'+auxName+':</label> <input onchange="#" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
              }else if(scormWords.indexOf(auxName) >= 0){
                scorm += colX3 + '<label for="'+auxName+'">'+auxName+':</label> <input onchange="#" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
              }else if(auxName == 'obj'){
               tipo += colX6 + '<label for="'+auxName+'">'+auxName+':</label> <input onchange="#" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
             }else{
              moreStuff += colX3 + '<label for="'+auxName+'">'+auxName+':</label> <input onchange="#" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
            }
            //state.items.attributes[auxName] = auxValue;
          }
        }

        y= xml.getElementsByTagName('ITEM');
        for( i = 0; i < y.length; i++){
          for( a = 0; a < y[i].attributes.length; a++){
           auxName = y[i].attributes[a].name;
           auxValue = y[i].attributes[a].value;
           if(auxName == 'tipo'){
            tipo += colX6 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control" onchange="#" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
          }else if(auxName == 'enunciado' || auxName == 'instrucciones' || auxName == 'img'){
           enunciado += colX12 + '<label  for="'+auxName+'">'+auxName+':</label> <input class="form-control"  onchange="#" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
         }else if(auxName == 'anchoDrop' || auxName == 'anchoDrag' || auxName == 'sidesSpace'){
          stuffItem += colX3 + '<label  for="'+auxName+'">'+auxName+':</label> <input class="form-control"  onchange="#" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
        }else if(auxName == 'sol'){
          solArr = auxValue.split(',');
        }else{
          moreStuff += colX3 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control"  onchange="#" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
        }
       // state.items.payload.item.attributes[auxName] = auxValue;
      }

      for(n = 0; n < y[i].childNodes.length; n++){
       if(y[i].childNodes[n].tagName){
         auxName = y[i].childNodes[n].tagName;
         auxValue = y[i].childNodes[n].textContent;
         if(auxName == 'DRAG'){
           preguntasArray.push(auxValue);
           //state.items.payload.item.payload[auxName] = preguntasArray;
           preguntas += colX12 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control"  onchange="#" type="text" autofocus id="'+auxName+'" value =" '+ auxValue +'">' + '<p>Solución:'+solArr.shift()+'</p>' + close;
         }else if(auxName == 'DROP'){
           respuestasArray.push(auxValue);
           //state.items.payload.item.payload[auxName] = respuestasArray;
           respuestas += colX12 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control"  onchange="#" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
         }else if(auxName.match('FEED') || auxName == 'NOTRIED' || auxName == 'JUSTIFICACION' ){
          //state.items.payload.item.payload[auxName] = auxValue;
          feedBack += colX12 + '<label  for="'+auxName+'">'+auxName+':</label> <input class="form-control"  onchange="#" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
        }else{
         // state.items.payload.item.payload[auxName] = auxValue;
          moreStuff += colX3 + '<label  for="'+auxName+'">'+auxName+':</label> <input class="form-control"  onchange="#" type="text" autofocus id="'+auxName+'" value="'+ auxValue +'">' + close;
        }
      }
    }
  }

  preguntas = '<div id="preguntasRespuestas">'+preguntas;
  respuestas = respuestas + '</div>';
  auxTemplate = '<div class="form-group">'+tipo + stuffItems + scorm + enunciado+ stuffItem + preguntas + respuestas +feedBack +moreStuff + '</div>';
        return auxTemplate;


    }

    generateXMLFromView(){
        return true;
    }
}
