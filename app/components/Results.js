import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Results = ({results}) => {
    return(
        <View style={styles.container}>
            <Text style={styles.header}>{results.disease}</Text>
            <Text style={styles.desc}>{results.description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        margin: 45,
    },
    header: {
        fontSize: 22,
        textAlign: 'center',
        marginTop: 15,
        color: 'white'
    },
    desc: {
        marginTop: 20,
        marginLeft: 15,
        marginRight:15,
        textAlign: 'justify',
        fontSize: 18,
        lineHeight: 22,
        color: 'white'
    }
});

export default Results;