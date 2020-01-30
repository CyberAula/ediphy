import styled from "styled-components";
import { LIGHT_GREY } from '../../../../sass/general/constants';
import { animation } from '../../../../sass/general/mixins/Mixins';

export const CarouselListTitle = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    color: ${LIGHT_GREY};
    padding: 2px;
    * {
        ${animation("all", "0.2s")};
    }
    &:hover {
        color: #fff !important;
    }
    .btnToggleCarousel, .btnFullCarousel {
        height: 36px;
        width: 36px;
        cursor: pointer;
        color: white;
        background-color: transparent;
        border: none;
        &:hover {
           transform: scale(1.2);
        }
    }
`;

export const CarouselTitleContainer = styled.div`
  height: 100%;
  display: ${props => props.show ? 'block' : 'none'};
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1em;
  vertical-align: middle;
  .editIndexTitleIcon {
    font-size: 1em !important;
    margin: 0;
    padding: 4px 16px;
  }
  .actualSectionTitle{
    margin: 10px;
  }
`;

