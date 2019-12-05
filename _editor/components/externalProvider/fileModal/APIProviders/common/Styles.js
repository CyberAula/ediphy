import styled from 'styled-components';
import { PRIMARY_BLUE } from "../../../../../../sass/general/constants";

export const ImageCatalog = styled.img`
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 160px;
    min-width: 50px;
    border: solid ${props => props.selected ? PRIMARY_BLUE : 'transparent'} 3px;
`;
