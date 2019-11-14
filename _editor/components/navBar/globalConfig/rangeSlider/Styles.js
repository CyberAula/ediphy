import styled from 'styled-components';
import { ConfigRange } from "../Styles";

export const RangeInputContainer = styled.div`
    input[type=range]{
        pointer-events: none;
        position: absolute;
        overflow: hidden;
        left: 0;
        width: 100%;
        outline: none;
        height: 18px;
        margin: 0;
        padding: 0;
        appearance: none;
        background-color: transparent;
    }
    ${ConfigRange}
}
`;

