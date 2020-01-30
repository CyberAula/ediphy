import styled from 'styled-components';
import { Col } from "react-bootstrap";
import { LIGHT_GREY, LIGHTEST_GREY, MEDIUM_GREY, PRIMARY_BLUE } from "../../../../sass/general/constants";

export const ActionRibbonContainer = styled(Col).attrs({ id: 'ActionRibbon' })`
  height: ${ props => props.height ? props.height : null };
  background-color: #dedede;
  box-shadow: inset 0px 3px 5px 0px rgba(179,179,179,1);
  padding: 0;
  z-index: 0;
  overflow: hidden;
  overflowY: hidden;
`;

export const Actions = styled.div.attrs({ id: 'Actions' })`
  float: right;
  height: 50px;
`;

export const ActionBtn = styled.button`
  height: 40px;
  background-color: ${ props => props.active ? PRIMARY_BLUE : 'transparent'};
  color: ${ props => props.active ? 'white !important' : null};
  border-radius: 3px;
  border: none;
  margin: 5px;
  padding: 0 5px;
  cursor: pointer;
  .material-icons {
    font-size: 16px;
  }
  span {
    display: block;
    font-size: 12px;
    margin: -3px 0;
  }
  &:hover{
    color: black;
  }
  &[disabled]{
    cursor: not-allowed;
    color: ${MEDIUM_GREY};
  }
`;

export const Separator = styled.span`
  border-right: 1px solid #999;
  height: 50px;
  vertical-align: top;
  overflow: visible;
  display: inline-block;
`;
