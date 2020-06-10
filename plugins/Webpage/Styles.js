import styled from 'styled-components';

export const WebPlugin = styled.iframe`
    width: 100%; 
    height: 100%; 
    pointer-events: ${ props => props.visor ? 'all' : 'none' }; 
    z-index: 0; 
    border: 1px solid grey;
`;
