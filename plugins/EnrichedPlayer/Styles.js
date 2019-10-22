import styled from 'styled-components';

export const BLUE_PRIMARY = '#17cfc8';

export const PlayerPlugin = styled.div`
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  cursor: default;
  iframe{
    margin-bottom: -0.25em;
  }

  &:hover {
    .visorControls {
      opacity:1;
    }
  }
  input[type=range] {
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 10%;
    margin: 0.55em 2.5%;
    height: 0.7777em;
  }

  input[type=range]:focus {
    outline: none;
  }
  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 0.2em;
    cursor: pointer;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
    background: rgba(0, 0, 0, 0.52);
    border-radius: 0px;
    border: 0px solid rgba(0, 0, 0, 0);
  }
  input[type=range]::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
    border: 0.1em solid rgba(0, 0, 0, 0);
    height: 0.9em;
    width: 0.9em;
    border-radius: 0.75em;
    background: #ccffff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -0.4em;
  }
  input[type=range]:focus::-webkit-slider-runnable-track {
    background: rgba(89, 89, 89, 0.52);
  }
  input[type=range]::-moz-range-track {
    width: 100%;
    height: 0.2em;
    cursor: pointer;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
    background: rgba(0, 0, 0, 0.52);
    border-radius: 0px;
    border: 0px solid rgba(0, 0, 0, 0);
  }
  input[type=range]::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
    border: 1px solid rgba(0, 0, 0, 0);
    height: 0.9em;
    width: 0.9em;
    border-radius: 0.75em;
    background: #ccffff;
    cursor: pointer;
  }
  input[type=range]::-ms-track {
    width: 100%;
    height: 0.2em;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type=range]::-ms-fill-lower {
    background: rgba(0, 0, 0, 0.52);
    border: 0px solid rgba(0, 0, 0, 0);
    border-radius: 0px;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  }
  input[type=range]::-ms-fill-upper {
    background: rgba(0, 0, 0, 0.52);
    border: 0px solid rgba(0, 0, 0, 0);
    border-radius: 0px;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  }
  input[type=range]::-ms-thumb {
    box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
    border: 1px solid rgba(0, 0, 0, 0);
    height: 0.9em;
    width: 0.9em;
    border-radius: 0.75em;
    background: #ccffff;
    cursor: pointer;
    height: 0.2em;
  }
  input[type=range]:focus::-ms-fill-lower {
    background: rgba(0, 0, 0, 0.82);
  }
  input[type=range]:focus::-ms-fill-upper {
    background: rgba(89, 89, 89, 0.82);
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
    @include gradient;
    height: 2.5em;
    opacity: 0.7;
    -webkit-transition: opacity .3s;
    -moz-transition: opacity .3s;
    -o-transition: opacity .3s;
    -ms-transition: opacity .3s;
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
    height: 1.7em;
    position: relative;
    bottom: 0.3em;
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
      top: ${props => props.visor ? '0' : '0.3em'};
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
    float:left;
`;

export const MainSlider = styled.div.attrs({ className: 'mainSlider' })`
      width: 0.3em;
      height: 0.8em;
      background: white;
      position: absolute;
      margin-top: -0.1em;
      z-index: 9999;
      top: 0.3em;
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
