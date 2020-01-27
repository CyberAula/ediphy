import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import i18n from "i18next";
import Alert from '../../common/alert/Alert';
import Clipboard from '../../clipboard/Clipboard';
import { isSlide, isBox } from '../../../../common/utils';
import { connect } from 'react-redux';
import { changeBoxLayer, updateUI } from '../../../../common/actions';
import handleBoxes from "../../../handlers/handleBoxes";
import { ActionBtn, ActionRibbonContainer, Actions, Separator } from "./Styles";
import { MatIcon } from "../../../../sass/general/constants";

class ActionsRibbon extends Component {

    state = { buttons: [], clipboardAlert: false };
    hB = handleBoxes(this);
    isPage = () => {
        const { containedViewsById, containedViewSelected, navItemsById, navItemSelected } = this.props;
        return containedViewsById[containedViewSelected] ?? navItemsById[navItemSelected] ?? null;
    };
    /**
     * Render React Component
     * @returns {code}
     */
    render() {

        let onClick = ()=>{this.setState({ clipboardAlert: !this.state.clipboardAlert }); return true;};
        // TODO document.queryCommandSupported(act.key)
        let clipboardActions = [
            { key: "copy", disabled: !(this.props.boxSelected && isBox(this.props.boxSelected)), icon: "content_copy", i18nkey: "clipboard.copy", onClick: ()=> {} },
            { key: "cut", disabled: !(this.props.boxSelected && isBox(this.props.boxSelected)), icon: "content_cut", i18nkey: "clipboard.cut", onClick: onClick },
            { key: "paste", disabled: false, icon: "content_paste", i18nkey: "clipboard.paste", onClick: onClick },
            { key: "duplicate", disabled: !(this.props.boxSelected && isBox(this.props.boxSelected)), icon: "content_copy", i18nkey: "clipboard.duplicate", onClick: ()=> {} },
        ];

        let page = this.isPage();
        let slide = page && isSlide(page.type);
        let container = 0;
        let box_layer = page.boxes.indexOf(this.props.boxSelected);
        let disable_bt = (this.props.boxSelected !== -1 && isBox(this.props.boxesById[this.props.boxSelected].parent)) || this.props.boxSelected === -1 || page.boxes.length === 1;
        let boxes = page.boxes;

        // TODO:revisar este código para que puedan funcionar las capas en los documentos (posición absoluta combinada con relativa...mal)
        // let index = Object.keys(this.props.boxes).length;
        /* if (!slide && this.props.boxes[this.props.boxSelected] !== undefined && index > 1) {
            container = this.props.boxes[this.props.boxSelected].container;
            boxes = this.props.boxes[page.boxes[0]].sortableContainers[container].children;
            box_layer = this.props.boxes[page.boxes[0]].sortableContainers[container].children.indexOf(this.props.boxSelected);
            disable_bt = this.props.boxSelected === -1 || page.boxes.length === 2;
        } */
        let layerActions = [
            { key: "BringtoFront", i18nkey: "order.BringtoFront", icon: "flip_to_front", disabled: (disable_bt || box_layer === boxes.length - 1), onClick: () => {
                this.props.dispatch(changeBoxLayer(this.props.boxSelected, page.id, container, 'front', boxes));
            } },
            { key: "Ahead", i18nkey: "order.Ahead", icon: "flip_to_front", disabled: (disable_bt || box_layer === boxes.length - 1), onClick: () => {
                this.props.dispatch(changeBoxLayer(this.props.boxSelected, page.id, container, 'ahead', boxes));
            } },
            { key: "Behind", i18nkey: "order.Behind", icon: "flip_to_back", disabled: (disable_bt || box_layer === 0), onClick: () => {
                this.props.dispatch(changeBoxLayer(this.props.boxSelected, page.id, container, 'behind', boxes));
            } },
            { key: "SendtoBack", i18nkey: "order.SendtoBack", icon: "flip_to_back", disabled: (disable_bt || box_layer === 0), onClick: () => {
                this.props.dispatch(changeBoxLayer(this.props.boxSelected, page.id, container, 'back', boxes));

            } },
            "separator",
            { key: "Grid", i18nkey: "Grid", icon: "grid_on", disabled: false, onClick: this.toggleGrid },
            "separator",

        ];
        let button = (act) => {
            return <ActionBtn key={act.key} active={(act.key === "Grid" && this.props.grid)}
                disabled={act.disabled}
                name={act.key}
                onClick={(e)=>{act.onClick(e); document.activeElement.blur();}}>
                <MatIcon style={{ width: '16px', height: '16px' }}>{act.icon}</MatIcon>
                <span className="hideonresize">{ i18n.t(act.i18nkey) }</span>
            </ActionBtn>;
        };
        return (
            <ActionRibbonContainer md={12} xs={12}
                height={this.props.ribbonHeight} ref="holder">
                <Actions>
                    { slide ?
                        layerActions.map((act, i) => (act === "separator") ? <Separator key={i}/> : button(act, i))
                        : null }
                    <Clipboard
                        key="clipboard"
                        onBoxDeleted={this.hB.onBoxDeleted}>
                        { clipboardActions.map((act, ind)=>{
                            return button(act, ind);
                        })}
                    </Clipboard>

                    {this.createAlert(this.state.clipboardAlert, onClick)}
                </Actions>
            </ActionRibbonContainer>
        );
    }
    createAlert(state, callback) {
        let actions = ["copy", "cut", "paste"];
        let shortCuts = ["C", "X", "V"];
        return <Alert show={state} onClose={callback} className="pageModal" key="alert">
            <p>{i18n.t("clipboard.msg")}</p>
            {actions.map((act, ind) => {
                return <Col xs={4} key={ind}>
                    <h2>Ctrl+{shortCuts[ind]}</h2>
                    <div>{i18n.t("clipboard.to")} {i18n.t("clipboard." + actions[ind]).toLowerCase()}</div>
                </Col>;
            })}
            <br/>

        </Alert>;
    }

    toggleGrid = () => this.props.dispatch(updateUI({ grid: !this.props.grid }));
}

export default connect(mapStateToProps)(ActionsRibbon);

function mapStateToProps(state) {
    const { boxesById, boxSelected, containedViewsById, containedViewSelected, navItemSelected, navItemsById } = state.undoGroup.present;
    return {
        navItemSelected,
        containedViewSelected,
        boxSelected,
        boxesById,
        navItemsById,
        containedViewsById,
        grid: state.reactUI.grid,
    };
}

ActionsRibbon.propTypes = {
    /**
     * Redux actions trigger
     */
    dispatch: PropTypes.func,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any,
    /**
     * Selected contained view (by ID)
     */
    containedViewSelected: PropTypes.any,
    /**
     * Object containing all views (by id)
     */
    navItemsById: PropTypes.object,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViewsById: PropTypes.object,
    /**
     * Height of the ribbon in px (contains the string px)
     */
    ribbonHeight: PropTypes.string,
    /**
     * Whether grid is disabled or not
     */
    grid: PropTypes.bool,
    /**
     * Selected box
     */
    boxSelected: PropTypes.any,
    /**
     * Object containing all created boxes (by id)
     */
    boxesById: PropTypes.any,
};
