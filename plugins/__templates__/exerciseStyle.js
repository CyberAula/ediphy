export const exerciseStyle = options => `
import styled from 'styled-components';
import { DETAIL_GREEN, LIGHT_RED } from "../../sass/colors";

export const ${options.name}Plugin = styled.div\`
      font-family: var(--themePrimaryFont);
\`;

export const AnswerRow = styled.div\`
    display: flex;
    flex-direction: row;
    margin: 0;
    i{
      margin: 0.5em -1em;
      &.correct{
        color: \${DETAIL_GREEN};
      }
      &.incorrect{
        color: \${LIGHT_RED};
      }
    }
\`;

export const AnswerText = styled.div\`
    padding: 0;
    width: 75%;
\`;

export const AnswerInput = styled.div\`
    display: flex;
    font-size: 1.5em;
    text-align: right;
    color: var(--themeColor1);
    padding: 0;
    width: auto;
    margin: 0.2em 0.14em 0.4em 0.8em;
\`;

export const AnswerLetter = styled.div\`
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
\`;

export const RadioInput = styled.input.attrs({ type: 'radio' })\`
      margin: 0.45em 0.3em 0.5em 0.6em !important;
      vertical-align: middle;
      padding: 0;
      border-radius: 50%;
      cursor: pointer;
      display: inline-block;
      height: 1em;
      position: relative;
      width: 1em;
      border: 0.1em solid #ccc;
      -webkit-appearance: none;
      &:after {
        margin:0;
      }
\`;
`;
