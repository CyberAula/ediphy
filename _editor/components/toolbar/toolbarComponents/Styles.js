import styled from 'styled-components';
import { Button } from "react-bootstrap";
import { PRIMARY_BLUE } from "../../../../sass/general/constants";

export const ToolbarButton = styled(Button)`
    border-radius: 0;
    background-color: ${PRIMARY_BLUE};
    color: white;
    border: 0;
    width: 100%;
    margin: 10px 0;

    /*Edit text button when CKEditor is active */
    &.textediting {
      background-color: darken(${PRIMARY_BLUE},20%);
    }
    &:hover {
      background-color: darken(${PRIMARY_BLUE},20%);
    }
`;

export const RangeOutput = styled.span.attrs({ className: 'rangeOutput' })`
    color: #ccc;
    float: right;
    margin-right: 12px;
    position: relative;
    top: 50px;
    right: 4px;
    font-size: 0.9em;
    margin-top:9px;
`;
