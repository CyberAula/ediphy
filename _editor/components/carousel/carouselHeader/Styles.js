import styled from "styled-components";
import { LIGHT_GREY } from '../../../../sass/general/constants';

export const CarouselListTitle = styled.div`
cursor: pointer;
    color: ${LIGHT_GREY};
    * {
        @include animacion(all, 0.2s);
    }
    &:hover {
        color: #fff !important;
    }
    .material-icons {
        padding: 10px;
        &:hover{@include scale(1.2);}
    }
    .btnToggleCarousel, .btnFullCarousel {
        cursor: pointer;
        color: white;
        background-color: transparent;
        border: none;
        &:hover {
            @include scale(1.2);
        }
    }
    .btnFullCarousel {
        right: 0;
    }
`
    ;

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

