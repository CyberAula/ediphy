import styled from 'styled-components';
import { GRIS_MEDIO } from "../../sass/colors";

export const InputTextPlugin = styled.div`
  height:100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  &.attempted.showFeedback {
    &.correct .inputText {
      border: 0.2em solid $detailgreen;
    }

    &.incorrect  .inputText{
      border: 0.2em solid $lightred;
    }
  }
`;

export const GenericInput = styled.input`
    width:100%;
    resize: horizontal;
    pointer-events: all !important;
    border-radius: 0px;
    min-height: 2em;
    border: 0.1em solid #ccc;
    padding: 0px 0.2em;
    line-height: 1;
`;

export const DragHandleInputPlugin = styled.div`
    display: ${props => props.show ? 'block' : 'none' };
    padding: 0.2em 0;
    line-height: 1.25em;
    padding-right: 0em;
    margin-right: -0.5em;
    cursor: move;
    min-height: 2em;
    min-width: 2em;
    vertical-align: top;
    .material-icons {
      font-size: inherit;
      vertical-align: middle;
      color: ${GRIS_MEDIO};
    }
`;

export const ExerciseScore = styled.div`
    display: ${ props => props.show ? 'flex' : 'none' };
    color: var(--themeColor1);
    font-size: 1em;
    width: auto;
    padding-left: 0.25em;
    height: 100%;
    word-break: keep-all;
    text-align: right;
`;
