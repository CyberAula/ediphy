import styled from 'styled-components';

export const PDFViewerPlugin = styled.div`
    width: 100%;
    height: 100%;
`;

export const TopBar = styled.div`
    height:  0px;
    display: flex;
    overflow: hidden;
    position: absolute;
    text-align: center;
    top: 0;
    user-select: none;
    left: 0;
    z-index: 9999;
    width: 100%;
    background: #333;
    -webkit-transition: height 0.3s; /* Safari */
    transition: height 0.3s;
    justify-content: ${props => props.visor ? 'space-between' : 'center'};
    &:hover {
        height: 3.7em;
    }
`;

export const PDFContainer = styled.div`
    width: 100%;
    height: 100%;
    &:hover ${TopBar} {
        height: 3.7em;
    }
`;

export const PDFButton = styled.button`
        background-color: transparent;
        border: none !important;
        width: 2.5em;
        height: 3.7em;
        color: white;
        i {
          font-size: 2em;
        }
`;

export const ScaleButton = styled(PDFButton)`
    &:disabled {
      color: grey !important;
    }
`;

export const RotateL = styled(PDFButton)`
    float: left;
    margin-left: 3%;
`;

export const RotateR = styled(PDFButton)`
    float: left;
    margin-left: 2%;
`;

export const FullScreen = styled(PDFButton)`
    position: absolute;
    right: 0;
`;

export const ButtonsContainer = styled.div`
    flex: 1;
`;

export const PageNumber = styled.span`
    color: white;
    font-size: 1.1em;
    height: 3em;
    vertical-align: top;
    line-height: 3.1em;
`;
