import styled from 'styled-components';
import { PRIMARY_BLUE_TRANSPARENT } from "../../../../sass/general/constants";

export const FontPickerContainer = styled.div`
    width: 100% !important;
    color: black;
    .dropdown-button{
      background-color: white;
    }
    button{
      background-color: #fcfcfc;
      &:hover{
        background-color: ${PRIMARY_BLUE_TRANSPARENT};
      }
    }
    .active-font{
      background-color: #dddddd;
    }
`;
