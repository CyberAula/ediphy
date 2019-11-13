import styled from "styled-components";
import { MEDDIUM_GREY } from '../../../../sass/general/constants';
import { Button } from 'react-bootstrap';

/* Buttons that act upon navItems*/

export const CarouselButton = styled(Button)`
  border: 0;
  padding: 0px;
  padding-top: 2px;
  padding-bottom: 2px;
  font-size: 19px;
  color: ${MEDDIUM_GREY};
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
