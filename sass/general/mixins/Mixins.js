import styled from 'styled-components';

export function animation(prop = "all", duration = "0.3s") {
  return `
  transition: ${prop} ${duration} ease-in;
  -webkit-transition: ${prop} ${duration} ease-in;
  -moz-transition: ${prop} ${duration} ease-in;
  -o-transition: ${prop} ${duration} ease-in;
  `
}

export const CustomRange = styled.div`
  input[type=range] {
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 35%;
    margin: -0.45em 2.5%;
    height: 100%;
    margin-left: 1.3em;
  }
  input[type=range]:focus {
    outline: none;
  }
  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 0.2em;
    cursor: pointer;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
    background: rgba(0, 0, 0, 0.52);
    border-radius: 0px;
    border: 0px solid rgba(0, 0, 0, 0);
  }
  input[type=range]::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
    border: 0.1em solid rgba(0, 0, 0, 0);
    height: 0.9em;
    width: 0.9em;
    border-radius: 0.75em;
    background: #ccffff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -0.4em;
  }
  input[type=range]:focus::-webkit-slider-runnable-track {
    background: rgba(89, 89, 89, 0.52);
  }
  input[type=range]::-moz-range-track {
    width: 100%;
    height: 0.2em;
    cursor: pointer;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
    background: rgba(0, 0, 0, 0.52);
    border-radius: 0px;
    border: 0px solid rgba(0, 0, 0, 0);
  }
  input[type=range]::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
    border: 1px solid rgba(0, 0, 0, 0);
    height: 0.9em;
    width: 0.9em;
    border-radius: 0.75em;
    background: #ccffff;
    cursor: pointer;
  }
  input[type=range]::-ms-track {
    width: 100%;
    height: 0.2em;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type=range]::-ms-fill-lower {
    background: rgba(0, 0, 0, 0.52);
    border: 0px solid rgba(0, 0, 0, 0);
    border-radius: 0px;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  }
  input[type=range]::-ms-fill-upper {
    background: rgba(0, 0, 0, 0.52);
    border: 0px solid rgba(0, 0, 0, 0);
    border-radius: 0px;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  }
  input[type=range]::-ms-thumb {
    box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
    border: 1px solid rgba(0, 0, 0, 0);
    height: 0.9em;
    width: 0.9em;
    border-radius: 0.75em;
    background: #ccffff;
    cursor: pointer;
    height: 0.2em;
  }
  input[type=range]:focus::-ms-fill-lower {
    background: rgba(0, 0, 0, 0.82);
  }
  input[type=range]:focus::-ms-fill-upper {
    background: rgba(89, 89, 89, 0.82);
  }
`;
