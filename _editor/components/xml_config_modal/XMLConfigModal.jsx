import React, { Component } from 'react';
import { Modal, Button, Row } from 'react-bootstrap';
import Ediphy from '../../../core/editor/main';
import { UPDATE_NAV_ITEM_EXTRA_FILES } from '../../../common/actions';

/**
 * @deprecated
 */
export default class XMLConfigModal extends Component {
    render() {
        return (
            <Modal className="pageModal pluginconfig" backdrop bsSize="large" show={this.props.visible}>
                <Modal.Header>
                    <Modal.Title>XML Configuration</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row>
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
                        let state = Object.assign({}, this.props.toolbar.state);
                        let xml = this.generateXMLFromView(state);
                        $.ajax({
                            url: state.__xml_path ? state.__xml_path : Ediphy.Config.xml_path,
                            type: state.__xml_path ? 'PUT' : 'POST',
                            data: {
                                url: window.location.pathname,
                                xml: new XMLSerializer().serializeToString(xml),
                            },
                            success: function(response, status, xhr) {
                                if(!state.__xml_path) {
                                    window.history.pushState({}, "", response.dali_document_path);
                                }
                                state.__xml_path = response.dali_exercise_path;
                            },
                            error: function(xhr, status, error) {
                                // eslint-disable-next-line no-console
                                console.error("Could not save");
                            },
                            complete: function(xhr, status) {
                                if(status === "error") {
                                    state.__xml_path = Ediphy.Config.xml_fake_path;
                                }
                                Ediphy.Plugins.get(this.props.toolbar.config.name).forceUpdate(state, this.props.id, UPDATE_NAV_ITEM_EXTRA_FILES);
                                this.props.onXMLEditorToggled();
                            }.bind(this),
                        });
                    }}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.visible && !prevProps.visible) {
            this.refs.container.innerHTML = this.generateViewFromXML(this.props.toolbar.state.__xml);
        }
    }

    componentDidMount() {
        if (this.props.toolbar && this.props.toolbar.state.__xml) {
            this.refs.container.innerHtml = this.generateViewFromXML(this.props.toolbar.state.__xml);
        }
    }

    generateViewFromXML(xml) {
        let i, j, n;
        // Esto es por si se quiere hacer diccionarios de palabras
        let scormWords = ['tries', 'notaCorteGlobal', 'scoreBase', 'recordScore'];

        let tipo = '', scorm = '', stuffItems = '', stuffItem = '', moreStuff = '', enunciado = '', preguntas = '', respuestas = '', preguntasArray = [], respuestasArray = [], solArr = [], feedBack = '';

        const colX12 = '<div class="col-xs-12">', colX6 = '<div class="col-xs-6">', colX4 = '<div class="col-xs-4">', colX3 = '<div class="col-xs-3">', close = '</div>', raw = '<div class="raw">';
        let auxName = '', auxValue = '', auxTemplate = '';

        let x = xml.getElementsByTagName('ITEMS');

        for (i = 0; i < x.length; i++) {
            for (j = 0; j < x[i].attributes.length; j++) {
                auxName = x[i].attributes[j].name;
                auxValue = x[i].attributes[j].value;
                if (auxName.match('col') || auxName === 'esquinas' || auxName === 'grosLine') {
                    stuffItems += colX3 + '<label for="' + auxName + '">' + auxName + ':</label> <input class="form-control" type="text" autofocus id="' + auxName + '" value= "' + auxValue + '">' + close;
                } else if (scormWords.indexOf(auxName) >= 0) {
                    scorm += colX3 + '<label for="' + auxName + '">' + auxName + ':</label> <input class="form-control" type="text" autofocus id="' + auxName + '" value= "' + auxValue + '">' + close;
                } else if (auxName === 'obj') {
                    tipo += colX6 + '<label for="' + auxName + '">' + auxName + ':</label> <input class="form-control"  type="text" autofocus id="' + auxName + '" value= "' + auxValue + '">' + close;
                } else {
                    moreStuff += colX3 + '<label for="' + auxName + '">' + auxName + ':</label> <input class="form-control"  type="text" autofocus id="' + auxName + '" value= "' + auxValue + '">' + close;
                }
            }
        }

        let y = xml.getElementsByTagName('ITEM');

        for (i = 0; i < y.length; i++) {

            for (let a = 0; a < y[i].attributes.length; a++) {
                auxName = y[i].attributes[a].name;
                auxValue = y[i].attributes[a].value;
                if (auxName === 'tipo') {
                    tipo += colX6 + '<label for="' + auxName + '">' + auxName + ':</label> <input class="form-control" type="text" autofocus id="' + auxName + '" value= "' + auxValue + '">' + close;
                } else if (auxName === 'enunciado' || auxName === 'instrucciones' || auxName === 'img') {
                    enunciado += colX12 + '<label  for="' + auxName + '">' + auxName + ':</label> <input class="form-control" type="text" autofocus id="' + auxName + '" value= "' + auxValue + '">' + close;
                } else if (auxName === 'anchoDrop' || auxName === 'anchoDrag' || auxName === 'sidesSpace') {
                    stuffItem += colX3 + '<label  for="' + auxName + '">' + auxName + ':</label> <input class="form-control" type="text" autofocus id="' + auxName + '" value= "' + auxValue + '">' + close;
                } else if (auxName === 'sol') {
                    solArr = auxValue.split(',');
                    enunciado += colX12 + '<label  for="' + auxName + '">' + auxName + ':</label> <input class="form-control"  type="text" autofocus id="' + auxName + '" value= "' + auxValue + '">' + close;
                } else {
                    moreStuff += colX3 + '<label for="' + auxName + '">' + auxName + ':</label> <input class="form-control"  type="text" autofocus id="' + auxName + '" value= "' + auxValue + '">' + close;
                }
            }

            let numQuest = 0;
            let numAns = 0;

            for (n = 0; n < y[i].childNodes.length; n++) {
                if (y[i].childNodes[n].tagName) {
                    auxName = y[i].childNodes[n].tagName;
                    auxValue = y[i].childNodes[n].textContent;
                    if (auxName === 'DRAG') {
                        preguntasArray.push(auxValue);
                        preguntas += colX12 + '<label for="' + auxName + '">' + auxName + ':</label> <input class="form-control" type="text" autofocus id="' + auxName + '-' + numQuest + '" value =" ' + auxValue + '">' + '<p>Solución:' + solArr.shift() + '</p>' + close;
                        numQuest++;
                    } else if (auxName === 'DROP') {
                        respuestasArray.push(auxValue);
                        respuestas += colX12 + '<label for="' + auxName + '">' + auxName + ':</label> <input class="form-control"  type="text" autofocus id="' + auxName + '-' + numAns + '" value= "' + auxValue + '">' + close;
                        numAns++;
                    } else if (auxName.match('FEED') || auxName === 'NOTRIED' || auxName === 'JUSTIFICACION') {
                        feedBack += colX12 + '<label  for="' + auxName + '">' + auxName + ':</label> <input class="form-control"  type="text" autofocus id="' + auxName + '" value= "' + auxValue + '">' + close;
                    } else {
                        moreStuff += colX3 + '<label  for="' + auxName + '">' + auxName + ':</label> <input class="form-control"  type="text" autofocus id="' + auxName + '" value="' + auxValue + '">' + close;
                    }
                }
            }

        }

        preguntas = '<div id="preguntasRespuestas">' + preguntas;
        respuestas = respuestas + '</div>';
        auxTemplate = '<div class="form-group">' + tipo + stuffItems + scorm + enunciado + stuffItem + preguntas + respuestas + feedBack + moreStuff + '</div>';

        return auxTemplate;

    }

    generateXMLFromView(state) {
        let auxXml = state.__xml;
        let inputs = this.refs.container.getElementsByTagName('input');
        let x = auxXml.getElementsByTagName('ITEMS');
        let y = auxXml.getElementsByTagName('ITEM');
        let i;

        let auxVisitado = '';
        let numVisitado = 0;
        let nameValue = '';
        let payloadIndex = 0;

        for (i = 0; i < inputs.length; i++) {

            nameValue = inputs[i].id;

            if (auxVisitado === nameValue) {
                numVisitado++;
                nameValue = nameValue + '-' + numVisitado;
            } else {
                numVisitado = 0;
            }

            if (x[0].attributes[nameValue]) {
                auxXml.getElementsByTagName("ITEMS")[0].setAttribute(nameValue, inputs[i].value);
            } else if (y[0].attributes[nameValue]) {
                auxXml.getElementsByTagName("ITEM")[0].setAttribute(nameValue, inputs[i].value);
            } else {
                auxXml.getElementsByTagName("ITEM")[0].childNodes[payloadIndex].textContent = inputs[i].value;
                payloadIndex++;
            }

            auxVisitado = inputs[i].id;
        }

        return auxXml;
    }
}
