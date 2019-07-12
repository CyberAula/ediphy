import Joyride, { ACTIONS, EVENTS } from 'react-joyride';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from 'i18next';
import './_joyride.scss';
import dragdrop from './dragdrop.svg';
import edit from './edit.svg';
import indexImg from './index.svg';
import canvas from './canvas.svg';
import add from './add.svg';
import importExport from './exportImport.svg';
import preview from './preview.svg';
import help from './help.svg';

export default class EdiphyTour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: [
                { // Canvas
                    target: '#canvas',
                    content: (<div>
                        <img src={canvas} alt="" style={{ width: '100%' }}/>
                        <div className={'step_text'}>{i18n.t('joyride.canvas')}</div>
                    </div>),
                    placement: 'bottom',
                    offset: 30,
                    disableBeacon: true, // The first step needs to have this so the beacon does not appear and the tour starts right away
                    tooltipOptions: { footer: null },
                    callback: ()=>{
                    },
                },
                { // Plugin selection
                    target: '#ribbonList',
                    content: (<div>
                        <img src={dragdrop} alt="" style={{ width: '100%' }}/>
                        <div className={'step_text'}>{i18n.t('joyride.drag')}</div>
                    </div>),
                    placement: 'bottom',
                    offset: 30,
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
                        <img src={edit} alt="" style={{ width: '100%' }}/>
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
                { // Index
                    target: "#colLeft",
                    content: (<div>
                        <img src={indexImg} alt="" style={{ width: '100%' }}/>
                        <div className={'step_text'}>{i18n.t('joyride.index')}</div>
                    </div>),
                    placement: 'auto',
                    callback: ()=>{
                        document.getElementById('toolbarFlap').click();
                    },
                },
                { // Add buttons - Carrousel list
                    target: '#addbuttons',
                    content: (<div>
                        <img src={add} alt="" style={{ width: '100%' }}/>
                        <div className={'step_text'}>{i18n.t('joyride.carrousel')}</div>
                    </div>),
                    placement: 'auto',
                    callback: ()=>{
                    },
                },

                { // Right-corner menu - importExport
                    target: '#topMenu',
                    content: (<div>
                        <img src={importExport} alt="" style={{ width: '100%' }}/>
                        <div className={'step_text'}>{i18n.t('joyride.menu')}</div></div>),
                    offset: 10,
                    placement: 'auto',
                    callback: ()=>{
                        document.getElementById('dropdown-menu').click();

                    },
                },
                { // Right-corner menu - preview
                    target: '.navbarButton_preview',
                    content: (<div>
                        <img src={preview} alt="" style={{ width: '100%' }}/>
                        <div className={'step_text'}>{i18n.t('joyride.preview')}</div>
                    </div>),
                    // offset: 60,
                    placement: 'bottom',
                    callback: ()=>{
                        // document.querySelector('.navbarButton_preview').click();

                    },
                },
                { // Right-corner menu - help
                    target: '#topMenu',
                    content: (<div>
                        <img src={help} alt="" style={{ width: '100%' }}/>
                        <div className={'step_text'}>{i18n.t('joyride.manual')} <a target="_blank" href="http://ging.github.io/ediphy/#/manual"> {i18n.t('joyride.manual2')}</a></div></div>),
                    // offset: 60,
                    placement: 'auto',
                    callback: ()=>{
                        document.getElementById('dropdown-menu').click();
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
                if (tour.step && tour.step.callback && type === 'tooltip' /* && undone*/) {
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

        return this.props.showTour ? (<div>
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
        ) : null;
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.showTour !== nextProps.showTour) {
            this.setState({ run: nextProps.showTour });
        }
    }
}

EdiphyTour.propTypes = {
    /**
     * Whether the joyride is shown or not
     */
    showTour: PropTypes.bool,
    /**
     * Opens/closes the joyride
     */
    toggleTour: PropTypes.func.isRequired,
};
