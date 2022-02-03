import React, { useEffect, Component } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Const_Images, Com_font, Com_color } from "../../../constants";
import CommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from "../../../utils";
import Iconedit from "react-native-vector-icons/MaterialIcons";
import { TextInput } from "react-native-gesture-handler";
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";
import APP_STORE from "../../../storage";
import services from "../../../services";
import ToastMsg from "../../../templates/ToastMessage";
import { Spinner } from "native-base";
import { BottomSheet } from "react-native-elements";
import Icons from "react-native-vector-icons/Ionicons";
import Iconclose from "react-native-vector-icons/AntDesign";

//import ImagePicker from "react-native-image-crop-picker";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GalleryImg: "",
      Username: "",
      About: "",
      ProfileDatas: "",
      isVisible: false,
      isLoader: false,
    };
  }

  async componentDidMount() {
    this.setState({ isLoader: true });
    const user = await APP_STORE.read();
    const user_id = user._id;
    let apiName = "getprofile/" + user_id;
    services
      .get(apiName)
      .then((response) => {
        console.log("getprofile----> ", response.response);
        if (response.status === "Success") {
          this.setState({
            ProfileDatas: response.response,
            Username: response.response.name,
            About: response.response.about,
          });
          this.setState({ isLoader: false });
        } else {
          ToastMsg(response.message, "danger");
          this.setState({ isLoader: false });
        }
      })
      .catch((err) => console.log("Error is ", err));
  }

  picImg() {
    this.setState({ isVisible: true });
  }
  DP_Camera() {
    const options = {
      noData: true,
      rotation: 360,
    };
    launchCamera(options, (response) => {
      console.log(response);
      if (response.assets) {
        this.setState({
          GalleryImg: response.assets[0],
          isVisible: false,
        });
        this.User_updateprofile();
      }
    });
  }

  DP_ImageLibrary() {
    const options = {
      noData: true,
      rotation: 360,
    };
    launchImageLibrary(options, (response) => {
      console.log(response);
      if (response.assets) {
        this.setState({
          GalleryImg: response.assets[0],
          isVisible: false,
        });
        this.User_updateprofile();
      }
    });
  }

  User_updateprofile = async () => {
    this.setState({ isLoader: true });
    const user = await APP_STORE.read();
    const user_id = user._id;
    console.log(user_id);
    const profileUpdate = new FormData();
    console.log("FormData", this.state.GalleryImg.uri);
    {
      this.state.GalleryImg.uri === undefined
        ? null
        : profileUpdate.append("profile_img", {
            uri:
              Platform.OS === "ios"
                ? this.state.GalleryImg.uri
                : "file://" + this.state.GalleryImg.uri,
            name: this.state.GalleryImg.fileName,
            type: this.state.GalleryImg.type,
          });
    }
    profileUpdate.append("name", this.state.Username);
    profileUpdate.append("about", this.state.About);

    let apiName = "updateprofile/" + user_id;

    services
      .put(apiName, profileUpdate, true)
      .then((response) => {
        console.log("Response ", response);
        if (response.status === "Success") {
          ToastMsg("Profile Update success", "success");
          this.setState({ isLoader: false });
        } else {
          ToastMsg(response.message, "danger");
          this.setState({ isLoader: false });
        }
      })
      .catch((err) => console.log("Error is ", err));
  };

  render() {
    const { GalleryImg, ProfileDatas } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={"transparent"}
          barStyle="dark-content"
        />
        <View
          style={{
            marginTop: "10%",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: "2%",
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={styles.backIcon}
          >
            <CommunityIcons
              name="keyboard-backspace"
              color="#3b3b3b"
              size={40}
            />
          </TouchableOpacity>
          <Text style={styles.Labletxt}>Profile</Text>
        </View>
        {this.state.isLoader ? (
          <Spinner color={Com_color.txtyellow} />
        ) : (
          <View>
            <View style={styles.Imgview}>
              <Image
                source={
                  GalleryImg !== ""
                    ? { uri: GalleryImg.uri }
                    : !STRING_VALIDATION(ProfileDatas.profile_img)
                    ? {
                        uri:
                          "http://51.15.204.121/hiddenly/Hiddenly/Media/Profile_Img/" +
                          ProfileDatas.profile_img,
                      }
                    : Const_Images.profile
                }
                resizeMode={"contain"}
                style={styles.Img}
              />
              <TouchableOpacity
                style={styles.Img2}
                onPress={() => this.picImg()}
              >
                <Image
                  source={Const_Images.ic_Profile_Camera}
                  style={styles.Img2}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.mainview}>
              <View style={styles.subview}>
                <Text style={styles.Labletxt2}>Name</Text>
                <TextInput
                  value={this.state.Username}
                  onChangeText={(text) => {
                    this.setState({ Username: text });
                  }}
                  style={styles.edittxt}
                  onSubmitEditing={() => this.User_updateprofile()}
                />
                <Iconedit
                  name={"edit"}
                  size={30}
                  color={"#003399"}
                  style={styles.Ricon}
                />
              </View>
              <View style={styles.subview}>
                <Text style={styles.Labletxt2}>About</Text>
                <TextInput
                  value={this.state.About}
                  onChangeText={(text) => {
                    this.setState({ About: text });
                  }}
                  style={styles.edittxt}
                  onSubmitEditing={() => this.User_updateprofile()}
                />
                <Iconedit
                  name={"edit"}
                  size={30}
                  color={"#003399"}
                  style={styles.Ricon}
                />
              </View>
              <View style={styles.subview}>
                <Text style={styles.Labletxt2}>Phone</Text>
                <TextInput
                  editable={false}
                  value={this.state.ProfileDatas.mobilenumber}
                  style={styles.edittxt}
                />
              </View>
              {/* <View style={{ marginTop: "5%" }}>
                <TouchableOpacity onPress={() => this.User_updateprofile()}>
                  <View style={styles.btnstyle}>
                    <Text style={styles.btntext}>Submit</Text>
                  </View>
                </TouchableOpacity>
              </View> */}
              <View style={{ marginTop: "10%" }}>
                <TouchableOpacity>
                  <View style={styles.btnstyle2}>
                    <Text style={styles.btntext2}>Delete my account</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <BottomSheet
          isVisible={this.state.isVisible}
          containerStyle={{
            backgroundColor: "rgba(0.5, 0.25, 0, 0.2)",
          }}
        >
          <View style={styles.BSmainview}>
            <View style={{ margin: "5%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.poplabletxt}>Profile Photo</Text>
                <Iconclose
                  onPress={() => this.setState({ isVisible: false })}
                  name="close"
                  size={30}
                />
              </View>
              <View style={{ justifyContent: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: "5%",
                  }}
                >
                  <View style={{ alignItems: "center", width: "30%" }}>
                    <View
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        backgroundColor: "red",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity onPress={() => alert("Delete")}>
                        <Icons
                          color={Com_color.txtblue}
                          name="trash"
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.poplabletxt}>Remove</Text>
                  </View>

                  <View style={{ alignItems: "center", width: "30%" }}>
                    <View
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        backgroundColor: "yellow",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity onPress={() => this.DP_Camera()}>
                        <Icons
                          color={Com_color.txtblue}
                          name="camera"
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.poplabletxt}>Camera</Text>
                  </View>

                  <View style={{ alignItems: "center", width: "30%" }}>
                    <View
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        backgroundColor: "green",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity onPress={() => this.DP_ImageLibrary()}>
                        <Icons
                          color={Com_color.txtblue}
                          name="image"
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.poplabletxt}>Gallary</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </BottomSheet>
      </View>
    );
  }
}

const styles = {
  container: { flex: 1 },
  backIcon: { marginLeft: "5%" },
  Labletxt: {
    color: Com_color.Inputtxt,
    fontSize: Com_font.txt16,
    fontWeight: "bold",
    paddingLeft: 20,
  },
  Imgview: { width: dw, height: dh * 0.32 },
  Img: { width: "100%", height: "100%" },
  Img2: { width: 100, height: 100, position: "absolute", right: 0, bottom: 0 },
  mainview: { margin: "5%" },
  subview: { justifyContent: "center", marginVertical: "3%" },
  Ricon: { position: "absolute", right: 0 },
  edittxt: {
    color: Com_color.Inputtxt,
    fontSize: Com_font.txt16,
    fontWeight: "bold",
    width: dw * 0.8,
  },
  Labletxt2: {
    color: Com_color.labletxt2,
    fontSize: Com_font.txt14,
  },
  btnstyle: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Com_color.Btnblue,
    backgroundColor: Com_color.Btnblue,
    borderRadius: 10,
  },
  btnstyle2: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Com_color.Btnblue,
    borderRadius: 10,
  },
  btntext: {
    color: Com_color.white,
    fontSize: Com_font.txt16,
    fontWeight: "bold",
  },
  btntext2: {
    color: Com_color.redtxt,
    fontSize: Com_font.txt16,
    fontWeight: "bold",
  },
  poplabletxt: {
    fontSize: Com_font.txt16,
    color: Com_color.labletxt,
    fontWeight: "bold",
  },
  BSmainview: {
    height: dh * 0.2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
};

export default Profile;
