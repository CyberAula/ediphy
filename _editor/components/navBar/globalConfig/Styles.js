import styled from 'styled-components';
import { ControlLabel, FormGroup, InputGroup, Modal } from "react-bootstrap";

export const GlobalConfigModal = styled(Modal).attrs({ className: 'pageModal' })`
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
      -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);
      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);

    }
    .Select-control {
        border: none;
    }
}
}
.advanced-block{
      background-color: $lightestgrey;
}
.control-label {
color: #444 !important;
}
   .avatarButtons {
     margin-bottom:3px;
     width: 100%;
   }

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
