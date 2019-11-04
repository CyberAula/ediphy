import styled from 'styled-components';
import { BRAND_GREEN, LIGTHEST_GREY } from "../../../../sass/general/constants";

export const RadioButtonCustom = styled.button`
  width: 36px;
  height: 36px;
  margin: 4px;
  padding: 8px;
  border: 0;
  color: ${ props => props.selected ? BRAND_GREEN : 'grey' };
  background-color: ${LIGTHEST_GREY};
  display: inline-block;
  &:hover {
    color: #bbb;
  }
  .material-icons {
    font-size: 20px;
  }
`;
