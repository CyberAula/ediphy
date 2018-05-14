import Joyride from 'react-joyride';
import React from 'react';
import i18n from 'i18next';
import './_joyride.scss';
import star from './rainbow.svg';
import dnd from './dnd.svg';
import { ACTIONS, EVENTS } from 'react-joyride/es/constants';

export default class EdiphyTour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: [
                { // PLugin top bar
                    target: '#iconBar',
                    content: (<div>
                        {i18n.t('joyride.welcome')}<strong>Ediphy</strong>!
                        <img src={star} alt="" style={{ width: '80px', float: 'right' }}/>
                        <br/>
                        {i18n.t('joyride.why')}
                    </div>),
                    placement: 'bottom',
                    callback: (e)=>{
                    },
                },
                { // Plugin selection
                    target: '#ribbonList',
                    content: (<div>
                        {i18n.t('joyride.drag')}
                        <img src={dnd} alt="" style={{ width: '60px', float: 'left', margin: '10px' }}/>
                    </div>),
                    placement: 'bottom',
                    offset: 30,
                    callback: (e)=>{
                        if(document.getElementById('insideribbon').classList.contains('noButtons')) {
                            document.querySelector('.navButtonPlug').click();
                        }
                    },
                },
                { // Carrousel list
                    target: '#pa-1497983247795',
                    content: (<div>
                        <i style={{ fontSize: '50px', color: '#18CFC8', float: 'left' }} className="material-icons">note_add</i>
                        <span>{i18n.t('joyride.carrousel')}</span>
                    </div>),
                    placement: 'right',
                    callback: ()=>{
                    },
                },
                { // Toolbar
                    target: '#tools',
                    content: (<div>
                        <i style={{ fontSize: '50px', color: '#18CFC8', float: 'left', margin: '23px' }} className="material-icons">border_color</i>
                        <span>{i18n.t('joyride.toolbar')}</span>
                    </div>),
                    placement: 'auto',
                    callback: ()=>{
                        if(!document.getElementById('tools').classList.contains('toolsSpread')) {
                            document.getElementById('toolbarFlap').click();
                            this.props.toggleTour(false);
                            setTimeout(() => {
                                this.props.toggleTour(true);
                            }, 500);
                        }

                    },
                },
                { // Right-corner menu
                    target: '#topMenu',
                    content: (<div>
                        <i style={{ fontSize: '50px', color: '#18CFC8', float: 'left' }} className="material-icons">import_export</i>
                        <span>{i18n.t('joyride.menu')}</span></div>),
                    offset: 60,
                    placement: 'left',
                    callback: ()=>{
                        document.getElementById('dropdown-menu').click();

                    },
                },
                { // Right-corner menu
                    target: '.navbarButton_preview',
                    content: (<div>
                        <i style={{ fontSize: '50px', color: '#18CFC8', float: 'left' }} className="material-icons">remove_red_eye</i>
                        <span>{i18n.t('joyride.preview')}</span></div>),
                    offset: 60,
                    placement: 'left',
                    callback: ()=>{
                        // document.querySelector('.navbarButton_preview').click();

                    },
                },

            ],
            doneSteps: new Set(),
        };
    }

    componentDidMount() {
    }

    callback(tour) {
        console.log(tour);
        const { action, index, type } = tour;
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
            // Update user preferences with completed tour flag
        }/* else if (type === EVENTS.STEP_AFTER ) {
      // pause the tour, load a new route and start it again once is done.
      this.setState({ run: false });
    }*/
        else if ([EVENTS.STEP_AFTER, EVENTS.CLOSE, EVENTS.TARGET_NOT_FOUND].includes(type)) {
            // Sunce this is a controlled tour you'll need to update the state to advance the tour
            this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });

        }
    }

    render() {
        const { steps } = this.state;

        return (
            <Joyride
                steps={steps}
                run={this.props.showTour}
                continuous
                tooltipOptions={{ callback: (a)=>{console.log(a);} }}
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
        );
    }
}

