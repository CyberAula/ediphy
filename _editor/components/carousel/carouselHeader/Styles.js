import styled from 'styled-components';

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

