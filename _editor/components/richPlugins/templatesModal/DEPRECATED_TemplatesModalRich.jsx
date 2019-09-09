// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
// import { ID_PREFIX_BOX, ID_PREFIX_PAGE, PAGE_TYPES } from '../../../../common/constants';
// import i18n from 'i18next';
// import { templates } from "./templates/templates";
// import './_templatesModal.scss';
// import TemplateThumbnailRich from "./TemplateThumbnailRich";
// import { createBox } from "../../../../common/commonTools";
// import TemplateThumbnail from "../../carousel/templatesModal/TemplateThumbnail";
//
// export default class TemplatesModalRich extends Component {
//     constructor(props) {
//         super(props);
//         this.index = 0;
//         this.templates = templates();
//         /**
//          * Component's initial state
//          */
//         this.state = {
//             itemSelected: -1,
//         };
//     }
//     render() {
//         return (
//             <Modal className="pageModal" id="TemplatesModal" show={this.props.show}>
//                 <Modal.Header>
//                     <Modal.Title><span id="previewTitle">Elige una plantilla</span></Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className="gcModalBody" style={{ overFlowY: 'auto' }}>
//                     <div className="items_container">
//                         <div id="empty"
//                             className="template_item"
//                             key="-1"
//                             style={{ width: '120px', height: '80px', border: this.state.itemSelected === -1 ? "solid #17CFC8 3px" : "solid #eee 1px", position: 'relative' }}
//                             onClick={e => {
//                                 this.setState({
//                                     itemSelected: -1,
//                                 });
//                             }}
//                             onDoubleClick={e => {
//                                 this.setState({
//                                     itemSelected: -1,
//                                 });
//                                 this.AddNavItem(-1);
//                             }}><div className={'template_name'} style={{ display: this.state.itemSelected === -1 ? 'block' : 'none' }}>{i18n.t('templates.template0')}</div>
//                         </div>
//                         {this.templates.map((item, index) => {
//                             let border = this.state.itemSelected === index ? "solid #17CFC8 3px" : "solid #eee 1px";
//                             return (<div key={index} className="template_item" style={{ position: 'relative', border: border, width: '120px', height: '80px' }}>
//                                 <TemplateThumbnail key={index} index={index}
//                                     onClick={e => { this.setState({ itemSelected: index });}}
//                                     onDoubleClick={e => {
//                                         this.setState({ itemSelected: index });
//                                         this.AddNavItem(index);
//                                     }}
//                                     boxes={item.boxes}/>
//                                 <div className={'template_name'} style={{ display: this.state.itemSelected === index ? 'block' : 'none' }}>{item.name}</div>
//                             </div>
//                             );
//                         })}
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button bsStyle="default" id="import_file_button" onClick={ e => {
//                         this.closeModal(); e.preventDefault();
//                     }}>{i18n.t("importFile.footer.cancel")}</Button>
//                     <Button bsStyle="primary" id="cancel_button" onClick={ (e) => {
//                         this.getBoxes(this.state.itemSelected); this.closeModal(); e.preventDefault(); e.stopPropagation();
//                     }} onDoubleClick={ (e) => {
//                         // this.AddNavItem(this.state.itemSelected);
//                         e.preventDefault(); e.stopPropagation();
//                     }}>{i18n.t("importFile.footer.ok")}</Button>
//                 </Modal.Footer>
//             </Modal>
//         );
//     }
//
//     /**
//      * Close modal
//      */
//     closeModal() {
//         // reset state
//         this.setState({ itemSelected: -1 });
//         this.props.close();
//     }
//
//     getBoxes(itemSelected) {
//         let boxes = [];
//         if (itemSelected !== -1) {
//             let selectedTemplate = this.templates[itemSelected];
//             boxes = selectedTemplate.boxes;
//         }
//         this.props.templateClick(boxes);
//     }
// }
// TemplatesModalRich.propTypes = {
//     /**
//      * Whether the import file modal should be shown or hidden
//      */
//     show: PropTypes.bool,
//     /**
//      * Closes import file modal
//      */
//     close: PropTypes.func.isRequired,
//     /**
//      * Function for getting template ID
//      */
//     templateClick: PropTypes.func.isRequired,
//
// };
