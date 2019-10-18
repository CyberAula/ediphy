import styled from 'styled-components';

export const MapPlugin = styled.div`
  pointer-events: none;
  width: 100%;
  height:100%;
`;

export const DroppableRichZone = styled.div`
  width: 100%;
  height: 100%;
  minHeight: 50;
  minWidth: 50;
   div {
    position:absolute !important;
  }
`;
