import React, {Component} from 'react';

export default class DaliBoxSortable extends Component {
    render() {
        return (
            <div style={{width: '100%', height: '100%', backgroundColor: 'rgba(128, 128, 128, 0.7)',
            position: 'absolute', top: 0, left: 0,
            visibility: (this.props.visibility ? 'visible' : 'hidden')}}>
                <div style={{width: '80%', height: '80%', margin: '80px auto auto auto', backgroundColor: 'white'}}>
                    <div style={{position: 'absolute', width: '16%', height: '100%', padding: 10}}>
                            <button style={{width: '100%'}}>Text</button>
                            <button style={{width: '100%'}}>Images</button>
                            <button style={{width: '100%'}}>Multimedia</button>
                            <button style={{width: '100%'}}>Animations</button>
                            <button style={{width: '100%'}}>Exercises</button>
                    </div>
                    <div style={{position: 'absolute', left: '30%', backgroundColor: 'lightgray'}}>
                        <button style={{width: 80, height: 80}} onClick={e => this.props.onBoxAdded('normal', true, true)}>Add simple box</button>
                        <button style={{width: 80, height: 80}} onClick={e => this.props.onBoxAdded('sortable', false, false)}>Add sortable</button>
                    </div>
                    <button style={{position: 'absolute', right: '10%'}} className="fa fa-close" onClick={e => this.props.onToggleVisibility(false)}></button>
                </div>
            </div>
        );
    }
}