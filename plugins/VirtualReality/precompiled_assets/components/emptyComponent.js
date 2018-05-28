import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Environment,
    asset,
} from 'react-360';

export default class emptyComponent extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <View />
        );
    }
}

const styles = StyleSheet.create({
});
