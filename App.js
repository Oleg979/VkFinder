import React, { Component } from "react";
import config from "./config/vkConfig";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  ImageBackground,
  StatusBar,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Linking
} from "react-native";

class App extends Component {
  state = {
    id: 1,
    fetching: false,
    error: false,
    placeholder: "Enter user id"
  };

  componentDidMount = async () => {
    await this.fetchUserInfo(this.state.id);
  };

  fetchUserInfo = async () => {
    await this.setState({ fetching: true });
    let data = await fetch(
      `https://api.vk.com/method/users.get?access_token=${
        config.token
      }&user_ids=${
        this.state.id
      }&fields=photo_max_orig,status,city,country,home_town,online&v=V`
    );
    data = await data.json();
    data = data.response[0];
    console.log(data);
    this.setState({
      fetching: false,
      photo: data.photo_max_orig,
      first_name: data.first_name,
      last_name: data.last_name,
      online: data.online,
      city: data.city ? data.city.title : "",
      country: data.country ? data.country.title : "",
      home_town: data.home_town
    });
  };

  onChangeText = id => this.setState({ id });

  onSubmitEditing = async () => {
    await this.fetchUserInfo();
  };

  onPress = () => {
    Linking.openURL(`https://vk.com/id${this.state.id}`);
  };

  render = () => {
    let {
      placeholder,
      photo,
      first_name,
      last_name,
      id,
      status,
      fetching,
      error,
      online,
      city,
      country,
      home_town
    } = this.state;
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <StatusBar hidden={true} />
          <KeyboardAvoidingView behavior="padding">
            <ImageBackground style={styles.image} source={{ uri: photo }}>
              <View style={styles.info}>
                <View style={styles.header}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this.onPress}
                  >
                    <Image
                      resizeMode="contain"
                      style={styles.icon}
                      source={require("./assets/vk-64.png")}
                    />
                  </TouchableOpacity>
                </View>
                {!fetching &&
                  !error && (
                    <View>
                      <Text style={styles.name}>
                        {first_name} {last_name}
                      </Text>
                      <Text style={styles.online}>
                        {online == 0 ? "offline" : "online"}
                      </Text>
                      <Text style={styles.online}>{home_town || city}</Text>
                      <TextInput
                        keyboardType="numeric"
                        style={styles.input}
                        placeholder={placeholder}
                        underlineColorAndroid="transparent"
                        onSubmitEditing={this.onSubmitEditing}
                        onChangeText={this.onChangeText}
                        autoCorrect={false}
                        autoCapitalize="words"
                      />
                    </View>
                  )}
                {error && (
                  <View>
                    <Text style={styles.error}>{id} doesn't exist</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.input}
                      placeholder={placeholder}
                      underlineColorAndroid="transparent"
                      onSubmitEditing={this.onSubmitEditing}
                      onChangeText={this.onChangeText}
                      autoCorrect={false}
                      autoCapitalize="words"
                    />
                  </View>
                )}
                {fetching && <Text style={styles.loading}>Loading...</Text>}
              </View>
            </ImageBackground>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  textInput: {},
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  name: {
    color: "white",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto",
    fontSize: 50,
    marginTop: 170,
    fontWeight: "600"
  },
  loading: {
    color: "white",
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto",
    textAlign: "center",
    fontSize: 30,
    marginTop: 270
  },
  online: {
    color: "white",
    fontWeight: "100",
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto",
    textAlign: "center",
    fontSize: 20,
    marginTop: 10
  },
  status: {
    color: "white",
    fontWeight: "300",
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto",
    textAlign: "center",
    fontSize: 55,
    marginTop: 10
  },
  error: {
    color: "red",
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto",
    textAlign: "center",
    fontSize: 35,
    marginTop: 270
  },
  info: {
    padding: 30,
    backgroundColor: "rgba(71, 66, 66, 0.5)",
    height: Dimensions.get("window").height
  },
  input: {
    textAlign: "center",
    paddingHorizontal: 5,
    color: "white",
    fontSize: 25,
    marginTop: 80,
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto"
  },
  header: {
    alignSelf: "flex-end",
    paddingVertical: 5,
    paddingHorizontal: 5
  },
  icon: {
    marginLeft: 35,
    paddingLeft: 10,
    width: 28
  }
});

export default App;
