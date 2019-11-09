import styled from 'styled-components';

export const ImagePlugin = styled.div.attrs({ className: 'draggableImage' })`
    height: 100%;
    width: 100%;
    pointer-events: none;
    img {
      transform-origin: 0 0;
    }
`;

export const ImagePluginVisor = styled.div.attrs({ className: 'draggableImageVisor' })`
    height: 100%;
    width: 100%;
    overflow: hidden;
    img {
        transform-origin: 0 0;
    }
    a {
        display: block;
        position: relative;
    }  
`;

export const BasicImage = styled.img.attrs({ className: 'basicImageClass' })`
     &:not(.pointerEventsEnabled) &.dropableRichZone {
       pointer-events: none !important;
     }
`;

export const Link = styled.a`
     height: 100%;
     width: 100%;
     overflow: hidden;
     pointer-events: ${props => props.hyperlink ? 'initial' : 'none' };
`;
