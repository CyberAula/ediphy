import styled from 'styled-components';

export const MapPlugin = styled.div`
  pointer-events: none;
  width: 100%;
  height:100%;
  .rich_overlay {
  pointer-events: all !important;
}
`;

export const DroppableRichZone = styled.div.attrs({ className: 'dropableRichZone' })`
  width: 100%;
  height: 100%;
  minHeight: 50;
  minWidth: 50;
   div {
    position:absolute !important;
  }
  a.mapMarker .material-icons{
  font-size: 1.8em;
  }
  a.mapMarker {
    text-decoration: none;
    position: absolute;
    pointer-events: all !important;
    top: -1.9em;
    left: -0.95em;
    width: 1.9em;
    height: 1.9em;
    text-decoration: none;
    i{
      width: 100%;
      height: 100%;
      cursor: pointer;
      pointer-events: all;
    }
  }
`;

export const SearchBoxContainer = styled.div`
  max-width:98%;
  max-width:calc(99% - 0.3em);
  overflow: hidden;
  width:12em;
  position: absolute;
  top: 0.2em;
  right: 0.2em;
  border-radius: 0;
  pointer-events: all;
`;

export const MiddleAlign = styled.div`
    vertical-align: middle;
    position: absolute;
    display:block;
    top:50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    margin:auto;
`;

export const NoInternetBox = styled.div`
  width: 100%;
  height: 100%;
  minHeight: 50;
  minWidth: 50;
   div {
    position:absolute !important;
  }
  font-size: 1.2em;
  color: white;
  text-align: center;
  background-color: #c4c4c4;
  word-break: normal;
`;
