import styled from 'styled-components';

export const MarkEditorContainer = styled.div`
@keyframes opac {
  0%   { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes stripes {
  to {
    background-size:100% 100%;
  }
}
*{
  pointer-events: none !important;
}
i{
  opacity: 1;
}
${props => props.editing ? `
    cursor: url("${Ediphy.Config.default_mark}") 12 20, crosshair !important;
    i {
        display: none;
    }
    * {
        cursor: url("${Ediphy.Config.default_mark}") 12 20, crosshair !important;
    }
` : null }

${props => (props.editing && props.isImage) ? `
    .mapMarker:after {
      position: absolute;
      display: inline-block;
      content: '';
      width: 24px;
      height: 24px;
      background: url("${Ediphy.Config.default_mark}");
      left: calc(50% - 12px);
      bottom: 1px;
  
    }
    .3mapMarker:after {
      position: absolute;
      display: inline-block;
      content: '';
      width: 4px;
      height: 10px;
      background: red;
      left: calc(50% - 2px);
      bottom: calc(0% - 3px);
      border: 1px solid black;
      -webkit-box-sizing:border-box;
      box-sizing:border-box;
    }

    .3mapMarker:before {
      position: absolute;
      display: inline-block;
      content: '';
      width: 10px;
      height: 4px;
      background: red;
      left: calc(50% - 5px);
      bottom: 0;
      border: 1px solid black;
      -webkit-box-sizing:border-box;
      box-sizing:border-box;
    }
` : null }

${props => props.holding ? `
    i {
        animation: opac 3s forwards;
        margin: auto;
        background: linear-gradient( white , white) transparent no-repeat 0 0;
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        mix-blend-mode: multiply;
        background-size:  100% 0;
        animation: stripes 3s forwards;
    }
    * {
        cursor: url("${Ediphy.Config.default_mark}") 12 20, crosshair !important;
    }
` : null }
`;

