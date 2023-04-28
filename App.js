import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  RefreshControl
} from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import axios from "axios";
// Image Imports
import day_normal from "./assets/backgrounds/house_day_black.png";
import day_cool from "./assets/backgrounds/house_day_blue.png";
import day_hot from "./assets/backgrounds/house_day_orange.png";
import day_toHot from "./assets/backgrounds/house_day_red.png";
import night_normal from "./assets/backgrounds/house_night_black.png";
import night_cool from "./assets/backgrounds/house_night_blue.png";
import night_hot from "./assets/backgrounds/house_night_orange.png";
import night_toHot from "./assets/backgrounds/house_night_red.png";
// Expo imports
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
// weather icons
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function App() {
  const [location, setLocation] = useState({ "description": "Loading..", "feels_like": "..", "highest": "..", "humidity": "..", "lowest": "..", "name": "Loading..", "sunrise": "..", "sunset": "..", "temp": ".." });
  // const [location, setLocation] = useState({
  //   description: "broken clouds",
  //   feels_like: "41",
  //   highest: "12",
  //   humidity: "63",
  //   lowest: "34",
  //   name: "Kochi",
  //   sunrise: "12:40 AM",
  //   sunset: "1:05 PM",
  //   temp: "25",
  // });
  const [textColor, setTextColor] = useState("white");
  const [backgroundImage, setBackgroundImage] = useState(night_normal);
  const [refresh, setRefresh] = useState(false);
  let date = new Date();
  const currentTime = date.getHours();
  const [loading, setLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    Jost: require("./assets/fonts/Jost.ttf"),
  });
  // startup functions
  const imageLoader = () => {
    let temp = parseInt(location.temp);
    console.log(currentTime);
    if (currentTime >= 6 && currentTime <= 18) {
      console.log("DAY"); 
      if (temp <= 15) {
        setBackgroundImage(day_cool);
        setTextColor("white");
      }
      if (temp >= 15) {
        setBackgroundImage(day_normal);
        setTextColor("white");
      }
      if (temp >= 25) {
        setBackgroundImage(day_hot);
        setTextColor("white");
      }
      if (temp >= 35) {
        setBackgroundImage(day_toHot);
        setTextColor("white");
      }
    } 
    if(currentTime >= 18){
      console.log("NIGHT");
      if (temp <= 15) {
        setBackgroundImage(night_cool);
        console.log("night_cool");
        setTextColor("white");
      }
      if (temp >= 15) {
        setBackgroundImage(night_normal);
        console.log("night_normal");
        setTextColor("white");
      }
      if (temp >= 25) {
        setBackgroundImage(night_hot);
        console.log("night_hot");
        setTextColor("white");
      }
      if (temp >= 35) {
        setBackgroundImage(night_toHot);
        console.log("night_toHot");
        setTextColor("white");
      }
    }
  };
  const getLocation = async () => {
    setLoading(true)
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return; 
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    let lon = location.coords.longitude.toString();
    let lat = location.coords.latitude.toString();
    // let url = 'http://localhost:8080/weather?lat=25.284455117227658&lon=51.503754719113545'
    let url = `${process.env.REACT_APP_API_URL_DEV}?lat=${lat}&lon=${lon}`;
    axios
      .get(url)
      .then((res) => {
        console.log(res.data);
        setLocation(res.data);
        SplashScreen.hideAsync();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false)
      });
  };
  // load Jost font
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
    getLocation();
    // imageLoader();
  }, []);
  useEffect(() => {
    imageLoader();
  }, [location])
  if (!fontsLoaded) {
    return undefined;
  } else {

  }

  return (
    <View style={styles.container} >
      <View style={styles.backgroundImageCon}>
        <Image source={backgroundImage} style={styles.backgroundImage} />
      </View>
      <SafeAreaView>
        {loading ? <Text style={styles.loadingTxt}>Loading...</Text> : <Text style={styles.logoTxt}>SUPERNOVA</Text>}
    <ScrollView style={{width: '100%'}} refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => getLocation()}/>}>

        <Text
          style={[styles.decription, { color: "lightgrey", marginTop: "5%" }]}
        >
          {location.name}
        </Text>
        <Text style={[styles.degreeTxt, { color: textColor }]}>
          {location.temp}°C
        </Text>
        <Text
          style={[styles.decription, { color: "lightgrey" }]}
        >
          {location.description}
        </Text>
        </ScrollView>
      </SafeAreaView>
      <View style={styles.detailsCon}>
        <View style={styles.detailsBody}>
          <View style={styles.details}>
            <MaterialCommunityIcons
              name="water-percent"
              size={20}
              color="white"
            />
            <Text style={styles.detailsMainTXT}>Humidity</Text>
            <Text style={styles.detailsTxt}>{location.humidity}%</Text>
          </View>
          <View style={[styles.details, styles.marginLeft]}>
            <FontAwesome name="cloud" size={20} color="white" />
            <Text style={styles.detailsMainTXT}>Feels Like</Text>
            <Text style={styles.detailsTxt}>{location.feels_like}°C</Text>
          </View>
          <View style={[styles.details, styles.marginLeft]}>
            <Feather name="thermometer" size={20} color="white" />
            <Text style={styles.detailsMainTXT}>Lowest</Text>
            <Text style={styles.detailsTxt}>{location.lowest}°C</Text>
          </View>
        </View>
        <Text 
          style={[styles.detailsMainTXT, {fontSize: 13, color: 'grey'}]}
          onPress={getLocation}>Reload</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logoTxt: {
    marginTop: "10%",
    fontFamily: "Jost",
    fontSize: 20,
    color: "#6A6A6A",
    width: "100%",
    textAlign: "center",
  },
  loadingTxt: {
    marginTop: "10%",
    fontFamily: "Jost",
    fontSize: 20,
    color: "white",
    width: "100%",
    textAlign: "center",    
  },
  backgroundImageCon: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  backgroundImage: {
    width: 600,
    height: "100%",
  },
  degreeTxt: {
    fontSize: 60,
    marginLeft: "10%",
    fontFamily: "Jost",
  },
  decription: {
    marginLeft: "10%",
    fontFamily: "Jost",
  },
  detailsCon: {
    width: "100%",
    height: "25%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsBody: {
    width: "85%",
    height: "80%",
    backgroundColor: "#D9D9D908",
    borderRadius: 20,
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  details: {
    width: "30%",
    height: "100%",
    backgroundColor: "#D9D9D908",
    borderRadius: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    padding: 20,
  },
  marginLeft: {
    marginLeft: 10,
  },
  detailsTxt: {
    fontSize: 20,
    fontFamily: "Jost",
    fontWeight: "bold",
    color: "white",
  },
  detailsMainTXT: {
    fontSize: 10,
    color: "white",
    fontFamily: "Jost",
  },
});
