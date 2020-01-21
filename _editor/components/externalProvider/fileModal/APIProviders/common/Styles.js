import styled from 'styled-components';
import { PRIMARY_BLUE } from "../../../../../../sass/general/constants";

export const ImageCatalog = styled.img`
    width: 100%;
    height: auto;
    min-height:180px;
    max-height:200px;
    border: solid ${props => props.selected ? PRIMARY_BLUE : 'transparent'} 3px;
`;
