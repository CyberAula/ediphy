import Joyride from 'react-joyride';
import React from 'react';

export default class EdiphyTour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            run: false,
            steps: [
                { // PLugin top bar
                    target: '#iconBar',
                    content: 'Plugin Categories',
                    placement: 'bottom',
                    callback: (e)=>{
                    },
                },
                { // PLugin selection
                    target: '#ribbonList',
                    content: 'Plugins',
                    placement: 'bottom',
                    offset: 30,
                    callback: (e)=>{
                        document.querySelector('.navButtonPlug').click();
                    },
                },
                { // Carrousel list
                    target: '#pa-1497983247795',
                    content: 'Índice',
                    placement: 'right',
                    callback: ()=>{
                    },
                },
                { // Toolbar
                    target: '#wheel',
                    content: 'Toolbar',
                    placement: 'auto',
                    callback: ()=>{
                        document.getElementById('toolbarFlap').click();
                        this.setState({ run: false });
                        setTimeout(()=>{
                            this.setState({ run: true });
                        }, 500);

                    },
                },
                { // Right-corner menu
                    target: '#topMenu',
                    content: 'Menu',
                    offset: 80,
                    placement: 'left',
                    callback: ()=>{
                        document.getElementById('dropdown-menu').click();

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
                locale={{ back: 'Back', close: 'Close', last: 'Last', next: 'Next', skip: 'Skip' }}
                styles={{
                    options: {
                        arrowColor: '#ffffff',
                        backgroundColor: '#ffffff',
                        primaryColor: '#17CFC8',
                        textColor: '#004a14',
                        // overlayColor: 'rgba(79, 26, 0, 0.4)',
                    },
                }}
            />
        );
    }
}

