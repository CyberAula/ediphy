import styled, { css } from "styled-components";
import { FormControl } from 'react-bootstrap';
import { PRIMARY_BLUE, PRIMARY_BLUE_DARK } from "../../../../sass/general/constants";

export const EditorIndex = styled(FormControl)`
  border-box: 0;
  -moz-border-box: 0;
  box-shadow: none;
  -moz-box-shadow: none;
  display: inline-block;
  font-size: 13px;
  line-height: 1em;
  border: 0;
  border-radius: 0;
  &:focus {

    box-shadow: none;
    -moz-box-shadow: none;

  }
  ${props => !props.coursetitle && css`
    width: 100%;
    height: 35px;
    padding: 0;
    vertical-align: top;
    &:focus{
        margin-right: 10px;
        color: white;
        border-bottom: 1px solid ${PRIMARY_BLUE_DARK};
        background-color: transparent;
    }
    &::selection{
        background-color: ${PRIMARY_BLUE};
        color: white;
        font-weight: bold;
    }
  `}
  ${props => props.coursetitle && css`
    width: 95%;
    padding: 10px;
  `}
`;

export const ActualSectionTitle = styled.div`
    cursor: text;
    text-overflow: ellipsis;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    left: 0;
    width: 90%;
    color:rgb(204,204,204);
    transition-timing-function: linear;
    line-height: 1.2em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    line-height: 1.2em;
    vertical-align: middle;
    margin-right: 25px;
    color: inherit;
`;
