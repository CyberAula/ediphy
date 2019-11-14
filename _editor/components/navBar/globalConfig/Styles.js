import styled from 'styled-components';
import { ControlLabel, FormGroup, InputGroup } from "react-bootstrap";
import { LIGHTEST_GREY } from "../../../../sass/general/constants";
import { EDRadio } from "../../../../sass/general/EDInputs";
import { EDModal } from "../../../../sass/general/EDModal";

export const ConfigRange = `

input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    top: -5px;
    pointer-events: all;
    border: 2px solid #CCD2DB;
    box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.10);
    border-radius: 4px;
    background-color: white;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    position: relative;
    z-index: 1;
    outline: 0;
    height: 15px;
    width: 15px;
}

input[type=range]::-webkit-slider-runnable-track {
    background-color: transparent;
    height: 6px;
    border-radius: 13px;
    border: 1px solid #EDEEF0;
}

/* Styles for Firefox */
input[type=range]::-moz-range-thumb {
    -moz-appearance: none;
    pointer-events: all;
    border: 2px solid #CCD2DB;
    box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.10);
    border-radius: 4px;
    background-color: white;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    position: relative;
    z-index: 100;
    outline: 0;
    height: 12px;
    width: 12px;
}

input[type=range]::-moz-range-track {
    position: relative;
    z-index: -1;
    background: none transparent;
    height: 6px;
    border-radius: 13px;
    border: 1px solid #EDEEF0;
}

/* extra fixes for Firefox */
input[type=range]:last-of-type::-moz-range-track {
    -moz-appearance: none;
    background: none transparent;
    border: 0;
}

input[type=range]::-moz-focus-outer {
    border: 0;
}
.C\\(\\#4e5b65\\) {
  color: #4e5b65;
}
.D\\(ib\\) {
  display: inline-block;
}
.Fl\\(end\\) {
  float: right;
}
.H\\(35px\\) {
  height: 20px;
}
.Pos\\(r\\) {
  position: relative;
}
.Ta\\(c\\) {
  text-align: center;
}
.W\\(100\\%\\) {
  width: 100%;
}
`;

export const GlobalConfigModal = styled(EDModal).attrs({ className: 'pageModal' })`
.gcModalBody {
position: relative;
top: -1px;
width: 100%;
height:97%;
padding: 0px;
background-color: white;
overflow-y: auto;
.form-group{
      .control-label{
        width: 100%;
      }
      .cont_avatar {
        display: flex;
        flexFlow: row nowrap;
        .avatar {
          margin: 0 10px 10px 0;
          border: 1px solid gray;
          max-height: 104px;
          max-width: 250px;
        }
        .fileInput{
          width: 80%;
          margin-bottom: 10px;
          .fileDrag{
            margin: 0;
          }
        }
        button{
          margin-right: 5px;
        }
      }
      .Select {
        border: 1px solid #ccc;
        &.select-disabled {
            .Select-value {
                cursor: not-allowed;
                .Select-value-label {
                    color: #aaa !important;
                }  
            }
         }
  &:focus, .is-focused {
      border-color: #66afe9;
      outline: 0;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);
    }
    .Select-control {
        border: none;
    }
}
}
.advanced-block{
    background-color: ${LIGHTEST_GREY};
}
.control-label {
    color: #444 !important;
}
.avatarButtons {
    margin-bottom:3px;
    width: 100%;
}
${ConfigRange}
${EDRadio}
}
`;

export const ConfigInputGroup = styled(InputGroup)`
    display:inline-table;
    margin-right: 10px;
    width:30%;
`;

export const ConfigMiniIcon = styled.a.attrs({ id: 'helpIcon' })`
  right: 15px;
  position: absolute;
  .material-icons{
    font-size: 18px;
    color: #9a9a9a;
    vertical-align: middle;
    cursor: help;
  }
`;

export const ConfigDescription = styled(FormGroup)`
    resize: none !important;
`;

export const OutsideInputBox = styled.div`
     box-sizing: border-box;
     border: 1px solid #eee;
     height: 7px;
     top:6px;
`;

export const InsideInputBox = styled.div`
          box-sizing: border-box;
          height: 5px;
`;

export const ConfigAspectRatio = styled.div`
  display: flex;
  flex-direction: row;
`;

export const ConfigAllowance = styled(FormGroup)`
  a {
  margin-bottom: 4px;
  }
`;

export const ConfigInlineLabel = styled(ControlLabel)`
  display: inline;
  margin-right: 10px !important;
`;

export const ConfigDifficulty = styled.div`
${ConfigRange}
input{
    pointer-events: none;
    position: absolute;
    overflow: hidden;
    left: 0;
    width: 100%;
    outline: none;
    height: 18px;
    margin: 0;
    padding: 0;
    appearance: none;
    background-color: transparent;
    }
`;

