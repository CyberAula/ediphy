import React, {Component} from 'react';
import {Modal, Button, Row} from 'react-bootstrap';

export default class XMLConfigModal extends Component {
    render() {
        return (
            <Modal className="pageModal pluginconfig" backdrop={true} bsSize="large" show={this.props.visible}>
                <Modal.Header>
                    <Modal.Title>XML Configuration</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row  >
                      <div ref={"container"}>
                          Import XML
                      </div>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={e => {
                        this.props.onXMLEditorToggled();
                    }}>Cancel</Button>
                    <Button bsStyle="primary" onClick={e => {
                        let state = this.props.toolbar.state;
                        state["__xml"] = this.generateXMLFromView(state);
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

    generateViewFromXML(xml){
        console.log("modal")
        console.log(xml)

        //Esto es por si se quiere hacer diccionarios de palabras
        var scormWords = ['tries', 'notaCorteGlobal', 'scoreBase', 'recordScore'];

        var tipo = '', scorm = '', stuffItems = '', stuffItem = '', moreStuff = '', enunciado='', preguntas='', respuestas='', preguntasArray = [], respuestasArray = [], solArr = [], feedBack = '';

        const colX12 = '<div class="col-xs-12">', colX6 = '<div class="col-xs-6">', colX4 = '<div class="col-xs-4">', colX3 = '<div class="col-xs-3">', close = '</div>', raw = '<div class="raw">';
        var auxName = '', auxValue = '', auxTemplate = '';

        var x = xml.getElementsByTagName('ITEMS');
        
        for( i = 0; i < x.length; i++){
          console.log("relativo a ITEMS")
          for( j = 0; j < x[i].attributes.length; j++){
            auxName = x[i].attributes[j].name;
            auxValue = x[i].attributes[j].value;
             if(auxName.match('col') || auxName == 'esquinas' || auxName == 'grosLine' ){
                stuffItems += colX3 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
              }else if(scormWords.indexOf(auxName) >= 0){
                scorm += colX3 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
              }else if(auxName == 'obj'){
               tipo += colX6 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control"  type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
             }else{
              moreStuff += colX3 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control"  type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
            }
          }
        }

        //Esto es por si se quiere hacer un diccionario
       /* var scormWords = ['tries', 'notaCorteGlobal', 'scoreBase', 'recordScore'];
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
                stuffItems += colX3 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control" onchange="this.changeValue('+auxName+')" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
              }else if(scormWords.indexOf(auxName) >= 0){
                scorm += colX3 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control" onchange="this.changeValue('+auxName+')" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
              }else if(auxName == 'obj'){
               tipo += colX6 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control" onchange='+this.changeValue(auxName)+' type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
             }else{
              moreStuff += colX3 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control" onchange="this.changeValue('+auxName+')" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
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
            tipo += colX6 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control" onchange="this.changeValue('+auxName+')" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
          }else if(auxName == 'enunciado' || auxName == 'instrucciones' || auxName == 'img'){
           enunciado += colX12 + '<label  for="'+auxName+'">'+auxName+':</label> <input class="form-control"  onchange="this.changeValue('+auxName+')" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
         }else if(auxName == 'anchoDrop' || auxName == 'anchoDrag' || auxName == 'sidesSpace'){
          stuffItem += colX3 + '<label  for="'+auxName+'">'+auxName+':</label> <input class="form-control"  onchange="changeValue('+auxName+')" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
        }else if(auxName == 'sol'){
          solArr = auxValue.split(',');
          enunciado += colX12 + '<label  for="'+auxName+'">'+auxName+':</label> <input class="form-control"  onchange="this.changeValue('+auxName+')" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
        }else{
          moreStuff += colX3 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control"  onchange="this.changeValue('+auxName+')" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
        }
       // state.items.payload.item.attributes[auxName] = auxValue;
      }

var numQuest = 0;
var numAns = 0;
      for(n = 0; n < y[i].childNodes.length; n++){
       if(y[i].childNodes[n].tagName){
         auxName = y[i].childNodes[n].tagName;
         auxValue = y[i].childNodes[n].textContent;
         if(auxName == 'DRAG'){
           preguntasArray.push(auxValue);
           //state.items.payload.item.payload[auxName] = preguntasArray;

           preguntas += colX12 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control"  onchange="this.changeValue('+auxName+'-'+numQuest+')" type="text" autofocus id="'+auxName+'-'+numQuest+'" value =" '+ auxValue +'">' + '<p>Solución:'+solArr.shift()+'</p>' + close;
            numQuest++;
            console.log(numQuest);
         }else if(auxName == 'DROP'){
           respuestasArray.push(auxValue);
           //state.items.payload.item.payload[auxName] = respuestasArray;
           respuestas += colX12 + '<label for="'+auxName+'">'+auxName+':</label> <input class="form-control"  onchange="this.changeValue('+auxName+'-'+numAns+')" type="text" autofocus id="'+auxName+'-'+numAns+'" value= "'+ auxValue +'">' + close;
            numAns++;
         }else if(auxName.match('FEED') || auxName == 'NOTRIED' || auxName == 'JUSTIFICACION' ){
          //state.items.payload.item.payload[auxName] = auxValue;
          feedBack += colX12 + '<label  for="'+auxName+'">'+auxName+':</label> <input class="form-control"  onchange="this.changeValue('+auxName+')" type="text" autofocus id="'+auxName+'" value= "'+ auxValue +'">' + close;
        }else{
         // state.items.payload.item.payload[auxName] = auxValue;
          moreStuff += colX3 + '<label  for="'+auxName+'">'+auxName+':</label> <input class="form-control"  onchange="this.changeValue('+auxName+')" type="text" autofocus id="'+auxName+'" value="'+ auxValue +'">' + close;
        }
      }
    }
  }

  preguntas = '<div id="preguntasRespuestas">'+preguntas;
  respuestas = respuestas + '</div>';
  auxTemplate = '<div class="form-group">'+tipo + stuffItems + scorm + enunciado+ stuffItem + preguntas + respuestas +feedBack +moreStuff + '</div>';
*/
        return auxTemplate;


    }
    changeValue(namekey){
        console.log(namekey);
    }

    generateXMLFromView(state){
       // console.log(this.refs.container.getElementsByTagName('input'));
       var auxXml = state['__xml'];
        //console.log(state)
        console.log(auxXml)
          var inputs = this.refs.container.getElementsByTagName('input');
          x = auxXml.getElementsByTagName('ITEMS');
          //console.log(x);
          //console.log(x[0].attributes);
          //console.log(x[0].attributes['pepe']);
          //console.log(x[0].attributes['recordScore']);
          
          //console.log("**********");
          
          /*
          for(j = 0; j < x[0].attributes.length; j++){
            //console.log(x[0].attributes[j])
            console.log("atrib items", inputs[x[0].attributes[j].name].id , inputs[x[0].attributes[j].name].value)
          }*/

        y= auxXml.getElementsByTagName('ITEM');
    /*
        for( i = 0; i < y.length; i++){
          for( a = 0; a < y[i].attributes.length; a++){
           console.log("atrib item",inputs[y[i].attributes[a].name].id , inputs[y[i].attributes[a].name].value)
           }

             for(n = 0; n < y[i].childNodes.length-1; n++){

*/
               /* console.log(y[i].childNodes[n])
                console.log(y[i].childNodes[n].tagName)
                console.log(y[i].childNodes[n].textContent)*/
              //  console.log(inputs)
               // console.log(inputs['DRAG'])
                //console.log(inputs[y[i].childNodes[n].tagName+1])

                //console.log("pay",inputs[y[i].childNodes[n].tagName].id ,inputs[y[i].childNodes[n].textContent].value)
    /*         }
       }*/
      
        var auxVisitado = '';
        var numVisitado =  0;
        var nameValue = '';
        var payloadIndex = 0;
        for (i = 0; i < inputs.length; i++) {
        //console.log(inputs[i])
            //console.log(inputs[i].id)
            //console.log(inputs[i].value)
            
            nameValue = inputs[i].id;

            if(auxVisitado == nameValue){
                numVisitado++;
                nameValue = nameValue + '-'+numVisitado;
            }else{
                numVisitado = 0;
            }


            if(x[0].attributes[nameValue]){
                console.log("atributo de ITEMS")
                console.log("atrib items", inputs[i].id , inputs[i].value)
                auxXml.getElementsByTagName("ITEMS")[0].setAttribute(nameValue,inputs[i].value);
            }else if(y[0].attributes[nameValue]){
                  console.log("atributo de ITEM")
               console.log("atrib ITEM", inputs[i].id , inputs[i].value)
               auxXml.getElementsByTagName("ITEMS")[0].setAttribute(nameValue,inputs[i].value);
            }else{
                console.log("es otra cosa",nameValue)
                console.log("pay", inputs[i].id , inputs[i].value)
                
                console.log(auxXml.getElementsByTagName("ITEM")[0].childNodes[payloadIndex].textContent)
                auxXml.getElementsByTagName("ITEM")[0].childNodes[payloadIndex].textContent = inputs[i].value;
                console.log(auxXml.getElementsByTagName("ITEM")[0].childNodes[payloadIndex].textContent)
                payloadIndex++;
                console.log(payloadIndex);
                //console.log()
            }
            auxVisitado = inputs[i].id;
        }

        return auxXml;
    }
}
