import styled from 'styled-components';
import Col from "react-bootstrap/lib/Col";

export const Canvas = styled(Col)`
  height: 100%;
  overflow-y: auto;
  width: calc(100% - 40px);
  background-color: #9a9a9a;
  .canvasDocClass {
    padding: 10px 8px 0px 8px;
  }
  .canvasSliClass {
    padding: 33px 8px 33px 8px;
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
     margin: 0;
     position: relative;
     padding: 0 20px;
   }
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
