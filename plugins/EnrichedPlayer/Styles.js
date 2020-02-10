import styled from 'styled-components';
import { CustomRange } from "../../sass/general/mixins/Mixins";

export const BLUE_PRIMARY = '#17cfc8';

export const PlayerPlugin = styled(CustomRange)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  cursor: default;
  iframe{
    margin-bottom: -0.25em;
  }

  &:hover {
    .visorControls {
      opacity:1;
    }
  }
`;

export const MediaControls = styled.div`
    position: absolute;
    background: #222;
    bottom: 0;
    width: 100%;
    padding: 0.3em;
    margin: 0;
    display: flex;
    align-content: center;
    align-items: center;
    @include gradient;
    height: 2.5em;
    opacity: 0.7;
    transition: opacity .3s;
    pointer-events: all;
    &:hover{
      opacity: 1;
    }

`;

export const VisorControls = styled(MediaControls)`
    opacity: 0;
    -webkit-transition: opacity .3s;
    -moz-transition: opacity .3s;
    -o-transition: opacity .3s;
    -ms-transition: opacity .3s;
    transition: opacity .3s;
`;

export const PlayerButton = styled.button`
    border: 0;
    color: white;
    &:hover{
      cursor: pointer;
      color: white;
      background-color: ${BLUE_PRIMARY};
    }
`;

export const Play = styled(PlayerButton)`
    background-color: transparent;
    float:left;
    height:100%;
    width:10%;
    .material-icons {
      font-size: 2em;
    }
`;

export const Progress = styled.div.attrs({ className: 'progress-player-input dropableRichZone' })`
    position: relative;
    //bottom: 0.3em;
    background: transparent;
    float:left;
    -webkit-appearance: none;
    margin: 0.7em 2.5%;
    height: 0.65em;
    flex:1;
`;

export const FakeProgress = styled.div.attrs({ className: "fakeProgress" })`
      border: 1px solid #ccc;
      margin: 0.2em;
      position: absolute;
      width: 100%;
      z-index: ${props => props.visor ? '0' : undefined};
      top: 0;
`;

export const FullScreen = styled(PlayerButton)`
      background-color: transparent;
      float:right;
      height:100%;
      width:10%;
      .material-icons {
        font-size: 2em;
      }
`;

export const Duration = styled.div`
      color:white;
      font-size: 0.8em;
      line-height: 1.8;
      padding: 0 0.3em;
`;

export const Volume = styled.input.attrs({ type: 'range', min: '0', max: '1', step: 'any' })`
    background-color: transparent;
    width: 15% !important;
`;

export const MainSlider = styled.div.attrs({ className: 'mainSlider' })`
      width: 0.3em;
      height: 0.8em;
      background: white;
      position: absolute;
      margin-top: -0.1em;
      z-index: 9999;
      //top: 0.3em;
`;

export const VideoMark = styled.div`
    width: 0.75em;
    top: -0.1em;
    height: 0.75em;
    border-radius: 1.4em;
    border: 0.1em solid white;
    position: relative;
    a.mapMarker {
     // left:-0.5em;
      top: -1.9em;
      left: -0.7em;
      width: 1.9em;
      height: 1.9em;
      text-align: center;
    }
    &:hover{
        transform: scale(1.2);
    }
`;
