import styled from 'styled-components';
import { Col, Row } from "react-bootstrap";
import {
    DARK_GREEN_GREY,
    DARKEST_GREY, DETAIL_GREEN, LIGHTEST_GREY,
    MEDIUM_GREY,
    PRIMARY_BLUE,
    PRIMARY_BLUE_DARK,
} from "../../../../sass/general/constants";

export const RibbonRow = styled(Row).attrs({ id: 'ribbonRow' })`
  position: absolute;
  top: -1px;
  z-index: 1;
  width: auto;
  background-color: ${PRIMARY_BLUE};
  border-radius: 0 0 5px 0px;
  min-width: 430px;
  max-width: 639px;
  height: auto;
  @media screen and (max-width: 1147px) {
    min-width: 230px;
  }
`;

export const Container = styled(Col).attrs({ id: 'ribbon' })`
  padding: 0;
  z-index: 0;
  overflow: hidden;
  
.buttonPlace {
  display: inline-block;
  margin: 10px 0 0 10px;
  transition: all 0.2s ease-in;
  &:last-child{
    margin-bottom: 10px;
    margin-right: 10px;
  }
}

/*Ribbon buttons*/
.rib {
  padding: 5px 10px;
  height: 100%;
  font-size: 1em;
  background-color: rgba(255,255,255,0.2) !important;
  color: ${DARKEST_GREY};
  border: 1px solid ${DARKEST_GREY};
  border-radius: 3px;
  &:hover {
    background-color: white !important;
    color: ${PRIMARY_BLUE_DARK};
    border: 1px solid white;
  }
  .material-icons {
    vertical-align: text-bottom;
    font-size: 18px;
  }
}

/*Plugin class while dragging*/
.ribdrag {
  color: ${DARKEST_GREY};
  padding: 10px;
  max-height: 40px !important;
  &:hover {
    color: ${DARKEST_GREY} !important;
  }
}

/*****************Shortcut buttons*******************/
/*Shortcut buttons container*/
.mainButtons {
  display: inline-block;
  position: absolute;
  height: 100%;
  margin-top: 0px;
  width: 128px;
  right: 0px;
  top: 0;
  padding: 4px;
  background-color: ${MEDIUM_GREY};
}

/*Shortcut button*/
.ribShortcut {
  width: 32px;
  height: 32px;
  margin: 4px;
  padding: 8px;
  border: 0;
  color: ${DARK_GREEN_GREY};
  background-color: ${LIGHTEST_GREY};
  display: inline-block;
  &:hover {
    color: ${DETAIL_GREEN};
  }
  .material-icons {
    font-size: 16px;
  }
}

/*Disabled button*/
button[disabled].ribShortcut {
  color: #ccc;
}
`;
