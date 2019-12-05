import styled from 'styled-components';

export const CanvasEditor = styled.div`
  width: 100%;
  min-height: 100%;
    .wholebox > div > div > iframe, .wholebox > div > div > video {
        pointer-events: none !important;
    }
`;

export const ScrollContainer = styled.div`
  width: 100%;
  min-height: 100%;
  background-color: white;
`;
