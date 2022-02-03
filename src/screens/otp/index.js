import React, { useEffect, Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { Const_Images, Com_color, Com_font } from "../../constants";
import APP_STORE from "../../storage";
import OTPInputView from "@twotalltotems/react-native-otp-input";
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

class OTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      codelength: "",
      mobilenumber: "",
    };
  }

  componentDidMount = async () => {
    const user = await APP_STORE.read();
    const reg_otp = user.otp.toString();
    const mobilenumber = user.mobilenumber.toString();
    this.setState({
      code: reg_otp,
      mobilenumber: mobilenumber,
      codelength: reg_otp.length,
    });
  };

  next_FingerPrint() {
    this.setState({ isLoader: true });
    let apiName = "otpverify";
    let parmeter = {
      mobno: this.state.mobilenumber,
      otp: this.state.code.toString(),
    };
    services
      .post(apiName, parmeter)
      .then((response) => {
        console.log("Response ", response);
        if (response.message === "OTP Verified Successfully") {
          ToastMsg("Login success", "success");
          this.setState({ isLoader: false });
          this.props.navigation.navigate("fingerprint");
        } else {
          this.setState({ isLoader: false });
          ToastMsg(response.message, "danger");
        }
      })
      .catch((err) => console.log("Error is ", err));
  }

  render() {
    const { codelength, code } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          <StatusBar
            translucent={true}
            barStyle="dark-content"
            backgroundColor="transparent"
          />
          <BgImage>
            <Toolbar navigation={this.props} />
            <Image style={styles.splashImg} source={Const_Images.Splash} />
            <Text style={styles.welcometxt}>Verify Account!</Text>
            <View style={styles.mainview}>
              <View style={styles.subview}>
                <Text style={styles.lable}>
                  Enter 4-digit Code we have sent to your mobile number.
                </Text>
              </View>

              <OTPInputView
                style={{
                  width: "80%",
                  height: 100,
                  justifyContent: "center",
                  alignSelf: "center",
                }}
                pinCount={4}
                code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                onCodeChanged={(code) => {
                  this.setState({ code, codelength: code.length });
                }}
                autoFocusOnLoad
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                placeholderCharacter="0"
                placeholderTextColor="#161f3d"
                onCodeFilled={(code) => {
                  console.log(`Code is ${code}, you are good to go!`);
                }}
              />

              <View style={styles.subview}>
                <TouchableOpacity
                  disabled={codelength === 4 ? false : true}
                  onPress={() => this.next_FingerPrint()}
                >
                  <View
                    style={[
                      styles.Btnview,
                      {
                        opacity: this.state.codelength == 4 ? 1 : 0.51,
                      },
                    ]}
                  >
                    {this.state.isLoader ? (
                      <Spinner color="#fb0143" />
                    ) : (
                      <Text style={styles.Btntxt}>Continue</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.subview,
                  { flexDirection: "row", alignSelf: "center" },
                ]}
              >
                <Text style={styles.lable}>Didn’t receive the code?</Text>
                <Text
                  onPress={() => alert("ok")}
                  style={[
                    styles.lable,
                    { color: Com_color.txtblue, paddingLeft: 10 },
                  ]}
                >
                  Resend Code
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
  lable: {
    fontSize: Com_font.txt16,
    color: Com_color.labletxt2,
    textAlign: "center",
  },
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
  underlineStyleBase: {
    width: 60,
    height: 60,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: "#161f3d",
    fontSize: Com_font.txt20,
  },

  underlineStyleHighLighted: {
    borderColor: "#1d1d26",
    borderBottomWidth: 1,
  },
};

export default OTP;
