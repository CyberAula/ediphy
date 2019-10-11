import styled from 'styled-components';

export const OrderingPlugin = styled.div`
    font-family: var(--themePrimaryFont);
`;

export const AnswerRow = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0;
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
