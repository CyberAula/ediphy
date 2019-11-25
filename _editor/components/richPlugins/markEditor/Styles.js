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
    cursor: url("/images/mark.svg") 12 20, crosshair !important;
    i {
        display: none;
    }
    * {
        cursor: url("/images/mark.svg") 12 20, crosshair !important;
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
        cursor: url("/images/mark.svg") 12 20, crosshair !important;
    }
` : null }
`;

