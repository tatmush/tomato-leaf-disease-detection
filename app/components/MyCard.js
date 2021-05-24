import React from 'react';
import {Card} from 'react-native-shadow-cards';
import {Image, Text, StyleSheet, View} from 'react-native';

const MyCard = ({item}) => {
    const imgs = [
        require('../images/img_1.jpg'),
        require('../images/img_2.jpg'),
        require('../images/img_3.jpg'),
        require('../images/img_4.jpg'),
        require('../images/img_5.jpg'),
        require('../images/img_6.jpg'),
        require('../images/img_7.jpg'),
        require('../images/img_8.jpg'),
        require('../images/img_9.jpg'),
        require('../images/img_10.jpg'),
    ]

    const random_img = imgs[Math.floor(Math.random() * imgs.length)];
    console.log('This random img: ' + random_img)
    const image = null;
    //console.log(item.id);
    return(
        <Card style={styles.container}>
            <View style={styles.placeholderView}>
                <Image style={styles.placeholder} source={random_img} resizeMode="cover"/>
            </View>
            
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.body}</Text>

        </Card>
    );
};

const styles = StyleSheet.create({
    
    container: {
        flex:1,
        marginTop: -20,
        margin: 20,
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
    },
    placeholderView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholder: {
        marginTop: 0,
        marginBottom: 0,
        backgroundColor: '#efefef',
        height: 300,
      },
      title: {
        fontWeight: "bold",
        fontSize: 30,
        margin: 10,
        color: 'white'
      },
      description: {
        fontSize: 18,
        lineHeight: 22,
        margin: 15,
        textAlign: 'justify',
        color: 'white'
      }
});

export default MyCard;