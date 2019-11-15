import styled from 'styled-components';
import { PRIMARY_BLUE } from "../../../../sass/general/constants";

export const ItemsContainer = styled.div.attrs({ className: 'itemsContainer' })`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  .template2_item{
    padding: 0.5em;
    font-size: 2em;
    .custom_color{
      color: var(--themeColor7);
    }
  }
  .bulleted_list{
    font-size: 1.6em;
    line-height: 1.6em;
  }
`;

export const TemplateItem = styled.div`
  position: relative;
  width: 120px;
  height: 80px;
  border: ${props => props.selected ? 'solid #17CFC8 3px' : 'solid #eee 1px'};
  background-color: ${props => props.backgroundColor ?? 'white'};
  margin: 0.5em;
  border-radius: 0.25em;
  &:hover{
    transform: scale(1.05);
    transition: all 0.2s ease-in;
  }

`;

export const TemplateName = styled.div`
    position: absolute;
    bottom: -0.25em;
    width: 100%;
    background: ${PRIMARY_BLUE};
    padding: 0.2em 0.4em;
    text-transform: uppercase;
    font-size: smaller;
    font-weight: bold;
    color: white;
    display: ${props => props.selected ? 'block' : 'none' };
`;
