import styled from 'styled-components';

export const InputTextPlugin = styled.div`
  height:100%;
  display: flex;
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
    pointer-events: none;
    border-radius: 0px;
    min-height: 2em;
    border: 0.1em solid #ccc;
    padding: 0px 0.2em;
    line-height: 1;
`;

export const DragHandleInputPlugin = styled.div`
    visibility: hidden;
    position: absolute;
    right: 0;
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
      color: $grismedio;
    }
`;
