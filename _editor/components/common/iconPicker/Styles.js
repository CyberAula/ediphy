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
         height: 160px;
         width: 100%;
         display: flex;
         flex-direction: row;
         flex-wrap: wrap;
         position: relative;
         overflow-y: scroll;
         align-content: flex-start;
         scrollbar-color: ${PRIMARY_BLUE} #f0efed;
         scrollbar-width: thin;   
        &::-webkit-scrollbar {
            width: 8px;
        }         
        &::-webkit-scrollbar-track {
            background-color: #f0efed; 
            border-radius: 10px;
            border-color: #f0efed;
        }         
        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background-color: ${PRIMARY_BLUE}; 
        }
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

