import styled from 'styled-components';
import { PRIMARY_BLUE } from "../../../../sass/general/constants";

export const GridConfiguratorContainer = styled.div.attrs({ className: 'gridConfiguratorContainer' })`
width: 100%;
.gridconficons {
  height: auto;
  width: auto;
  font-size: 14px !important;
  border-radius: 0px;
}
.gc_addon {
  border-radius: 0px;
  border: 0;
  background-color: white;
  cursor: pointer;
}
.configurator {
  width: 100%;
  height: 100px;
  background-color: grey;
  word-wrap: none;
  overflow: hidden;
  border: 1px solid white;
}
.gc_columns {
  display: inline-block;
  height: 100%;
}
.gc_rows {
  border: 2px solid white;
  width: 100%;
  background-color: ${PRIMARY_BLUE};
}
.sortableToolbarTitle {
  font-size: 1em;
  font-weight: bold;
  color: #aaa;
  padding: 0px;
}
`;
