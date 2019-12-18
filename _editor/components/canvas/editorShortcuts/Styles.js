import styled from 'styled-components';
import {
    DETAIL_GREEN_TRANSPARENT,
    MEDIUM_GREY, PRIMARY_BLUE,
} from "../../../../sass/general/constants";
import { Popover } from "react-bootstrap";

export const IconsContainer = styled.div`
  position: absolute;
  text-align: center;
  height: 40px;
  margin-top: -40px;
  transform-origin: 0 100%;
  box-shadow: 1px -1px 4px #ccc;
  z-index: 999;
  width: auto;
  background: #f5f5f5;
  border-radius: 2px 2px 0 0;
  .dtbSelected {
    background-color: ${PRIMARY_BLUE} !important;
  }
`;

export const TitleButton = styled.button`
  width: 32px;
  height: 32px;
  margin: 4px;
  padding: 8px;
  border: 0;
  display: inline-block;
  background-color: ${MEDIUM_GREY};
  color: white;
  border-radius: 3px;
  text-align: center;
  &:hover {
    color: ${DETAIL_GREEN_TRANSPARENT};
    background-color: ${PRIMARY_BLUE} !important;
    .material-icons{
      color: white;
    }
  }
  .material-icons {
    font-size: 16px;
    vertical-align: top;
    &:hover{
      color: white;
    }
  }
`;

export const PopoverURL = styled(Popover).attrs({ className: 'popoverURL' })`
  width: 400px !important;
  max-width: unset;
  .popover-content{
    display: flex;
    padding: 5px 14px 14px;
    .form-control{
      border-radius: 0;
      flex-shrink: 1;
    }
    .popoverButton{
      margin: 0 !important;
      padding: 2px 10px !important;
      flex-shrink: 1;
    }
  }
`;
