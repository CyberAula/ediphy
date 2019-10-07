import styled, { keyframes } from 'styled-components';

import imagePlay from "./../../dist/images/play.svg";
import imagePause from "./../../dist/images/pause.svg";

export const Container = styled.div`
            width: 100%;
            height: 100%;
        `;

export const ColorBackground = styled.div`
            width: 100%;
            height: 100%;
            pointer-events: initial;
            visibility: ${props => props.useImage ? "hidden" : "visible"};
            background-color: var(--themeColor1);
        `;

export const BasicImage = styled.img`
            visibility: ${props => props.useImage ? "visible" : "hidden"};
            &.basicImageClass{
              width: 100%;
                height: 100%;
                position: absolute;
            }
        `;

export const PlayButton = styled.img.attrs({
    src: props => props.playing ? imagePause : imagePlay,
}
)`
            height: 45%;
            position: absolute;
            left: 0;
            right: 0;
            top: ${props => props.hideAnimation ? '0' : '10%' };
            bottom: ${props => props.hideAnimation ? '0' : undefined };
            margin: auto;
            transition: transform .1s;
        `;

export const DraggableImage = styled.div`
            width: 100%;
            height: 100%;
            pointer-events: initial;
            border: none;
            &:hover ${PlayButton} {
                transform-origin: center;
                transform: scale(1.05, 1.05);
            }
            &:hover ${ColorBackground} {
                filter: brightness(80%);
            }
            &:hover ${BasicImage} {
                filter: brightness(80%);
            }
        `;

export const Loader = styled.div`
            height: 30%;
            position: absolute;
            display: block;
            bottom: 10%;
            width: 100%;
        `;

const sound = keyframes`
            0% {
               opacity: .35;
               height: 5%;
               }
            100% {
               opacity: 1;
               height: 50%;
               }
        `;

export const Bar = styled.div`
            background: rgba(255, 255, 255, 0.91);
            ${props => props.up ? 'bottom' : 'top'}: 50%;
            height: 3px;
            position: absolute;
            width: 4%;
            animation: ${sound} 0ms -800ms linear infinite alternate;
            animation-play-state: ${props => props.animationState};
            left: ${props => props.offset}%;
            animation-duration: ${props => props.time}ms;
        `;
