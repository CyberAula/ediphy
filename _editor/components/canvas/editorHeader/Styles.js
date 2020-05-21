import styled from 'styled-components';
import { ADAMS_GREY, MatIcon, MEDIUM_GREY, PRIMARY_BLUE } from "../../../../sass/general/constants";
import { FormControl, Popover } from "react-bootstrap";

export const BreadCrumb = styled.div.attrs({ className: 'contenido' })`
display: ${props => props.hide ? 'none' : 'block'};
.breadcrumb {
  padding: 0;
  li + li:before{
    font-size: 0.5em;
  }
  a {
    margin: 0.4em;
    font-size: 0.6em;
    color: var(--themeColor13, ${MEDIUM_GREY});
    text-decoration: none;
    &:hover, &:active, &:focus{
      text-decoration: none !important;
      cursor: default;
    }
  }
  li:last-child{
    a{
      color: var(--themeColor1)};
    }
  }
}
`;

export const TitleBox = styled.div.attrs({ className: 'caja' })`
  border: 1px solid transparent;
  box-sizing: border-box;
`;

export const Title = styled.div.attrs({ className: 'title' })`
  display: block;
  background-color: transparent;
  h1,h2,h3 {
    cursor: text;
  }
`;

export const Cab = styled.div.attrs({ className: 'cab' })`
    display: flex;
    font-size: 2em;
    padding: 1em;
    h1{
      margin: 0.1em;
      font-size: 1em;
    }
    h2{
      margin: 0.4em;
      font-size: 0.8em;
      color: var(--themeColor1, ${PRIMARY_BLUE});
    }
    h3{
      margin: 0.4em;
      font-size: 0.7em;
      color: ${ADAMS_GREY};
    }
    h4{
      margin: 0.4em;
      font-size: 0.6em;
      color: ${MEDIUM_GREY};
    }
`;

export const CabTableNumber = styled.div.attrs({ className: 'cabtabla_numero' })`
      display: ${ props => props.hide ? 'none' : 'block' };
      padding: 0.2em 0.3em;
      line-height: 1em;
      color: var(--themeColor1, ${PRIMARY_BLUE});
      font-family: 'Ubuntu', sans-serif;
`;

export const EditCourseTitle = styled(FormControl).attrs({ className: 'editCourseTitle' })`
      font-size: 1em;
      height: auto;
      border-radius: 0;
      border-color: var(--themeColor1, ${PRIMARY_BLUE});
`;

export const EditNavTitle = styled(FormControl).attrs({ className: 'editNavTitle' })`
      font-size: 0.8em;
      height: auto;
      border-radius: 0;
      border-color: var(--themeColor1, ${PRIMARY_BLUE});
`;

export const EditNavSubtitle = styled(FormControl).attrs({ className: 'editNavSubTitle' })`
       font-size: 0.6em;
       height: auto;
       border-radius: 0;
       border-color: var(--themeColor1, ${PRIMARY_BLUE});
`;

export const CVPopover = styled(Popover).attrs({ className: 'cvPopover' })`
  font-size: 12px;
  font-family: 'Ubuntu';
  border-radius: 0;
  border-left: none !important;
  border-right: none !important;
  border-top: none !important;
  border-bottom: none !important;
  outline: none;
  padding: 0;


  .popover-title {
    font-size: 13px;
    background-color: #ddd;
    color: #777;//$blueprimary;
    border: none;
    border-radius: 0;

  }
  .arrow {
    border-bottom: none;
    border-color: transparent !important;
    top: -10px !important;
  }
  .arrow:after{
    border-bottom-color: #ddd !important;
    opacity: 1;
  }
  .popover-content{
    border: none !important;
  }
`;

export const InfoIcon = styled(MatIcon)`
      cursor: help;
      font-size: 0.9em !important;
      color: #555;
      vertical-align: top;
      position: absolute;
      top: 0.7em;
      right: 0.7em;
`;

export const CVList = styled.span`
      display: block;
      font-size: 11px;
      font-family: 'Ubuntu' !important;
`;
