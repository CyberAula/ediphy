import styled from 'styled-components';

export const MarkListBox = styled.div.attrs({ className: 'markListBox' })`
    cursor: default;
    padding: 5px;
    line-height: 1em;
    .marklist{
        font-size: 16px;
        margin-right: 5px;
        color:rgb(204,204,204);
        cursor: pointer;
    }
    .main {
        color: #222;
        cursor: help;
    }
    .markNameInToolbarContainer{
        display: inline-block;
        width: 85px !important;
        overflow: hidden;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .markNameInToolbar {
        text-overflow: ellipsis;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        left: 0%;
        width: 100%;
        color:rgb(204,204,204);
        -webkit-transition-timing-function: linear; /* Safari and Chrome */
        transition-timing-function: linear;
        line-height: 1.2em;
    }
`;
