import styled from 'styled-components';
import { DETAIL_GREEN, LIGHT_RED } from "../../sass/colors";

export const AnswerRow = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0;
    .col-xs-10{
      margin: 0.2em 0;
      padding: 0;
      width: 75%;
    }
    i{
      margin: 0.5em -1em;
      &.correct{
        color: ${DETAIL_GREEN};
        font-size: 1.7em;
      }
      &.incorrect{
        color: ${LIGHT_RED};
        font-size: 1.7em;
      }
    }
`;

export const AnswerInput = styled.div`
    display: flex;
    justify-content: space-evenly;
    font-size: 1.5em;
    margin: 0.4em 0.1em 0.4em 0.8em;
    text-align: right;
    padding: 0;
    width: 16.666%;
    min-width: 100px;
    align-items: baseline;
`;

export const AnswerLetter = styled.div`
    color: white;
    background-color: var(--themeColor1);
    vertical-align: middle;
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
      margin: 0.2em 0;
      margin-left: -1em;
      margin-right: -1em;
      padding: 0;
      width: 75%;
`;

export const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
    margin: 0.4em 0.8em 0.5em 0.7em;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: white;
    border: 0.1em solid #ccc;
    transform: scale(1.3);
    padding: 0.3em !important;
    border-radius: 0;
    display: inline-block;
    position: relative;
    cursor: pointer;
    height:0.3em;
    
    &:checked{
      background-color: white;
      border: 0.1em solid #ccc;
      color: #99a1a7;
    }
    
    &:checked:after{
      content: '\\2714';
      font-size: 0.8em;
      line-height: 0.8em;
      font-weight: bold;
      position: absolute;
      background-color: white;
      top: 0;
      left: -0.04em;
      width: 0.7em;
      height: 0.7em;
      padding-left: 0.01em;
      cursor: pointer;
      color: var(--themeColor1);    
    }
`;

export const MultipleAnswerPlugin = styled.div.attrs({ className: 'multipleAnswerPlugin' })`
     display: flex;
     flex-direction: column;
     padding: 0.8em;
`;
