import React, { useEffect, Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Text,
  TextInput,
  ScrollView,
  BackHandler,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Const_Images, Com_color, Com_font } from "../../constants";
import APP_STORE from "../../storage";
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from "../../utils";

import BgImage from "../../templates/BgImage";
import Toolbar from "../../templates/Toolbar";
import ToastMsg from "../../templates/ToastMessage";
import services from "../../services";
import { Spinner } from "native-base";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      mobileNo: "",
      isLoader: false,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  Signup_handle() {
    this.setState({ isLoader: true });
    let apiName = "registration";
    let parmeter = {
      name: this.state.userName,
      mobilenumber: this.state.mobileNo,
    };
    services
      .post(apiName, parmeter)
      .then((response) => {
        console.log("Response ", response);
        if (response.message === "Registration Sucessfully") {
          ToastMsg("Login success", "success");
          APP_STORE.create(response.result);
          this.setState({ isLoader: false });
          this.props.navigation.navigate("otp");
        } else {
          this.setState({ isLoader: false });
          ToastMsg(response.message, "danger");
        }
      })
      .catch((err) => console.log("Error is ", err));
  }

  handle_haveaccount() {
    this.props.navigation.navigate("signin");
  }

  render() {
    const keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 0;
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={keyboardVerticalOffset}
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <ScrollView>
            <StatusBar
              translucent={true}
              barStyle="dark-content"
              backgroundColor="transparent"
            />
            <BgImage>
              {/* <Toolbar navigation={this.props} /> */}
              <Image style={styles.splashImg} source={Const_Images.Splash} />
              <Text style={styles.welcometxt}>Welcome To Hiddenly!</Text>
              <View style={styles.mainview}>
                <View style={styles.subview}>
                  <Text style={styles.lable}>NAME</Text>
                  <TextInput
                    style={styles.TxtInput}
                    placeholderTextColor={Com_color.labletxt}
                    placeholder="Enter Name"
                    value={this.state.userName}
                    onChangeText={(userName) => {
                      this.setState({ userName: userName });
                    }}
                  />
                </View>
                <View style={styles.subview}>
                  <Text style={styles.lable}>MOBILE NUMBER</Text>
                  <TextInput
                    keyboardType="phone-pad"
                    style={styles.TxtInput}
                    placeholderTextColor={Com_color.labletxt}
                    placeholder="Enter MobileNo"
                    value={this.state.mobileNo}
                    onChangeText={(mobileNo) => {
                      this.setState({ mobileNo: mobileNo });
                    }}
                  />
                </View>
                <View style={styles.subview}>
                  <TouchableOpacity
                    onPress={() => this.Signup_handle()}
                    style={styles.Btnview}
                  >
                    {this.state.isLoader ? (
                      <Spinner color="#fb0143" />
                    ) : (
                      <Text style={styles.Btntxt}>Sign up</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.subview,
                    { flexDirection: "row", alignSelf: "center" },
                  ]}
                >
                  <Text style={styles.lable}>Already have an account?</Text>
                  <Text
                    onPress={() => this.handle_haveaccount()}
                    style={[
                      styles.lable,
                      { color: Com_color.txtblue, paddingLeft: 10 },
                    ]}
                  >
                    Sign In
                  </Text>
                </View>
              </View>
            </BgImage>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = {
  container: { flex: 1 },
  splashImg: { width: 200, height: 250, alignSelf: "center", marginTop: "20%" },
  welcometxt: {
    fontSize: Com_font.txt20,
    alignSelf: "center",
    color: Com_color.labletxt,
  },
  mainview: { margin: 40 },
  lable: { fontSize: Com_font.txt14, color: Com_color.labletxt2 },
  TxtInput: { fontSize: Com_font.txt16, color: Com_color.Inputtxt },
  subview: { marginTop: 20 },
  Btnview: {
    height: 50,
    borderRadius: 10,
    backgroundColor: Com_color.Btnblue,
    justifyContent: "center",
    alignItems: "center",
  },
  Btntxt: {
    fontSize: Com_font.txt20,
    color: Com_color.txtyellow,
    fontWeight: "bold",
  },
};

export default Signup;
