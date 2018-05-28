import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Environment,
    asset,
} from 'react-360';

export default class Background extends React.Component {

    constructor() {
        super();
    // console.log("Esto sale en el constructor");
    }

    componentWillReceiveProps(nextProps) {
    // console.log("Está recibiendo nuevas props");
        if (
            nextProps.imgBack !== this.props.imgBack ||
      nextProps.format !== this.props.format
        ) {
            Environment.setBackgroundImage(asset(nextProps.imgBack), { format: nextProps.format });
        }
    }

    render() {
        return null;
    }
}

const styles = StyleSheet.create({
});
