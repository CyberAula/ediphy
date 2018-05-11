import Joyride from 'react-joyride';
import React from 'react';
import i18n from 'i18next';
import './_joyride.scss';
import wand from './wand.svg';
import dnd from './dnd.svg';
export default class EdiphyTour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            run: false,
            steps: [
                { // PLugin top bar
                    target: '#iconBar',
                    content: (<div>
                        {i18n.t('joyride.welcome')}<strong>Ediphy</strong>!
                        <img src={wand} alt="" style={{ width: '100px', float: 'left', margin: '-10px' }}/>
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
                        <i style={{ fontSize: '50px', color: '#18CFC8', float: 'left' }} className="material-icons">border_color</i>
                        <span>{i18n.t('joyride.toolbar')}</span>
                    </div>),
                    placement: 'auto',
                    callback: ()=>{
                        if(!document.getElementById('tools').classList.contains('toolsSpread')) {
                            document.getElementById('toolbarFlap').click();
                            this.setState({ run: false });
                            setTimeout(()=>{
                                this.setState({ run: true });
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
        this.setState({ run: true });
    }

    render() {
        const { steps, run } = this.state;
        let callback = (tour) => {
            const { step, type, index } = tour;
            if (index || index === 0) {
                let undone = !(this.state.doneSteps.has(index));
                if (step && step.callback && type === 'tooltip' && undone) {
                    let doneSteps = (new Set(this.state.doneSteps)).add(index);
                    step.callback();
                    this.setState({ doneSteps });
                }

            }

        };

        return (
            <Joyride
                steps={steps}
                run={run}
                // showProgress
                continuous
                callback={callback}
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

