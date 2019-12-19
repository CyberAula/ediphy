import styled from 'styled-components';
import { PRIMARY_BLUE } from "../../../sass/general/constants";

export const GlobalScoreContainer = styled.div`
  background-color: white;
  width: 250px;
  cursor: default;
  text-align: center;
  border: 2px solid grey;
  position: fixed;
  top:50px;
  right: 40px;
  &:hover {
    opacity: 0.2;
  }

  &.fadeButton {
    opacity: 0;
    -webkit-transition: all 0.5s ease-in-out;
  }

  &.hoverPlayerOn {
    opacity: 1 !important;
  }
  &.appearButton {
    opacity: 1;
    -webkit-transition: all 0.5s ease-in-out;
  }

  #score {
    margin:10px;
    text-align: left;
  }
  #userName{
    font-size: 18px;
    text-align: left;
    span {
      word-wrap: normal;
      height: 18px;
      word-break: keep-all;
      text-overflow: ellipsis;

      overflow: hidden;
    }
    margin: 10px;
  }
  .scoreField {
    margin-right: 10px;
    font-size: 18px;
  }
  i {
    vertical-align: bottom;
    color: ${PRIMARY_BLUE};
    font-size: 18px;
    margin-right:2px;
  }

  #progressbar {
    display: block;
    margin: 0px 12px;
    position: relative;
    background-color: #eaeaea;
    border-radius: 5px;
    overflow: hidden;
    height: 7px;
    margin-bottom: 10px;
  }

  #currentprogress {
    background-color: ${PRIMARY_BLUE};
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
  }
  .progressField {
    text-align: right;
    display: block;
    margin: 0px 10px;
    font-size: 10px;
    color: #777;
  }
`;

export const NavScoreContainer = styled.div`
  font-size: 12px;
  #progressbar {
    display: block;
    margin: 0px 12px;
    position: relative;
    background-color: #444;
    border-radius: 5px;
    overflow: hidden;
    height: 7px;
  }

  #currentprogress {
    background-color: ${PRIMARY_BLUE};
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
  }
  .progressField {
    text-align: right;
    display: block;
    margin: 0px 10px;
    font-size:  8px;
    color: #777;
  }
  i {
    vertical-align: bottom;
    color: ${PRIMARY_BLUE};
    font-size: 16px;
    margin-right:2px;
  }
  #userName{
     span {
       word-wrap: normal;
       height: 12px;
       word-break: keep-all;
       text-overflow: ellipsis;
       text-align: left;
       overflow: hidden;
     }
     margin: 10px;
  }
  .colScore {
    padding-left: 10px;
  }
  .rowScore {
    margin:0;
  }
`;
