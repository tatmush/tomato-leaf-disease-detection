import React, {useState, useEffect} from 'react';
import { ImageBackground, View, StyleSheet, Text, ToastAndroid, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator, Platform, FlatList, RefreshControl, TextInput} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Header from './components/Header';
import Results from './components/Results';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyCard from './components/MyCard';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const Home = () => {
  
  useEffect (() => {
    SplashScreen.hide();
  })

  // image variable
  const [image, setImage] = useState(null);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('farmer_id')
      if(value !== null) {
        // console.log(value);
        setFarmerId(value);
        // return value;
      }
    } catch(e) {
      // error reading value
    }
  }

  const [farmer_id, setFarmerId] = useState(getData());
  
  // loader variable
  const [animating, setAnimating] = useState(false);

  // disease view
  const [results, setResults] = useState({});

  // take picture of tomato leaf
  const camera = (options) => {
    console.log('inside camera');

    launchCamera(options, res => {
      
      if (res.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (res.error){
        console.log('ImagePicker Error: ', res.error);
        Alert.alert(res.error);
      }
      else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButtom);
      }
      else {
        console.log(res);
        setImage(res);
      }
    });    
    
  }

  // get picture of tomamto leaf from gallery
  const library = (options) => {
    launchImageLibrary(options, res => {

      if (res.didCancel) {
        console.log('User cancelled image picker');
        Alert.alert('You did not select any image');
      }
      else if (res.error){
        console.log('ImagePicker Error: ', res.error);

      }
      else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButtom);
        
      }
      else {
        console.log(res);
        setImage(res);
      }
    })
  }

  // select tomato leaf picture
  const selectFile = () => {
    const options = {
      mediaType: 'photo',
      saveToPhotos: true
    }

    Alert.alert(
      'Select Image',
      '',
      [
        {
          text: 'cancel',
          onPress: console.log('cancel'),
          style: 'cancel'
        },
        {
          text: 'Take a photo',
          onPress: () => camera(options)
        },
        {
          text: 'Choose from library',
          onPress: () => library(options)
        }
      ]
    );
  };


  // send image to server
  const scan = () => {
    setAnimating(true);
    getData()

    if (image === null) {
      Alert.alert('You did not select any image');
      setAnimating(false);
    }
    else {
      
      let data = new FormData();
      data.append('image', {
        name: image.fileName,
        type: image.type,
        uri: Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""),
      });
      data.append('farmer_id', farmer_id);
      console.log(data); 
      
      // TODO: Different types of files e.g files taken with the camera of the phone
      // fetch('http://130.61.189.244:8000/detect_disease', {
        fetch('http://10.0.2.2:5000/detect_disease', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept-Encoding': 'gzip, deflate'
        },
        body: data
      })
      .then((res) => {
        if(!res.ok){
          Alert.alert('Server error');
          throw new Error('Network response was not ok');
        }
        return res.json()
      })
      .then((data) => {
        // stop loader
        setAnimating(false);
        console.log(data);
        // display results
        setResults(data);
      })
      .catch((err) => {
        Alert.alert('There was an error in scanning the picture');
        console.log(err);
        // Alert.alert(err);
        setAnimating(false);
      });
    }   
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground source={require('./images/tom_background.jpg')} style={styles.image} imageStyle={{opacity: 0.8}}>
        <Header title='Disease Detection'/>
        <View style={{ flex: 19 }}>
          <View style={styles.placeholderView}>
            <Image style={styles.placeholder} source={image == null? require('./images/placeholder_image.png'):{uri: image.uri}}/>
          </View>

          <TouchableOpacity style={styles.button} onPress={ selectFile }>
            <Text style={styles.text}>LOAD IMAGE</Text>
          </TouchableOpacity>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity style={styles.button_2} onPress={scan }>
              <Text style={styles.text}>SCAN</Text>
            </TouchableOpacity>

            <ActivityIndicator animating = {animating} style={{ marginTop: 20, marginBottom: 20 }} size="large" color="#fff" />
          </View>
          <Results results={results}/>
        </View>
      </ImageBackground>
    </ScrollView>
  )
};

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
const Updates = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const [latest_news, set_latest_news] = React.useState()

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Add timeout to the fetch function if server is not reachable
    // fetch('http://130.61.189.244:8000/latest_news', {
      fetch('http://10.0.2.2:5000/latest_news', {
        method: 'GET'
      })
      .then((res) => {
        if(!res.ok){
          Alert.alert('Server error');
          throw new Error('Network response was not ok');
        }
        return res.json()
      })
      .then((data) => {
        console.log(data.latest_news);
        setRefreshing(false);
        set_latest_news(data.latest_news);
      })
      .catch((err) => {
        Alert.alert('There was an error fetching news');
        console.log(err);

      });

    //wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container} >
      <ImageBackground source={require('./images/tom_background.jpg')} style={styles.image} imageStyle={{opacity: 0.8}}>
        <Header title='News'/>
        <View style={{ flex: 19 }}>
          <FlatList
            data={latest_news}
            renderItem={({ item }) => (
              <MyCard item={item}/>
            )}
            keyExtractor={item => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const Farmer_Info = () => {

  const [farmer_name, onChangeFarmerName] = useState(null);
  const [farm_name, onChangeFarmName] = useState(null);
  const [location, onChangeLocation] = useState(null);

  const showToastWithGravity = (e) => {
    ToastAndroid.showWithGravity(
      e,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('farmer_id', value)
    } catch (e) {
      // saving error
    }
  }

  const submit = (() => {
    console.log(farmer_name);
    console.log(farm_name);
    console.log(location);

    // submit to API or route
    const requestOptions = {
      method: 'POST',
      headers: { 
        Accept: 'application/json',
        'Content-Type': 'application/json'},
      body: JSON.stringify({
        farmer_name : farmer_name, 
        farm_name: farm_name, 
        location: location})
    };

    fetch('http://10.0.2.2:5000/farmer_info', requestOptions)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      showToastWithGravity(String(data.response));
      storeData(String(data.farmer_id));
    })
    .catch(err => console.log(err));
  })

  return (
    <View style={styles.container}>
      <ImageBackground source={require('./images/tom_background.jpg')} style={styles.image} imageStyle={{opacity: 0.8}}>
        <Header title='Farmer Info'/>

        <View style={{ flex: 19 }}>
          <View style={styles.placeholderView}>
            <Icon style={[{color: "#fff"}]} size={155} name={'person-circle-outline'} />
          </View>

          <View style={{margin: 15}}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeFarmerName}
              placeholder='farmer name'
              placeholderTextColor='#fff'
              value={farmer_name}
            />

            <TextInput
              style={styles.input}
              onChangeText={onChangeFarmName}
              placeholder='farm name'
              placeholderTextColor='#fff'
              value={farm_name}
            />

            <TextInput
              style={styles.input}
              onChangeText={onChangeLocation}
              placeholder='location (district)'
              placeholderTextColor='#fff'
              value={location}
            />

          </View>

          <View style={{alignItems: 'center', marginTop: 100}}>
            <TouchableOpacity style={styles.button_3} onPress={ submit }>
              <Text style={styles.text}>SUBMIT</Text>
            </TouchableOpacity>
          </View>

        </View>

      </ImageBackground>
    </View>
  )
}

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 0,
  },
  button: {
    backgroundColor: '#b61500',
    marginTop: 80,
    borderWidth: 1,
    padding: 8,
    height: 35,
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 15,
    marginLeft: 15,
  },
  button_2: {
    backgroundColor: '#b61500',
    marginTop: 80,
    borderWidth: 1,
    padding: 8,
    height: 35,
    width: 70,
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 15,
    marginLeft: 15,
  },
  button_3: {
    backgroundColor: '#b61500',
    // marginTop: 50,
    borderWidth: 1,
    // padding: 8,
    height: 55,
    width: 100,
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 15,
    marginLeft: 15,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
  placeholder: {
    width: 100,
    height: 100,
    marginTop: 60,
    marginBottom: 0,
    backgroundColor: 'transparent'
  },
  placeholderView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 10,
    margin: 10 
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0,
    color:'#fff',
    fontSize: 18,
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
});

export default function Test() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
      backBehavior='history'
      tabBarOptions={{
        activeTintColor: '#b61500',
      }}
      >
        <Tab.Screen 
          name="Home" 
          component={Home} 
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <Icon style={[{color: color}]} size={25} name={'home'}/>
            ),
          }}
          />

        <Tab.Screen name='Updates'
          component={Updates} 
          options={{
            tabBarLabel: 'Updates',
            tabBarIcon: ({ color }) => (
              <Icon style={[{color: color}]} size={25} name={'notifications'}/>
            ),
          }}
        />

        <Tab.Screen name='Farmer Info'
        component={Farmer_Info}
        options={{
          tabBarLabel: 'Farmer Info',
          tabBarIcon: ({ color }) => (
            <Icon style={[{color: color}]} size={25} name={'person-sharp'} />
          ),
        }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};