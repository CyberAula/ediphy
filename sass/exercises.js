import styled from 'styled-components';

export const RadioStyleDangerous = (className) => `
        .${className} input[type="radio"]  {
          background-color: transparent;
        }
        .${className} input[type="radio"]:checked:after {
          background-color: var(--themeColor1);
        }
`;

export const CheckBoxStyleDangerous = className => `
        .${className} input[type="checkbox"]:checked:after {
          color: var(--themeColor1);
        }
`;

export const ExerciseScore = styled.div`
      display: ${props => props.attempted ? 'block' : 'none'};
      text-align: right;
      color: var(--themeColor1);
      font-size: 0.8em;
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

export const CorrectAnswerFeedback = styled.div`
    display: ${props => props.show ? 'block' : 'none'};
    text-align: left;
    text-transform: uppercase;
`;

export const CorrectAnswerLabel = styled.span`
    text-transform: none;
`;

export const QuestionRow = styled.div`
      margin: 0 !important;
`;
