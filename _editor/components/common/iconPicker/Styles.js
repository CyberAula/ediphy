import { PRIMARY_BLUE, PRIMARY_BLUE_SEMI_TRANSPARENT } from "../../../../sass/general/constants";
import styled from 'styled-components';

export const StyledTable = styled.div`
    .input{
        border-radius: 0; 
        padding: 6px; 
        border: 1px;
        border-style: solid; 
        border-blockColor: #ccc; 
        width: 100%;
    }
    .table{
         height: 200px;
         width: 100%;
         display: flex;
         flex-direction: row;
         flex-wrap: wrap;
         position: relative;
         overflow-y: scroll;
         align-content: flex-start;
         scrollbar-color: ${PRIMARY_BLUE} #f0efed;
         scrollbar-width: thin;
    }
    .markIcon {
        height: 42px;
        cursor: pointer;
    }
    
    .selectedIcon {
        background-color: ${PRIMARY_BLUE_SEMI_TRANSPARENT};
        border-radius: 50%;
    }
    `;
