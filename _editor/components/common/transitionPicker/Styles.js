import styled from 'styled-components';
import { PRIMARY_BLUE } from "../../../../sass/general/constants";

export const TransitionPickerContainer = styled.div`
  box-sizing: border-box;
  height: 150px;
  width: 100%;
  max-width: 400px;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  .transition_template {
    width: 90px;
    height: 60px;
    border-radius: 0px;
    color: grey;
    background-color: #ececec;
    display: flex;
    flex-direction: column;
    padding-top: 5px;
    align-items: center;
    justify-content: center;
    &:hover{
      cursor: pointer;
      transform: scale(1.1);
      transition: all 0.2s ease-in;
    }
    img{
      flex: 3;
    }

    .view_name{
      flex: 1;
      color: white;
      margin-top: 5px;
      font-size: 12px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #999999;
    }
  }

  .active {
    border: 3px solid ${PRIMARY_BLUE};
    box-sizing: border-box;
    .view_name{
      background-color: ${PRIMARY_BLUE};
      margin-bottom: -3px;
    }
  }
`;
