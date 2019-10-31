import styled from 'styled-components';
import {
    ADAMS_GREEN,
    ADAMS_ORANGE,
    DARKEST_GREY,
    LIGHT_GREY,
    LIGTHEST_GREY, MatIcon,
    PRIMARY_BLUE,
} from "../../../sass/general/constants";

export const Wrapper = styled.div.attrs({
    id: 'wrap', className: 'wrapper',
})`
  transition: top 0.3s ease-in;
  margin: 0;
  position: fixed;
  bottom: 0;
  right: 0px;
  top: ${ props => props.top ?? '0px' };
`;

export const Flap = styled.div.attrs({
    id: 'toolbarFlap',
})`
  border-width: 8px;
  border-style: solid;
  text-align: center;
  display: inline-block;
  position: absolute;
  top: 24px;
  right: 100%;
  border-color: transparent;
  border-right-color: ${DARKEST_GREY};
  color: ${ADAMS_GREEN};
  z-index: 1000;
  cursor: pointer;
`;

export const Tools = styled.div.attrs({ className: 'tools' })`
  width: ${ props => props.open ? '250px' : '40px' };
  transition: width 0.3s ease-in;
  height: 100%;
  background-color: ${DARKEST_GREY};
  display: inline-block;
  vertical-align: baseline;
  overflow-x: hidden;
  overflow-y: auto;

  .form-group {
    margin: 10px 0;
  }
  /* Input text */
  .form-control {
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    border-radius: 0;
    height:auto;
    border: 0;
    padding: 10px 12px;
    background-color: white;
    color: black;
    &:active, &:focus {
      border-color: orange;
    }
  }

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

  label, .label {
    margin: 0 !important;
    padding: 0 0 5px 0 !important;
    font-size: inherit;
    font-weight: 500;
  }
  .control-label{
    margin: 8px 0 !important;
  }
  .radio {
    margin-left: 25px;
  }
  .toolbarButton {
    border-radius: 0;
    background-color: ${PRIMARY_BLUE};
    color: white;
    border: 0;
    width: 100%;
    margin: 10px 0;

    /*Edit text button when CKEditor is active */
    &.textediting {
      background-color: darken(${PRIMARY_BLUE},20%);
    }
    &:hover {
      background-color: darken(${PRIMARY_BLUE},20%);
    }
  }
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

export const ToolbarTabs = styled.div.attrs({ className: 'toolbarTabs' })`
/*Navigation Tabs*/
  color: ${LIGTHEST_GREY};
  .toolbarTab{
    .panel-group{
      margin-bottom: 5px;
    }
  }
  li {
    padding-bottom: 0;
    a {
      border-color: transparent;
      color: ${LIGTHEST_GREY};
      border-radius: 0;
      padding: 10px 12px;
      cursor: pointer;
      &:hover {
        border-color: transparent;
        background-color: transparent;
        color: ${ADAMS_ORANGE};
      }
    }
  }
`;

export const ToolbarTitle = styled.div`
`;

export const Title = styled.div`
    display: ${ props => props.open ? 'inline-block' : 'block' };
    margin-top: ${ props => props.open ? '0px' : '8px' };
    cursor: pointer;
    color: ${LIGHT_GREY};
    * {
        transition: all 0.2s ease-in;
    }
    &:hover {
        color: #fff !important;
    }
    .material-icons {
        padding: 10px;
        &:hover{
            transform: scale(1.2);
        }
    }
    .btnToggleCarousel, .btnFullCarousel {
        cursor: pointer;
        color: white;
        background-color: transparent;
        border: none;
        &:hover {
            transform: scale(1.2);
        }
    }
    .btnFullCarousel {
        right: 0;
    }
`;

export const PluginTitle = styled.div`
    display: ${ props => props.open ? 'block' : 'none' };
    margin: -8px 6px 8px;
    color: ${ PRIMARY_BLUE };
    font-weight: 500;
`;

export const TitleText = styled.span`
    display: ${ props => props.open ? 'block' : 'none' };
    padding: 8px;
`;

export const ToolbarHeader = styled.div`
    display: block;
    cursor: pointer;
    color: ${LIGHT_GREY};
`;

export const InsideTools = styled.div`
    display:${ props => props.open ? 'block' : 'none' };
    width: 250px;
    transition: width 0.3s ease-in;
    .btn-group, .pluginToolbarMainButton {
      background-color: ${DARKEST_GREY};
      border: 0;
      color: white;
      font-weight: lighter !important;
    }

    .tablist {
      li {
        .active {
          color: ${LIGTHEST_GREY};
        }
      }
    }

    border-left: 2px solid ${DARKEST_GREY};
    border-right: 2px solid ${DARKEST_GREY};
`;

export const Wheel = styled(MatIcon)`
    padding: 10px;
    float: left;
    font-size: 20px;
    margin-top: 8px;
    transition: all 0.2s ease-in;
    &:hover{
        transform: rotate(180deg);
    }
`;
