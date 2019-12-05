import styled from 'styled-components';
import { BOX_BORDER_WIDTH, GREY_INSIDE_PANELS, LIGHT_GREY } from "../../../../sass/general/constants";
import { Button } from "react-bootstrap";

export const Container = styled.div.attrs({ className: 'editorBoxSortable' })`
    overflow: visible; 
`;

export const EditorBoxSortableContainer = styled.div`
    min-height: 70px;
    text-align: center;
    line-height: 100%;
    box-sizing: border-box;
    position: relative;
`;

export const SortableContainerBox = styled.div`
    border: ${BOX_BORDER_WIDTH} solid transparent;
`;

export const DnDZone = styled.div.attrs({ className: 'dragContentHere' })`
    color: ${GREY_INSIDE_PANELS};
    text-align: center;
    min-height: 100px;
    font-size: 20px;
    border: 2px dashed ${GREY_INSIDE_PANELS};
    border-radius: 4px;
    margin: 20px auto;
    background-color: rgba(0,0,0,0.05);
    line-height: 100px;
`;

export const SwapButton = styled.i`
    color: ${LIGHT_GREY};
    padding: 5px;
    transition: all .2s ease-in-out;
    background: transparent;
    border: none;
    font-size: 1.6em;
    vertical-align: baseline;
  
    &:hover,&:active, &:focus{
      color: ${GREY_INSIDE_PANELS};
      background: transparent;
      cursor: pointer;
      transform: scale(1.3);
    }
`;

export const DeleteButton = styled(Button)`
    color: ${LIGHT_GREY};
    padding: 5px;
    transition: all .2s ease-in-out;
    background: transparent;
    border: none;
    font-size: 1.6em;
    vertical-align: baseline;
  
    &:hover,&:active, &:focus{
      color: ${GREY_INSIDE_PANELS};
      background: transparent;
      cursor: pointer;
      transform: scale(1.3);
    }
`;
