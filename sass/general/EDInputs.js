export const EDCheckbox = `
  input[type="checkbox"] {
    padding: 0 !important;
    margin-left: 0;
    position: relative;
    display: inline-block;
    background-color: white;
    line-height: 5px;
    margin-right: 10px;
    height: 15px;
  }
`;

export const EDRange = `
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    padding: 0 10px 0 0
    //margin: 5.7px 0;
  }
  input[type=range]:focus {
    outline: none !important;
  }
  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 4.6px;
    cursor: pointer;
    box-shadow: 0px 0px 0.6px #ffffff, 0px 0px 0px #ffffff;
    background: #cccccc;
    border-radius: 25px;
    border: 0px solid #ffffff;
  }
  input[type=range]::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px rgba(255, 255, 255, 0), 0px 0px 0px rgba(255, 255, 255, 0);
    border: 1px solid #999999;
    height: 16px;
    width: 16px;
    border-radius: 50px;
    background: #ffffff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -5.7px;
  }
  input[type=range]:focus::-webkit-slider-runnable-track {
    background: #cccccc;
  }
  input[type=range]::-moz-range-track {
    width: 100%;
    height: 4.6px;
    cursor: pointer;
    box-shadow: 0px 0px 0.6px #ffffff, 0px 0px 0px #ffffff;
    background: #cccccc;
    border-radius: 25px;
    border: 0px solid #ffffff;
  }
  input[type=range]::-moz-range-thumb {
    box-shadow: 0px 0px 0px rgba(255, 255, 255, 0), 0px 0px 0px rgba(255, 255, 255, 0);
    border: 1px solid #999999;
    height: 16px;
    width: 16px;
    border-radius: 50px;
    background: #ffffff;
    cursor: pointer;
  }
  input[type=range]::-ms-track {
    width: 100%;
    height: 4.6px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type=range]::-ms-fill-lower {
    background: #cccccc;
    border: 0px solid #ffffff;
    border-radius: 50px;
    box-shadow: 0px 0px 0.6px #ffffff, 0px 0px 0px #ffffff;
  }
  input[type=range]::-ms-fill-upper {
    background: #cccccc;
    border: 0px solid #ffffff;
    border-radius: 50px;
    box-shadow: 0px 0px 0.6px #ffffff, 0px 0px 0px #ffffff;
  }
  input[type=range]::-ms-thumb {
    box-shadow: 0px 0px 0px rgba(255, 255, 255, 0), 0px 0px 0px rgba(255, 255, 255, 0);
    border: 1px solid #999999;
    height: 16px;
    width: 16px;
    border-radius: 50px;
    background: #ffffff;
    cursor: pointer;
    height: 4.6px;
  }
  input[type=range]:focus::-ms-fill-lower {
    background: #cccccc;
  }
  input[type=range]:focus::-ms-fill-upper {
    background: #cccccc;
  }

  input.form-control[type="range"] {
    background-color: transparent;
    outline: none !important;

  }
  input[type='range'],
  input[type='range']:focus,
  input[type='range']:active,
  input[type='range']::-moz-focus-inner,
  input[type='range']:-moz-focusring {
    border: 0 !important;
    outline: none !important;
  }
  input[type=range]::-moz-focus-outer {
    border: 0;
  }
`;

export const EDRadio = `
  input[type="radio"] {
    background-color: transparent;
    position: absolute;
    border-radius: 50%;
    cursor: pointer;
    display: block;
    height: 1em;
    margin-right: 1em;
    width:  1em;
    border: 0.1em solid #ccc;
    -webkit-appearance: none;
    -moz-appearance: none;
}
  input[type="radio"]:after {
      background-color: transparent;
      border-radius: 50%;
      content: '';
      display: block;
      height: 60%;
      left: 20%;
      position: absolute;
      top: 20%;
      width: 60%;
      text-rendering: optimizeLegibility;
  }
  input[type="radio"]:checked:after {
      background-color: #17CFC8;
  } 
`;
