import Joyride from 'react-joyride';
import React from 'react';
import i18n from 'i18next';
import './_joyride.scss';
import dragdrop from './dragdrop.svg';
import { ACTIONS, EVENTS } from 'react-joyride/es/constants';

export default class EdiphyTour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: [
                { // Plugin selection
                    target: '#ribbonList',
                    content: (<div>
                        <img src={dragdrop} alt="Drag and drop" style={{ width: '100%' }}/>
                        <div className={'step_text'}>{i18n.t('joyride.drag')}</div>
                    </div>),
                    placement: 'bottom',
                    offset: 30,
                    disableBeacon: true, // The first step needs to have this so the beacon does not appear and the tour starts right away
                    tooltipOptions: { footer: null },
                    callback: (e)=>{
                        if(document.getElementById('insideribbon').classList.contains('noButtons')) {
                            document.querySelector('.navButtonPlug').click();
                            setTimeout(()=>{
                                /* let clone = document.querySelector('button[name=HotspotImages]').cloneNode(true)
                              document.body.appendChild(clone);
                              clone.classList.add('tourCloned')*/
                            }, 300);

                        }
                    },
                },
                { // Toolbar
                    target: '#tools',
                    content: (<div>
                        <i style={{ fontSize: '50px', color: '#18CFC8', margin: '23px' }} className="material-icons">border_color</i>
                        <div className={'step_text'}>{i18n.t('joyride.toolbar')}</div>
                    </div>),
                    placement: 'auto',
                    callback: ()=>{
                        if(!document.getElementById('tools').classList.contains('toolsSpread')) {
                            document.getElementById('toolbarFlap').click();
                            this.setState({ run: false });
                            setTimeout(() => {
                                if (this.refs.joyride) {
                                    this.setState({ run: true });
                                }
                            }, 400);
                        }

                    },
                },
                { // Carrousel list
                    target: '.bottomGroup',
                    content: (<div>
                        <i style={{ fontSize: '50px', color: '#18CFC8' }} className="material-icons">note_add</i>
                        <div className={'step_text'}>{i18n.t('joyride.carrousel')}</div>
                    </div>),
                    placement: 'top',
                    callback: ()=>{
                    },
                },

                { // Right-corner menu
                    target: '#topMenu',
                    content: (<div>
                        <i style={{ fontSize: '50px', color: '#18CFC8' }} className="material-icons">import_export</i>
                        <div className={'step_text'}>{i18n.t('joyride.menu')}</div></div>),
                    offset: 10,
                    placement: 'left',
                    callback: ()=>{
                        document.getElementById('dropdown-menu').click();

                    },
                },
                { // Right-corner menu
                    target: '.navbarButton_preview',
                    content: (<div>
                        <i style={{ fontSize: '50px', color: '#18CFC8' }} className="material-icons">remove_red_eye</i>
                        <div className={'step_text'}>{i18n.t('joyride.preview')}</div>
                    </div>),
                    offset: 60,
                    placement: 'left',
                    callback: ()=>{
                        // document.querySelector('.navbarButton_preview').click();

                    },
                },
                { // Right-corner menu
                    target: '.navbarButton_preview',
                    content: (<div>
                        <i style={{ fontSize: '50px', color: '#18CFC8' }} className="material-icons">info</i>
                        <div className={'step_text'}>{i18n.t('joyride.manual')} <a target="_blank" href="http://ging.github.io/ediphy/#/manual"> {i18n.t('joyride.manual2')}</a></div></div>),
                    offset: 60,
                    placement: 'left',
                    callback: ()=>{
                        // document.querySelector('.navbarButton_preview').click();

                    },
                },

            ],
            run: this.props.showTour,
            doneSteps: new Set(),
        };
    }

    componentDidMount() {
    }

    callback(tour) {
        const { action, index, type } = tour;
        if (this.refs.joyride) {
            if (index || index === 0) {
                let undone = !(this.state.doneSteps.has(index));
                if (tour.step && tour.step.callback && type === 'tooltip' && undone) {
                    let doneSteps = (new Set(this.state.doneSteps)).add(index);
                    tour.step.callback();
                    this.setState({ doneSteps });
                }
            }
            if (action === ACTIONS.CLOSE) {
                this.props.toggleTour(false);
                this.setState({ doneSteps: new Set(), stepIndex: 0 });
            }
            if (type === EVENTS.TOUR_END) {
                this.props.toggleTour(false);
                this.setState({ doneSteps: new Set(), stepIndex: 0 });
            } else if ([EVENTS.STEP_AFTER, EVENTS.CLOSE, EVENTS.TARGET_NOT_FOUND].includes(type)) {
                // Since this is a controlled tour you'll need to update the state to advance the tour
                this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });

            }
        }

    }

    render() {
        const { steps } = this.state;

        return (<div>
            <Joyride ref="joyride"
                steps={steps}
                run={this.state.run}
                controlled continuous autoStart spotlightClicks
                callback={this.callback.bind(this)}
                locale={{ back: i18n.t('joyride.back'), close: i18n.t('joyride.close'), last: i18n.t('joyride.last'), next: i18n.t('joyride.next'), skip: i18n.t('joyride.skip') }}
                styles={{
                    options: {
                        arrowColor: '#ffffff',
                        backgroundColor: '#ffffff',
                        primaryColor: '#17CFC8',
                        textColor: '#333',
                        // overlayColor: 'rgba(79, 26, 0, 0.4)',
                    },
                }}
            />

        </div>
        );
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.showTour !== nextProps.showTour) {
            this.setState({ run: nextProps.showTour });
        }
    }
}

