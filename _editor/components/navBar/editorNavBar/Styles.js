import styled from 'styled-components';
import { Col, Dropdown, Row } from "react-bootstrap";
import {
    DARKEST_GREY,
    GREY, GREY_PANEL_HEADINGS, LIGHT_GREY,
    LIGHTEST_GREY, MatIcon,
    MEDIUM_BLUE,
    PRIMARY_BLUE,
    PRIMARY_BLUE_DARK,
} from "../../../../sass/general/constants";

export const IconBar = styled(Col).attrs({ id: 'iconBar' })`
  z-index: 9999;
  display: flex;
  justify-content: space-between;
  #dropdown-menu {
    width: 70px;
    height:100%;
  }
`;

export const Gradient = styled.div`
  height: 60px;
  width: 10px;
  float: left;
  background: linear-gradient(141deg, ${PRIMARY_BLUE_DARK} 0%, ${MEDIUM_BLUE} 51%, ${PRIMARY_BLUE} 75%);
  color: white;
  opacity: 0.95;
`;

export const Logo = styled.div.attrs({ id: 'logo' })`
  width: 202px;
  padding: 10px;
  font-size: 1.8em;
  color: ${GREY};
`;

export const ED = styled.span.attrs({ children: ['ED'] })`
    font-weight: bold;
    color: #14b6b0;
`;

export const NavButtons = styled.div.attrs({ className: 'navButtons' })`
  margin-left: auto;
  button[disabled] {
    border: none;
    color: #ccc;
    box-shadow: none;
    cursor: not-allowed;
}
`;

export const ToggleButton = styled.div`
display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  
`;

export const NavButton = styled.button`
  display: inline-grid;
  border: none;
  border-radius: 0px;
  min-width: 56px;
  font-size: 20px;
  height: 60px;
  padding: 0 8px;
  background: transparent; 
  box-shadow: none;
  vertical-align: middle;
  align-items: center;
  cursor: pointer;
  &:active {
    border-bottom: 0px solid ${LIGHT_GREY};
    color: white;
    background: ${LIGHTEST_GREY};
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
  }
  &:hover {
    color: ${DARKEST_GREY};
    
  }
  .material-icons{
    font-size: 22px;
  }
  @media screen and (max-width: 800px) {
    min-width: 20px;
    max-width: 35px;
  }
  &.navBarButton_publish,&.navBarButton_unpublish{
      height: 54px;
      margin: 3px 0;
      background-color: ${PRIMARY_BLUE};
      border-radius: 3px;
      color: darkcyan;
  }
`;

export const Description = styled.span.attrs({ className: 'hideonresize' })`
    align-self: start;
    font-size: 12px;
    vertical-align: middle;
    margin: 5px auto 0;
`;

export const DropdownButton = styled.button`
  display: inline-block;
  text-align: left;
  border: none;
  border-radius: 0px;
  width: 100%;
  height: auto;
  font-size: 12px;
  padding: 7px 16px;
  cursor: pointer;
  color: ${LIGHT_GREY};
  &:hover {
    color: white;
  }
  background-color: transparent;
  box-shadow: none;
  vertical-align: middle;
  .material-icons {
    font-size: 15px;
    vertical-align: text-bottom;
    margin-right: 5px;
  }
`;

export const PluginButton = styled(NavButton).attrs({ className: 'navButtonPlug' })`
  cursor: default;
  height: 60px;
  color: white;
  width: auto;
  min-width: 80px;
  font-weight: 400;
  line-height: 1em;
  .material-icons {
    vertical-align: middle;
    align-self: center;
  }
  &.active, &.active:hover {
    background-color: ${PRIMARY_BLUE} !important;
    color: ${DARKEST_GREY};
    font-weight: 600;
  }
  &:hover {
    background-color: ${GREY_PANEL_HEADINGS};
    color: white;
  }
`;

export const PluginsMenus = styled.div.attrs({ className: 'pluginsMenu' })`
  width: 40%;
  background-color: ${DARKEST_GREY};
`;

export const PluginIcon = styled(MatIcon)`
    font-size: 1.1em !important;
    display: none !important;
    @media screen and (max-width: 1147px){
        display: block !important;
    }
`;

export const PluginName = styled.span`
    align-self: center;
    font-size: 12px;
    margin: 5px auto 0;
    @media screen and (max-width: 1147px){
        display: none;
    }
`;

export const NavBar = styled(Row).attrs({ className: 'navBar' })`
  background-color: ${LIGHTEST_GREY};
  height: 60px;
  z-index: 9999999 !important;
  .hideonresize {
    font-size: 12px;
  }
  #topMenu::after {
    content: "";
    border: 8px solid transparent;
    border-bottom-color: $darkest;
    position: absolute;
    margin-top: -16px;
    right: 24px;
    top: 0%;
  }
  @media screen and (max-width: 1147px) {
  .hideonresize {
    display: none;
  }
  .pluginsMenu {
    width:35%;
    .navButtonPlug {
      min-width: 50px;
    width: auto;
    padding: 4px;
    .active {
      color: white !important;
    }
   } 
  }
  ${NavButton} {
    min-width: 50px;
    max-width: 50px;
    .material-icons {
      align-self: center;
    }
  }
  }
  
  button[disabled].navButton {
    border: none;
    color: #ccc;
    box-shadow: none;
    cursor: not-allowed;
  }
  
  @media screen and (max-width: 800px) {
    ${PluginsMenus} {
          width: 30%;
      ${PluginButton} {
        min-width: 20%;
        max-width:20%;
        width: auto;
        .active {
          color: white !important;
        }
      }
    }
  }
`;

export const EDDropDown = styled(Dropdown)`
    float: right;
    .navButton{
    display: inline-grid;
    border: none;
    border-radius: 0px;
    min-width: 56px;
    font-size: 20px;
    height: 60px;
    padding: 0 8px;
    background: transparent; 
    box-shadow: none;
    vertical-align: middle;
    align-items: center;
    cursor: pointer;
    &:active {
      border-bottom: 0px solid ${LIGHT_GREY};
      color: white;
      background: ${LIGHTEST_GREY};
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
    }
    &:hover {
      color: ${DARKEST_GREY};
    }
    @media screen and (max-width: 800px) {
      min-width: 20px;
      max-width: 35px;
    }
}
`;
