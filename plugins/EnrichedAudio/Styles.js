import styled from 'styled-components';
import { CustomRange } from "../../sass/general/mixins/Mixins";

export const AudioPlugin = styled(CustomRange).attrs({ className: 'basic-audio-wrapper' })`
  overflow: hidden;
  cursor:default;

  iframe{
    margin-bottom: -0.3em;
  }

  button {
    border: 0;
    color: white;
    @include transition;
    &:hover{
      cursor: pointer;
      color: white;
      background-color: transparent;
    }
  }

  .ex{
    background: transparent;
    float:left;
    -webkit-appearance: none;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 3;
  }

  &:hover {
    .visorControls {
      opacity:0.7;
      &:hover {
        opacity: 1;
      }
    }
  }
`;

export const WaveContainer = styled.div.attrs({ className: 'wavecontainer' })`
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
`;

export const Wave = styled.div.attrs({ className: 'wave' })`
    position: absolute;
    width: 100%;
    height: 100%;
    float:left;
    z-index: 1;
    display: block;
    >wave {
        height: 100% !important;
    }
`;

export const Progress = styled.div.attrs({
    className: 'progress-audio-input dropableRichZone' })`
    background: transparent;
    float:left;
    -webkit-appearance: none;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 3;
`;

export const WaveSurferContainer = styled.div.attrs({ className: 'react-wavesurfer' })`
    position: absolute;
    width: 100%;
    float:left;
    height: 100%;
    z-index: 1;
    >div {
      height: 100%;
      >div {
        height: 100%;
        wave {
          height: 100% !important;
        }
      }
    }
`;

export const Duration = styled.div.attrs({ className: 'durationField' })`
    line-height: 3em;
    color: white;
    font-size: 0.8em;
`;

export const Controls = styled.div.attrs({ className: 'audio-controls' })`
    position: absolute;
    z-index: 5;
    bottom: 0px;
    width: 100%;
    height: 2.5em;
    opacity: 0.7;
    background: #222;
    display: flex;
    pointer-events: all;
    &:hover{
      opacity: 1;
    }
`;

export const VisorControls = styled(Controls)`
    opacity: 0;
    transition: opacity .3s;
    pointer-events: auto;
`;

export const Play = styled.button.attrs({ className: 'play-audio-button' })`
    border: none;
    background-color: transparent;
    float:left;
    height: 100%;
    width: 3em;
    margin: 0.3em;
    margin-top: 0.25em;
    padding: 0.4em;
    font-size: 0.8em;
    line-height: 1.3em;
    text-transform: uppercase;
    z-index: 9999;
     .material-icons {
        color: white;
        font-size: 2em;
        margin-top: -0.2em;
      }
`;

export const Volume = styled.input.attrs({
    className: 'volume-audio-input', type: 'range',
    min: 0, max: 1, step: 'any' })`
    width: 25% !important;
    max-width: 120px;
    position: absolute;
    top: 20%;
    right: 10px;
    float: right;
    background-color: transparent;
`;

export const MarkBar = styled.div.attrs({ className: 'markBar' })`
    border-top: 0.2em solid white;
    top:50%;
    height: 0.4em;
    width: 100%;
    z-index: 9999;
    position:absolute;
`;

export const AudioMark = styled.div.attrs({ className: 'audioMark' })`
    a.mapMarker {
      top: -1.9em;
      left: -0.7em;
      width: 1.9em;
      height: 1.9em;
      text-align: center;
    }
    width: 0.75em;
    height: 0.75em;
    top: -0.55em;
    border-radius: 1.4em;
    border: 0.1em solid white;
    position: relative;
    &:hover{
      transform: scale(1.2);
    }
`;
