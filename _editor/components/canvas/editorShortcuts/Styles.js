import styled from 'styled-components';
import {
    DETAIL_GREEN_TRANSPARENT,
    MEDIUM_GREY, PRIMARY_BLUE,
} from "../../../../sass/general/constants";

export const TitleButton = styled.button`
  width: 32px;
  height: 32px;
  margin: 4px;
  padding: 8px;
  border: 0;
  display: inline-block;
  &:hover {
    color: ${DETAIL_GREEN_TRANSPARENT};
  }
  .material-icons {
    font-size: 16px;
  }
  background-color: ${MEDIUM_GREY};
  color: white;
  border-radius: 3px;
  text-align: center;
  &:hover {
    background-color: var(--themeColor1, ${PRIMARY_BLUE}) !important;
  }
`;
