import styled from 'styled-components';
import {Modal} from "react-bootstrap";
import {ADAMS_GREY, GREY_PANEL_HEADINGS, MEDIUM_GREY, PRIMARY_BLUE} from "./constants";

export const EDModal = styled(Modal)`
  button{
    border-radius: 0;
  }
   .modal-content{
      min-height: 50px;
    	border-radius: 0;
  	}

    .modal-header {
      border-radius:0;
      font-size: 1.1em;
      color: white;
      background-color: ${GREY_PANEL_HEADINGS};
      margin: -1px;
      .modal-title{
        margin: 0;
        padding: 2px;
      }
      .close {
        color: white;
        text-shadow: none;
      }
  	}
    .modal-body{
      overflow-y: visible;
      padding: 20px;
      .container{
        width: auto;
        h4{
          padding: 0px;
          color: ${MEDIUM_GREY};
          display: inline-block;
          margin: 0 20px 5px 0;
        }
        h5{
          color: ${PRIMARY_BLUE};
          font-weight: bold;
        }
        hr{
          margin-top: 10px;
          margin-bottom: 10px;
          border: 0;
          border-top: 1px solid #ccc;
        }
        .content-block{
          padding: 10px 15px;
          background: #f1f0f0;

        }
      }

      .form-control, .Select-control, .input-group-addon, .ReactTags__tagInputField{
        border-radius: 0;
      }
      .miniIcon{
        color: ${MEDIUM_GREY};
        float: right;
        opacity: 0.5;
        margin: 5px 0;
        &:hover{
          opacity: 1;
        }
      }
      .control-label{
        margin: 5px 0;
        padding: 0;
        font-size: 1em;
        color: ${PRIMARY_BLUE};
      }

    }
  	.modal-footer{
        border: none;
		.btn-primary{
			background-color: $;
			&:hover{
				background-color: darken(${PRIMARY_BLUE}, 7%) !important;
			}
		}
        .btn-secondary{
          background-color: ${ADAMS_GREY};
          &:hover{
            background-color: darken(${ADAMS_GREY}, 10%) !important;
          }
        }
		.btn-default{
			background-color: #555;
			&:hover{
              background-color: darken(#555, 10%) !important;
			}
		}
		button{
			color: white !important;
			border: none;
		}
 	}
`;
