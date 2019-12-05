import styled from 'styled-components';
import { EDModal } from "../../../sass/general/EDModal";
import Alert from "../common/alert/Alert";

export const WelcomeModalStyle = `
  &.fade:not(.in) {
    transition: all 1s ease-in;
    transform: translate(0,0) !important;
    .modal-dialog {
      transform: translate(50vw,-50vh) scale(0.1);
    }
  }
  .modal-content{
    .modal-body {
      padding: 30px;
      .welcomeModalDiv {
        text-align: center;
        color: #999999;
        h1 {
          font-size: 2em;
        }
        p {
          font-size: 1.2em;
          font-weight: normal;
          max-width: 400px;
          margin: 0 auto;
        }
      }
    }
  }
`;

export const HelpModalContainer = styled(EDModal)`
  ${WelcomeModalStyle}
    h2{
    margin: 0;
    color: #555555;
    font-size: 1.5em;
  }
  .help_options{
    width: 100%;
    display: flex;
    button{
      background-color: transparent;
      border: none;
      width: 33%;
      a:hover{
        color: white;
        background-color: #17CFC8;
      }
    }
    a{
      width: 33%;
      text-align: center;
      text-decoration: none;
    }
    .help_item{
      border: 3px solid #17CFC8;
      min-height: 150px;
      margin: 3px;
      padding: 10px;
      color: #17CFC8;
      align-self: center;
      &:hover{
        color: white;
        background-color: #17CFC8;
      }
    }
  }
`;

export const AlertContainer = styled(Alert)`
${WelcomeModalStyle}
`;
