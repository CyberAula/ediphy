import styled from 'styled-components';

export const DETAIL_GREEN = '#39B54A';
export const LIGHT_RED = '#E30B0B';

export const TrueFalsePlugin = styled.div`
      font-family: var(--themePrimaryFont);
      text-align: left;
      display: flex;
      flex-direction: column;
`;

export const AnswerInput = styled.div`
      padding: 0;
      font-size: 1.5em;
      width: 3em;
      min-width: 3em;
      display: flex;
      flex-flow: nowrap row;
      justify-content: space-between;
      align-items: center;
      padding-right: 0.3em;
`;

export const Feedback = styled.div`
      background-color: var(--themeColor1Transparent);
      margin:0;
      padding:0;
      border: 0.1em solid var(--themeColor1);
      color: var(--themeColor1);
      border-radius: 0.2em;
`;

export const FeedbackRow = styled.div`
      padding: 0.8em;
      margin:0;
      display: ${props => props.show ? 'block' : 'none'};
`;
export const IconCol = styled.div`
      width: 16.666%
      display: flex;
      justify-content: space-between;
      width: 4.5em;
      min-width: 4.5em;
      padding: 0;
`;

export const RadioInput = styled.input.attrs({ type: 'radio' })`
      margin: 0 !important;
      margin-top: 0.5em;
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
        border-radius: 50%;
        content: "";
        display: block;
        height: 60%;
        left: 20%;
        top: 20%;
        width: 60%;
        text-rendering: optimizeLegibility;
        position: relative;
      }
        &:checked:after {
        background-color: var(--themeColor1);
      }
`;
export const TFRow = styled.div`
      margin: 0.8em 1em;
      display: flex;
      flex-direction: row;
      .material-icons {
        font-size: 1.3em;
      }
`;

export const AnswerRow = styled.div`
      margin: 0 1em;
      display: flex;
      flex-direction: row;
      i{
        margin: 0.5em 0;
        align-self: center;
        &.correct{
          color: ${DETAIL_GREEN};
        }
        &.incorrect{
          color: ${LIGHT_RED};
        }
      }
`;

export const AnswerText = styled.div`
      padding: 0;
      width: 83.333%;
`;

export const True = styled.i`
      background-color: ${DETAIL_GREEN};
      color: white;
      border-radius: 0.2em;
      padding: 0.2em;
`;

export const False = styled.i`
      background-color: ${LIGHT_RED};
      color: white;
      border-radius: 0.2em;
      padding: 0.2em;
`;
