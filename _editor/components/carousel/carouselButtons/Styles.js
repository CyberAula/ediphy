import styled from "styled-components";
import { MEDIUM_GREY } from '../../../../sass/general/constants';
import { Button } from 'react-bootstrap';

export const BottomGroups = styled.div`
width: 212px;
    position: fixed;
    bottom: 0;
    .material-icons {
        padding: 8px;
    }

    /*Overriding bootstrap*/
    h3, h4 {
        &:hover {
            cursor: pointer;
        }
    }
    .open > .dropdown-toggle.btn-default {
        color: white !important;
    }
    .btn-default, .open > .dropdown-toggle.btn-default {
        &:focus {
            color: white !important;
        }
    }
`;

export const BottomLine = styled.div`
width: 100%;
border-top: 1px solid #555;
`;

/* Buttons that act upon navItems*/
export const CarouselButton = styled(Button)`
  border: 0;
  padding: 0px;
  padding-top: 2px;
  padding-bottom: 2px;
  font-size: 19px;
  color: ${MEDIUM_GREY};
  min-width: 10%;
  border-radius: 0;
  background-color: transparent !important;
  float: none;
  &:hover,
  &:active {
    box-shadow: none !important;
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
    outline: none;
    color: white !important;
    background-color: transparent !important;
  };

  &[disabled] {
    opacity: 0.15;
  }
  .material-icons {
    font-size: 1em;
  }
  &:hover{
      @include scale(1.2);
  }
`;
