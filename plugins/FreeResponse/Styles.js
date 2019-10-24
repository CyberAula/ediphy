import styled from 'styled-components';

export const FreeResponsePlugin = styled.div`
    font-family: var(--themePrimaryFont);
`;

export const AnswerRow = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0;
`;

export const TextArea = styled.textarea.attrs({ className: 'form-control textAreaQuiz' })`
    height: 14em !important;
    resize: none !important;
    background-color: white;.wholebox.selectedBox .textAreaQuiz {
     pointer-events: none;
   }
#visorAppContent .textAreaQuiz {
  pointer-events: all;
}
    border-radius: 0;
    box-shadow: none;
    overflow:visible;
    font-size: 1em;
    padding: 1em;
    pointer-events: all !important;
    margin: 0 1.5%;
    width: 97%;
    border: 0.1em solid #ccc;
    &[disabled]{
        background-color: white;
    }
`;

export const TextAreaVisor = styled(TextArea).attrs({ className: 'textAreaQuizVisor' })`
    resize: vertical !important;
    pointer-events: all !important;
    padding: 1em;
`;
export const ManyCharacters = styled.div`
    display: ${ props => props.show ? 'block' : 'none' };
    color: red;
    text-align: left;
    padding-left: 0.8em;
`;
