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
  Alert,
} from "react-native";
import { Const_Images, Com_color, Com_font } from "../../constants";
import APP_STORE from "../../storage";
import { Spinner } from "native-base";
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from "../../utils";
import BgImage from "../../templates/BgImage";
import Toolbar from "../../templates/Toolbar";
import ToastMsg from "../../templates/ToastMessage";
import services from "../../services";

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNo: "",
      isLoader: false,
    };
  }

  // componentDidMount() {
  //   this.backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     this.backAction,
  //   );
  // }

  // backAction = () => {
  //   Alert.alert('Hold on!', 'Are you sure you want to go back?', [
  //     {
  //       text: 'Cancel',
  //       onPress: () => null,
  //       style: 'cancel',
  //     },
  //     {text: 'YES', onPress: () => BackHandler.exitApp()},
  //   ]);
  //   return true;
  // };

  handle_SignIn() {
    this.setState({ isLoader: true });
    let apiName = "signin";
    let parmeter = {
      mobilenumber: this.state.mobileNo,
    };
    services
      .post(apiName, parmeter)
      .then((response) => {
        console.log("Response ", response);
        if (response.status === "Success") {
          ToastMsg("Login success", "success");
          APP_STORE.create(response.response);
          this.setState({ isLoader: false });
          this.props.navigation.navigate("otp");
        } else {
          this.setState({ isLoader: false });
          ToastMsg(response.message, "danger");
        }
      })
      .catch((err) => console.log("Error is ", err));
  }

  // handle_SignIn() {
  //   this.props.navigation.navigate('otp');
  // }

  render() {
    return (
      <View style={styles.container}>
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
                <Text style={styles.lable}>MOBILE NUMBER</Text>
                <TextInput
                  style={styles.TxtInput}
                  keyboardType="phone-pad"
                  placeholderTextColor={Com_color.labletxt}
                  placeholder="Enter MobileNo"
                  value={this.state.mobileNo}
                  onChangeText={(text) => {
                    this.setState({ mobileNo: text });
                  }}
                />
              </View>
              <View style={styles.subview}>
                <TouchableOpacity
                  onPress={() => this.handle_SignIn()}
                  style={styles.Btnview}
                >
                  {this.state.isLoader ? (
                    <Spinner color="#fb0143" />
                  ) : (
                    <Text style={styles.Btntxt}>Sign in</Text>
                  )}
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.subview,
                  { flexDirection: "row", alignSelf: "center" },
                ]}
              >
                <Text style={styles.lable}>Don't have an account?</Text>
                <Text
                  onPress={() => this.props.navigation.navigate("signup")}
                  style={[
                    styles.lable,
                    { color: Com_color.txtblue, paddingLeft: 10 },
                  ]}
                >
                  Sign up
                </Text>
              </View>
            </View>
          </BgImage>
        </ScrollView>
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

export default Signin;
