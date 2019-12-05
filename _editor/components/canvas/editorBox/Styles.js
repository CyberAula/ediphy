import styled from 'styled-components';
import { BACKGROUND_GREY, BOX_BORDER_WIDTH, PRIMARY_BLUE } from "../../../../sass/general/constants";
import CKEDitorComponent from "./CKEDitorComponent";

export const ResizeHelper = styled.div.attrs({ className: 'helpersResizable' })`
    border: 1px solid #777;
    background-color: white;
    position: absolute;
    z-index: 99999;
    cursor: ${props => props.cursor};
    width: ${props => props.cornerSize}px;
    height: ${props => props.cornerSize}px;
    ${props => props.left ? 'left' : 'right'}: ${ props => -props.cornerSize / 2 }px;
    ${props => props.top ? 'top' : 'bottom'}: ${ props => -props.cornerSize / 2 }px;
`;

export const ResizeContainer = styled.div.attrs({ className: 'resizeContainer' })`
  z-index: 9999;
  display: initial;
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
`;

export const SelectedBoxStyle = `
    background-color: rgba(27,177,188,0.1) !important;
    border: ${BOX_BORDER_WIDTH} dashed ${PRIMARY_BLUE} !important;
    color: ${BACKGROUND_GREY} !important;
`;

export const automaticallySizedStyle = `
    .basicImageClass{
        position: relative;
    }
`;

export const EditorBoxContainer = styled.div.attrs(props => ({ className: props.classes }))`
    display: inline-block;
    word-break: break-word;
    border: ${BOX_BORDER_WIDTH} solid transparent;
    vertical-align:top;
    word-wrap: break-word;
    .boxStyle{
      overflow: visible;
    }
    a{
      pointer-events: none !important;
    }
  ${props => props.selectedBox ? SelectedBoxStyle : null}
`;

export const CKText = styled(CKEDitorComponent).attrs({ classes: 'textAreaStyle' })`
    width: 100%;
    height: 100%;
    line-height: normal;
    z-index: 999;
    position: relative;
    float: left;
    resize: none;
    top: 0;
    color: black;
    background-color: transparent;
    padding: 10px;
    word-wrap: break-word !important;
    word-break: break-all;
    pre {
      word-break: break-all !important;
    }
`;

export const Box = styled.div.attrs({ className: '' })`
    width: 100%;
    height: 100%;
    line-height: normal;
    position: relative;
    word-wrap: break-word;
    overflow: hidden;
    word-break: break-all;
    pre, pre * {
      word-break: break-all !important;
      white-space: pre-wrap;
    }
`;

export const Overlay = styled.div.attrs({ className: 'boxOverlay' })`
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #000;
    position: absolute;
    opacity: 0.4;
    display: ${props => props.showOverlay};
`;
