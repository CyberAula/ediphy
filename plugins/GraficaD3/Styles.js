import styled from 'styled-components';

export const ChartContainer = styled.div`
height: 100%;
width: 100%;
.recharts-default-tooltip{
  border-radius: 0.3em;
  text-align: left;
  border: 0 !important;
  box-shadow: 1px 1px 5px #888;
  p{
    font-weight: bold;
  }
  .recharts-tooltip-item-list{
    margin: 0;
    padding: 0;
    .recharts-tooltip-item{
      margin: 0;
      padding: 0;
      .recharts-tooltip-item-name,.recharts-tooltip-item-separator{
        color: #888;
      }
      .recharts-tooltip-item-value{
        font-weight: bold;
      }
    }
  }
}
`;
