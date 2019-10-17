import styled from 'styled-components';

export const FreeResponsePlugin = styled.div`
    font-family: var(--themePrimaryFont);
`;

export const AnswerRow = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0;
`;

export const TextArea = styled.textarea`
    height: 14em !important;
    resize: none !important;
    background-color: white;
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

export const ManyCharacters = styled.div`
    display: ${ props => props.show ? 'block' : 'none' };
    color: red;
    text-align: left;
    padding-left: 0.8em;
`;
