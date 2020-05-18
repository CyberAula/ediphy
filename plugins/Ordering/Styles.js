import styled from 'styled-components';
import { DETAIL_GREEN, LIGHT_RED } from "../../sass/colors";

export const OrderingPlugin = styled.div`
    font-family: var(--themePrimaryFont);
`;

export const AnswerRow = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0;
    .col-xs-10{
      padding: 0;
    }
    .order-drag-handle {
      position: absolute;
      left: 0;
      margin-left: -1em;
      margin-top: 0.3em;
      font-size: 2em;
      cursor: move;
    }
    i:not(.order-drag-handle){
    align-self: center;
      &.correct{
        color: ${DETAIL_GREEN};
      }
      &.incorrect{
        color: ${LIGHT_RED};
      }
    }
`;

export const AnswerPlaceholder = styled.div`
    display: flex;
    font-size: 1.5em;
    text-align: right;
    color: var(--themeColor1);
    width: auto;
    margin: 0.2em 0.14em 0.4em 0.8em;
    padding: 0 1.8em;
`;

export const AnswerLetter = styled.div`
    color: white;
    background-color: var(--themeColor1);
    border-radius: 1em;
    width: 1.5em;
    height: 1.5em;
    text-align: center;
    line-height: 1.1em;
    font-weight: 100;
    text-transform: uppercase;
    padding: 0.15em 0;
    font-size: 1.2em;
`;

export const AnswerText = styled.div`
      padding: 0;
      width: 83.333%;
`;

export const Orderable = styled.div.attrs({ className: 'orderable' })`
    display: flex;
    flex-direction: row;
    box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.06);
    &.hoveringOrder {
      background-color: #ccc;
      width:100%;
    }
`;
