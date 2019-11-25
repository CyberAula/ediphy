import styled from 'styled-components';
import { PRIMARY_BLUE } from "../../../sass/general/constants";

export const CVBackButton = styled.a`
  background-color: transparent !important;
  border:0;
  padding:0;
  position: absolute;
  top: 1em;
  right:  1em;
  i.material-icons{
    color: white;
    font-size: 1em;
    background-color: ${PRIMARY_BLUE};
  }
  z-index:9999;
`;

export const InnerCanvas = styled.div`
  background-color: white;
  height: calc(100vh - 241px);
  &.sli .caja{
    background-color: transparent;
  }
  &.sli, &.doc{
    height: 100%;
    background-color: white;
    overflow: hidden;
    position: relative;
  }
    
  &.doc{
    background-color: transparent;
  }
`;

export const AirLayer = styled.div`
   vertical-align: middle;
   &.doc_air{
     height: 100%;
     overflow: hidden;
     z-index: 0;
     visibility: visible;
     background-color: transparent;
     margin: 0px;
     position: relative;
     padding: 0 20px;
   }
`;
