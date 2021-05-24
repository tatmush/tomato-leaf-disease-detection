import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';

const Image_ = ({imageSource}) => {

    // let img = imageSource ? require('../images/placeholder_image.png') : require(imageSource);
    // console.log(img);
    return (
        <View style={styles.view}>
            <Image 
                style={styles.placeholder}
                source={ require('../images/placeholder_image.png') }
            />
            
        </View>
        
    );
};

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholder: {
        width: 100,
        height: 100,
        marginTop: 100,
        marginBottom: 0,
        backgroundColor: '#efefef'
    }
})

export default Image_;