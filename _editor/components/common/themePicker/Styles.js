import styled from 'styled-components';

export const ThemePickerContainer = styled.div.attrs({ className: 'themePicker' })`
    width: 100%;
    .owl-nav{
      display: flex;
      flex-direction: row;
      button{
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
`;
