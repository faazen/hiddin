import React, { useEffect, Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  Pressable,
} from "react-native";
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from "../../utils";
import { Const_Images, Com_color, Com_font } from "../../constants";
import Toolbar from "../../templates/Toolbar";
import FingerprintScanner from "react-native-fingerprint-scanner";
import ToastMsg from "../../templates/ToastMessage";
import Icons from "react-native-vector-icons/Ionicons";
import Iconadd from "react-native-vector-icons/MaterialIcons";
import Iconsfooter from "react-native-vector-icons/SimpleLineIcons";
import { Container, Picker } from "native-base";
import io from "socket.io-client";
import Video from "react-native-video";
import { BottomSheet } from "react-native-elements";
import IconBack from "react-native-vector-icons/MaterialCommunityIcons";
import IconDot from "react-native-vector-icons/Entypo";
import Iconclose from "react-native-vector-icons/AntDesign";
import services from "../../services";
import APP_STORE from "../../storage";
import { FlatList } from "react-native-gesture-handler";
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";
import DocumentPicker from "react-native-document-picker";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import LiveAudioStream from "react-native-live-audio-stream";
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  PlayBackType,
  RecordBackType,
} from "react-native-audio-recorder-player";
import RNFetchBlob from "rn-fetch-blob";

const CustomMenu = ({ navigation, onPress }) => {
  let _menu = null;
  return (
    <View>
      <Menu
        ref={(ref) => (_menu = ref)}
        button={
          <TouchableOpacity onPress={() => _menu.show()}>
            <IconDot
              style={styles.Icons2}
              name="dots-three-vertical"
              size={20}
            />
          </TouchableOpacity>
        }
      >
        <MenuItem
          onPress={() => {
            onPress();
          }}
        >
          clear Chat
        </MenuItem>
      </Menu>
    </View>
  );
};

const audioRecorderPlayer = new AudioRecorderPlayer();

const dirs = RNFetchBlob.fs.dirs;
const path = Platform.select({
  ios: "Audio.m4a",
  android: `${dirs.CacheDir}/Audio.m4a`,
});

class GroupChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: "",
      Activated: false,
      UserDetails: "",
      ProfileName: "",
      Other_id: "",
      Other_Mo_id: "",
      Room_id: "",
      txtchatMessage: "",
      seen: true,
      isVisible: false,
      isVisible_Att: false,
      hours: 10,
      minutes: 20,
      time: "",
      H_selectedcat: "",
      M_selectedcat: "",
      S_selectedcat: "",
      chatMessage: "",
      chatMessages: [],
      GalleryImg: "",
      docData: "",
      recordTime: "",
    };
  }

   async componentDidMount() {
    const user = await APP_STORE.read();
    this.setState({ UserDetails: user });
    const { navigation, route } = this.props;
    const screenName = route?.params?.screenName;
    const chatscreen = route?.params?.screenName2;
    this.setState({ screen: screenName === "CreateGroup" ? screenName : null });
    const groupName =
      screenName === "CreateGroup"
        ? route?.params?.CreateGroupData.groupName
        : null;
        
    const Room_id =
      screenName === "CreateGroup"
        ? route?.params?.CreateGroupData.room_id
        : null || chatscreen === "chat"
        ? route?.params?.groupData.room_id
        : null;
        console.log("route?.params?.groupData",route?.params?.groupData);
    this.setState({ Room_id });
    const Other_mobilenumber =
      screenName === "CreateGroup"
        ? null
        : chatscreen === "chat"
        ? null
        : route?.params?.contactData.number;
    this.setState({ Other_Mo_id: Other_mobilenumber });

    const contactName =
      screenName === "CreateGroup"
        ? null
        : chatscreen == "chat"
        ? route?.params?.groupData.groupName
        : route?.params?.contactData.name;
    const contactName2 =
      screenName === "CreateGroup"
        ? route?.params?.CreateGroupData.groupName
        : null;
    const ProfileName =
      screenName === "CreateGroup"
        ? groupName
        : contactName == "undefined"
        ? contactName
        : contactName2 || contactName2 == "undefined"
        ? contactName2
        : contactName;
    this.setState({ ProfileName: ProfileName });
    this.Finger_print();
    this.socket = io("http://51.15.204.121:3000/");
    this.socket.on("messageSend", (msg) => {
      this.setState({ chatMessages: [...this.state.chatMessages, msg] });
    });
    this.socket.on("user gallery", (data) => {
      this.setState({ chatMessages: [...this.state.chatMessages, data] });
    });
    this.socket.on("user document", (data) => {
      this.setState({ chatMessages: [...this.state.chatMessages, data] });
    });
    this.socket.on("user audio", (data) => {
      this.setState({ chatMessages: [...this.state.chatMessages, data] });
    });
    this.socket.on("online message", (data) => {
      console.log("online message", data.online);
    });

    this.GetMsg2(Room_id);
  }

  Finger_print() {
    FingerprintScanner.authenticate({
      description: "Scan your fingerprint on the device scanner to continue",
    })
      .then(() => {
        ToastMsg("Authenticated successfully", "success");
        this.setState({ Activated: true });
        FingerprintScanner.release();
      })
      .catch((error) => {
        FingerprintScanner.release();
        ToastMsg(error.message, "danger");
      });
  }

  ClearChat() {
    let apiName = "clearallchat" + "/" + this.state.Room_id;
    services
      .delete(apiName)
      .then((response) => {
        console.log("clearallchat  Response --->", response);
        if (response.status === "Success") {
          this.setState({ chatMessages: [] });
          this.GetMsg();
          ToastMsg(response.message, "success");
        } else {
          ToastMsg(response.message, "danger");
        }
      })
      .catch((err) => console.log("Error is ", err));
  }

  bottomsheet() {
    this.setState({ isVisible: true });
  }
  bottomsheet_Att() {
    this.setState({ isVisible_Att: true });
  }

  onValueChangeCatH(value) {
    this.setState({ H_selectedcat: value });
  }
  onValueChangeCatM(value) {
    this.setState({ M_selectedcat: value });
  }
  onValueChangeCatS(value) {
    this.setState({ S_selectedcat: value });
  }

  async submitChatMessage() {
       let apiName = "storemsg";
    let parmeter = {
      sender_id: this.state.UserDetails.mobilenumber,
      //other_id: this.state.Other_Mo_id,
      senderName: this.state.UserDetails.name,
      msg: this.state.txtchatMessage,
      room_id: this.state.Room_id,
    };
    services
      .post(apiName, parmeter)
      .then((response) => {
        console.log("txtchatMessage  Response --->", response);
        if (response.message === "Store Message Successfully") {
          this.setState({ txtchatMessage: "" });
          this.setState({
            chatMessages: [...this.state.chatMessages, response.result],
          });
          this.socket.emit("message", response.result);
          // console.log("socket.emit.message--->", this.state.chatMessages);
        } else {
          ToastMsg(response.message, "danger");
        }
      })
      .catch((err) => console.log("Error is ", err));
  }

  GetMsg2(Room_id) {
    this.socket.emit("joinRoom", Room_id);
    let apiName = "getmsg" + "/" + Room_id;
    console.log("GetMsg1", this.state.chatMessages);
    services
      .get(apiName)
      .then((response) => {
        if (response.status === "Success") {
          this.setState({
            chatMessages: response.result,
          });
          console.log("GetMsg2", this.state.chatMessages);
        } else {
          ToastMsg(response.message, "danger");
        }
      })
      .catch((err) => console.log("Error is 2 ", err));
  }

  Att_ImageLibrary() {
    const options = {
      mediaType: "mixed",
    };

    launchImageLibrary(options, (response) => {
      console.log("response of image  2", response);
      // console.log('uri', response);
      if (response.assets) {
        this.setState({
          GalleryImg: response.assets[0],
          isVisible_Att: false,
        });
        this.Attachment_Upload();
      }
    });
  }

  Att_Camera() {
    const options = {
      noData: true,
      rotation: 360,
      // isVertical: true,
      // originalRotation: 0,
    };
    launchCamera(options, (response) => {
      console.log("response of image  2", response);
      // console.log('uri', response);
      if (response.assets) {
        this.setState({
          GalleryImg: response.assets[0],
          isVisible_Att: false,
        });
        this.Attachment_Upload();
      }
    });
  }

  Attachment_Upload = async () => {
    const ImgAtt = new FormData();
    // ImgAtt.append("other_id", this.state.Other_Mo_id);
    ImgAtt.append("sender_id", this.state.UserDetails.mobilenumber);
    ImgAtt.append("senderName", this.state.UserDetails.name);
    ImgAtt.append("gallery", {
      // uri: "file://" + this.state.GalleryImg.uri,
      uri:
        this.state.GalleryImg.type === undefined
          ? this.state.GalleryImg.uri
          : "file://" + this.state.GalleryImg.uri,

      name:
        this.state.GalleryImg.type === undefined
          ? "video.mp4"
          : this.state.GalleryImg.fileName,
      type:
        this.state.GalleryImg.type === undefined
          ? "video/mp4"
          : this.state.GalleryImg.type,
    });
    ImgAtt.append("message", this.state.txtchatMessage);
    ImgAtt.append("room_id", this.state.Room_id);

    let apiName = "imageandvidofileupload";

    services
      .post(apiName, ImgAtt, true)
      .then((response) => {
        console.log("Attachment_Upload_Response--> ", response);
        if (response.status === "Success") {
          this.socket.emit("user gallery", response.result);
          this.setState({
            chatMessages: [...this.state.chatMessages, response.result],
          });
          // ToastMsg("Attachment Update success", "success");
        } else {
          // ToastMsg(response.message, "danger");
        }
      })
      .catch((err) => console.log("Error is ", err));
  };

  async document_Upload() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log("DocumentPicker-->", res);
      this.Attachment_document_Upload(res);
      this.setState({ isVisible_Att: false });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  Attachment_document_Upload = async (res) => {
    const docAtt = new FormData();
    docAtt.append("sender_id", this.state.UserDetails.mobilenumber);
    docAtt.append("senderName", this.state.UserDetails.name);
    docAtt.append("document_file", {
      uri: res[0].fileCopyUri,
      name: res[0].name,
      type: res[0].type,
    });
    docAtt.append("message", this.state.txtchatMessage);
    docAtt.append("room_id", this.state.Room_id);

    let apiName = "documentfileupload";

    services
      .post(apiName, docAtt, true)
      .then((response) => {
        console.log("Attachment_Upload_Response--> ", response);
        if (response.status === "Success") {
          this.socket.emit("user document", response.result);
          this.setState({
            chatMessages: [...this.state.chatMessages, response.result],
          });
          // ToastMsg("Attachment document Update success", "success");
        } else {
          // ToastMsg(response.message, "danger");
        }
      })
      .catch((err) => console.log("Error is ", err));
  };

  async Audio_Upload() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      console.log("Adio DocumentPicker-->", res);
      this.Attachment_audio_Upload(res);
      this.setState({ isVisible_Att: false });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  Attachment_audio_Upload = async (res) => {
    const docAtt = new FormData();
    docAtt.append("sender_id", this.state.UserDetails.mobilenumber);
    docAtt.append("senderName", this.state.UserDetails.name);
    docAtt.append("audio", {
      uri: res[0].fileCopyUri,
      name: res[0].name,
      type: res[0].type,
    });
    docAtt.append("message", this.state.txtchatMessage);
    docAtt.append("room_id", this.state.Room_id);

    let apiName = "audiofileupload";

    services
      .post(apiName, docAtt, true)
      .then((response) => {
        console.log("Attachment_Upload_Response--> ", response);
        if (response.status === "Success") {
          this.socket.emit("user audio", response.result);
          this.setState({
            chatMessages: [...this.state.chatMessages, response.result],
          });
          //ToastMsg("Attachment document adio success", "success");
        } else {
          // ToastMsg(response.message, "danger");
        }
      })
      .catch((err) => console.log("Error is ", err));
  };

  renderItemIS = (item, index) => {
    const date = new Date(item.updatedAt);
    var hours = date.getHours() % 12;
    var minutes = date.getMinutes();
    const min = minutes < 10 ? "0" + minutes : minutes;
    const hrs = hours < 10 ? "0" + hours : hours;
    const ampm = hours <= 12 ? "pm" : "am";
    const time = hrs + ":" + min + " " + ampm;
    return (
      <View>
        { item.sender_id === this.state.UserDetails.mobilenumber ? (
          <View>
            {item.voice_recording === "" ? null : (
              <View style={styles.RightChat}>
                <View
                  style={{
                    flexDirection: "row",
                    height: dh * 0.075,
                    width: dw * 0.7,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* <Icons color={Com_color.txtyellow} name="headset" size={40} /> */}
                  <Image
                    source={Const_Images.Mic}
                    style={{ height: 40, width: 40 }}
                  />
                  <Text
                    style={{
                      fontSize: Com_font.txt18,
                      color: Com_color.chattxt,
                      margin: "3%",
                      fontWeight: "bold",
                    }}
                  >
                    {item.voice_recording}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: Com_font.txt14,
                    color: Com_color.labletxt2,
                    marginLeft: "5%",
                    marginBottom: "5%",
                  }}
                >
                  {time}
                </Text>
              </View>
            )}
            {item.audio === "" ? null : (
              <View style={styles.RightChat}>
                <View
                  style={{
                    flexDirection: "row",
                    height: dh * 0.075,
                    width: dw * 0.7,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icons color={Com_color.txtyellow} name="headset" size={40} />
                  <Text
                    style={{
                      fontSize: Com_font.txt18,
                      color: Com_color.chattxt,
                      margin: "3%",
                      fontWeight: "bold",
                    }}
                  >
                    {item.audio}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: Com_font.txt14,
                    color: Com_color.labletxt2,
                    marginLeft: "5%",
                    marginBottom: "5%",
                  }}
                >
                  {time}
                </Text>
              </View>
            )}
            {item.document === "" ? null : (
              <View style={styles.RightChat}>
                <View
                  style={{
                    flexDirection: "row",
                    height: dh * 0.075,
                    width: dw * 0.7,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icons color={"red"} name="document" size={40} />
                  <Text
                    style={{
                      fontSize: Com_font.txt18,
                      color: Com_color.chattxt,
                      margin: "3%",
                      fontWeight: "bold",
                    }}
                  >
                    {item?.document?.split(".")[1]}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: Com_font.txt14,
                    color: Com_color.labletxt2,
                    marginLeft: "5%",
                    marginBottom: "5%",
                  }}
                >
                  {time}
                </Text>
              </View>
            )}
            {item.video === "" ? null : (
              <View style={styles.RightChat}>
                <Video
                  source={{
                    uri:
                      "http://51.15.204.121/hiddenly/Hiddenly/Media/Hiddenly%20Images/Sent/" +
                      item.video,
                  }}
                  style={{
                    height: dh * 0.3,
                    width: dw * 0.7,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: "#fff",
                  }}
                  resizeMode={"cover"}
                  controls={true}
                  fullscreen={true}
                  paused={true}
                  fullscreenOrientation={"all"}
                  poster={item.video}
                  // posterResizeMode={"contain"}
                />
              </View>
            )}
            {item.image === "" ? null : (
              <View style={styles.RightChat}>
                <Image
                  source={{
                    uri:
                      "http://51.15.204.121/hiddenly/Hiddenly/Media/Hiddenly%20Images/Sent/" +
                      item.image,
                  }}
                  style={{
                    height: dh * 0.3,
                    width: dw * 0.7,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: "#fff",
                  }}
                />
                <Text
                  style={{
                    fontSize: Com_font.txt14,
                    color: Com_color.labletxt2,
                    marginLeft: "5%",
                    position: "absolute",
                    bottom: "5%",
                  }}
                >
                  {time}
                </Text>
              </View>
            )}
            {item.message === "" ? null : (
              <View style={styles.RightChat}>
                <Text
                  style={{
                    fontSize: Com_font.txt16,
                    color: Com_color.chattxt,
                    margin: "3%",
                  }}
                >
                  {item.message} {"\n"}
                  <Text
                    style={{
                      fontSize: Com_font.txt14,
                      color: Com_color.labletxt2,
                    }}
                  >
                    {time}
                  </Text>
                </Text>
              </View>
            )}
          </View>
        ) :(
          <View>
            {item.voice_recording === "" ? null : (
              <View style={styles.LeftChat}>
                <View
                  style={{
                    flexDirection: "row",
                    height: dh * 0.075,
                    width: dw * 0.7,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* <Icons color={Com_color.txtyellow} name="headset" size={40} /> */}
                  <Image
                    source={Const_Images.Mic}
                    style={{ height: 40, width: 40 }}
                  />
                  <Text
                    style={{
                      fontSize: Com_font.txt18,
                      color: Com_color.chattxt,
                      margin: "3%",
                      fontWeight: "bold",
                    }}
                  >
                    {item.voice_recording}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: Com_font.txt14,
                    color: Com_color.labletxt2,
                    marginLeft: "5%",
                    marginBottom: "5%",
                  }}
                >
                  {time}
                </Text>
              </View>
            )}
            {item.document === "" ? null : (
              <View style={styles.LeftChat}>
                <Text
                  style={{
                    fontSize: Com_font.txt16,
                    color: Com_color.chattxt,
                    margin: "3%",
                  }}
                >
                  {item?.document?.split(".")[1]} {"\n"}
                  <Text
                    style={{
                      fontSize: Com_font.txt14,
                      color: Com_color.labletxt2,
                    }}
                  >
                    {time}
                  </Text>
                </Text>
              </View>
            )}
            {item.video === "" ? null : (
              <View style={styles.LeftChat}>
                <Video
                  source={{
                    uri:
                      "http://51.15.204.121/hiddenly/Hiddenly/Media/Hiddenly%20Images/Sent/" +
                      item.video,
                  }}
                  style={{
                    height: dh * 0.3,
                    width: dw * 0.7,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: "#fff",
                  }}
                  resizeMode={"cover"}
                  controls={true}
                  fullscreen={true}
                  fullscreenOrientation={"all"}
                  poster={item.video}
                  // posterResizeMode={'contain'}
                />
              </View>
            )}
            {item.image === "" ? null : (
              <View style={styles.LeftChat}>
                <Image
                  source={{
                    uri:
                      "http://51.15.204.121/hiddenly/Hiddenly/Media/Hiddenly%20Images/Sent/" +
                      item.image,
                  }}
                  style={{
                    height: dh * 0.3,
                    width: dw * 0.7,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: "#fff",
                  }}
                />
                <Text
                  style={{
                    fontSize: Com_font.txt14,
                    color: Com_color.labletxt2,
                    marginLeft: "5%",
                    position: "absolute",
                    bottom: "5%",
                  }}
                >
                  {time}
                </Text>
              </View>
            )}
            {item.message === "" ? null : (
              <View style={styles.LeftChat}>
                <Text
                  style={{
                    fontSize: Com_font.txt16,
                    color: Com_color.chattxt,
                    margin: "5%",
                  }}
                >
                  {item.message}
                  {"\n"}
                  <Text
                    style={{
                      fontSize: Com_font.txt14,
                      color: Com_color.labletxt2,
                    }}
                  >
                    {time} -{" "}
                    {this.state.seen == false ? (
                      "Delivered"
                    ) : (
                      <Text
                        style={{
                          fontSize: Com_font.txt14,
                          color: "#118df0",
                        }}
                      >
                        Seen
                      </Text>
                    )}
                  </Text>
                </Text>
              </View>
            )}
          </View>
        ) }
       
      </View>
    );
  };

  GoBack() {
    this.state.screen === "CreateGroup"
      ? this.props.navigation.navigate("home")
      : this.props.navigation.goBack();
  }

  onStartRecord = async () => {
    const result = await audioRecorderPlayer.startRecorder(path);
    console.log("startRecorder->", result);

    audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.currentPosition,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      });
      console.log("startRecorder e->", e);
      return;
    });
  };

  onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    console.log("stopRecorder->", result);
    audioRecorderPlayer.removeRecordBackListener();
    // this.setState({
    //   recordSecs: 0,
    // });
    const AudioAtt = new FormData();
    AudioAtt.append("sender_id", this.state.UserDetails.mobilenumber);
    AudioAtt.append("senderName", this.state.UserDetails.name);
    AudioAtt.append("voice", {
      uri: result,
      name: "audio.m4a",
      type: "audio/m4a",
    });
    AudioAtt.append("message", this.state.txtchatMessage);
    AudioAtt.append("room_id", this.state.Room_id);

    let apiName = "livevoicerecording";

    services
      .post(apiName, AudioAtt, true)
      .then((response) => {
        console.log("Attachment_AudioAtt_Response--> ", response);
        if (response.status === "Success") {
          this.socket.emit("user audio", response.result);
          this.setState({
            chatMessages: [...this.state.chatMessages, response.result],
          });
          //ToastMsg("Attachment document Update success", "success");
        } else {
          //ToastMsg(response.message, "danger");
        }
      })
      .catch((err) => console.log("Error is ", err));
  };

  render() {
    const { Activated, ProfileName, isVisible } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={
            isVisible == true ? "rgba(0.5, 0.25, 0, 0.2)" : "transparent"
          }
          barStyle="dark-content"
        />
        {Activated != false ? (
          <View style={styles.toolmain}>
            <View style={styles.chatmain}>
              <Pressable onPress={() => this.GoBack()} style={styles.backIcon}>
                <IconBack name="keyboard-backspace" color="#3b3b3b" size={40} />
              </Pressable>
              <Image source={Const_Images.test} style={styles.proImg} />
              <View style={styles.txtmain}>
                <Text style={styles.usernametxt}>{ProfileName}</Text>
                <Text style={styles.onlinetxt}>online</Text>
              </View>
              <TouchableOpacity onPress={() => this.bottomsheet()}>
                <View style={{ alignItems: "center" }}>
                  <Image
                    source={Const_Images.Chat}
                    style={{ height: 20, width: 20 }}
                  />
                  <Text style={styles.labletxt}>Chat hiddenly</Text>
                </View>
              </TouchableOpacity>
              <CustomMenu
                navigation={this.props.navigation}
                onPress={() => this.ClearChat()}
              />
            </View>
          </View>
        ) : (
          <Toolbar navigation={this.props} />
        )}
        {Activated != false ? (
          <Container style={{ backgroundColor: "#fff", marginTop: "3%" }}>
            {/* <ImageBackground
              source={Const_Images.test}
              style={{height: '100%', width: '100%'}}> */}

            <ScrollView
              ref={(ref) => {
                this.scrollView = ref;
              }}
              onContentSizeChange={() =>
                this.scrollView.scrollToEnd({ animated: false })
              }
            >
              {/* {this.state.chatMessages === '' ? null : */}
              <View style={styles.chatmainview}>
                <FlatList
                  data={this.state.chatMessages}
                  renderItem={({ item, index }) =>
                    this.renderItemIS(item, index)
                  }
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
              {/* } */}
            </ScrollView>
            <View style={styles.footermainview}>
              <TouchableOpacity onPress={() => this.bottomsheet_Att()}>
                <Iconadd color={Com_color.txtblue} name="add" size={40} />
              </TouchableOpacity>
              <View style={styles.Brmainview}>
                <Iconsfooter
                  color={Com_color.labletxt2}
                  name="emotsmile"
                  size={25}
                />
                {/* <TextInput
                  style={styles.footertxt}
                  placeholder="Type a message"
                /> */}
                <TextInput
                  style={styles.footertxt}
                  placeholder="Type a message"
                  placeholderTextColor={Com_color.labletxt2}
                  autoCorrect={false}
                  value={this.state.txtchatMessage}
                  onChangeText={(txtchatMessage) => {
                    this.setState({ txtchatMessage });
                  }}
                />
                <Iconsfooter
                  color={Com_color.labletxt2}
                  name="location-pin"
                  size={25}
                />
              </View>
              {this.state.txtchatMessage == "" ? (
                <TouchableOpacity
                  onPressOut={() => this.onStopRecord()}
                  onLongPress={() => this.onStartRecord()}
                >
                  <Image
                    source={Const_Images.Mic}
                    style={{ height: 40, width: 40 }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => this.submitChatMessage()}>
                  <IconBack
                    color={Com_color.Btnblue}
                    name="send-circle"
                    size={40}
                  />
                </TouchableOpacity>
              )}
            </View>
            {/* </ImageBackground> */}
          </Container>
        ) : (
          <View>
            <Image style={styles.FingerImg} source={Const_Images.Finger} />
            <Text style={styles.welcometxt}>Use Fingerprint</Text>
            <Text style={styles.lable}>
              Use Your Fingerprint to Unlock the ChatRoom{" "}
            </Text>
          </View>
        )}

        <BottomSheet
          isVisible={this.state.isVisible}
          containerStyle={{
            backgroundColor: "rgba(0.5, 0.25, 0, 0.2)",
          }}
        >
          <View style={styles.BSmainview}>
            <View style={{ margin: "10%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.poplabletxt}>Chat Hiddenly</Text>
                <Iconclose
                  onPress={() => this.setState({ isVisible: false })}
                  name="close"
                  size={30}
                />
              </View>
              <Text style={styles.poplable}>
                Setting on this will make new messages disappear from this chat
                after time limit.
              </Text>

              {/* <DatePicker date={new Date()} mode={'time'} /> */}
              <View>
                <View style={{ flexDirection: "row" }}></View>
                <View style={styles.timemainview}>
                  <Text style={styles.timetxt}>hours</Text>
                  <Text style={styles.timetxt}>minutes</Text>
                  <Text style={styles.timetxt}>seconds</Text>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => alert("Set")}
                  style={styles.Btnview}
                >
                  <Text style={styles.Btntxt}>Set</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BottomSheet>

        <BottomSheet
          isVisible={this.state.isVisible_Att}
          containerStyle={{
            backgroundColor: "rgba(0.5, 0.25, 0, 0.2)",
          }}
        >
          <View style={styles.BSmainview2}>
            <View style={{ margin: "10%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.poplabletxt}>Attachment Hiddenly</Text>
                <Iconclose
                  onPress={() => this.setState({ isVisible_Att: false })}
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
                      <TouchableOpacity onPress={() => this.document_Upload()}>
                        <Icons
                          color={Com_color.txtblue}
                          name="document"
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.poplabletxt}>Document</Text>
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
                      <TouchableOpacity onPress={() => this.Att_Camera()}>
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
                      <TouchableOpacity onPress={() => this.Att_ImageLibrary()}>
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
                        backgroundColor: "gray",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity onPress={() => this.Audio_Upload()}>
                        <Icons
                          color={Com_color.txtblue}
                          name="headset"
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.poplabletxt}>Audio </Text>
                  </View>

                  <View style={{ alignItems: "center", width: "30%" }}>
                    <View style={styles.att_icon}>
                      <TouchableOpacity>
                        <Icons
                          color={Com_color.txtblue}
                          name="location"
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.poplabletxt}>Location</Text>
                  </View>

                  <View style={{ alignItems: "center", width: "30%" }}>
                    <View
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        backgroundColor: "plum",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity>
                        <Iconsfooter
                          color={Com_color.txtblue}
                          name="user"
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.poplabletxt}>Contact</Text>
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
  FingerImg: { width: 350, height: 350, alignSelf: "center", marginTop: "35%" },
  welcometxt: {
    fontSize: Com_font.txt20,
    alignSelf: "center",
    color: Com_color.labletxt,
    marginTop: "10%",
  },
  lable: {
    fontSize: Com_font.txt16,
    color: Com_color.lightlabletxt,
    textAlign: "center",
    margin: 40,
  },
  chatmainview: {
    marginTop: "2%",
    paddingHorizontal: "5%",
  },
  footermainview: {
    flexDirection: "row",
    height: dh * 0.07,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  Brmainview: {
    flexDirection: "row",
    width: dw * 0.75,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Const_Images.labletxt2,
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "75%",
    backgroundColor: "#fff",
  },
  footertxt: { width: dw * 0.55, color: "#000" },
  toolmain: {
    flexDirection: "row",
    marginTop: "13%",
    width: dw,
  },
  Icons: { marginLeft: "3%", bottom: "2%" },
  chatmain: { flexDirection: "row", alignItems: "center" },
  notifyImage: { width: 40, height: 40, marginLeft: "20%" },
  txtmain: { width: dw * 0.4, paddingLeft: "4%" },
  usernametxt: { fontSize: Com_font.txt16, color: Com_color.labletxt },
  onlinetxt: { fontSize: Com_font.txt16, color: "#67c781", fontWeight: "bold" },
  labletxt: {
    fontSize: Com_font.txt14,
    color: Com_color.labletxt,
    fontWeight: "bold",
  },
  backIcon: { marginHorizontal: "3%" },
  proImg: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  BSmainview: {
    height: dh * 0.5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  BSmainview2: {
    height: dh * 0.35,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  poplabletxt: {
    fontSize: Com_font.txt16,
    color: Com_color.labletxt,
    fontWeight: "bold",
  },
  poplable: {
    fontSize: Com_font.txt16,
    color: Com_color.lightlabletxt,
    textAlign: "center",
    marginVertical: "10%",
  },
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
  Icons2: { marginLeft: "17%" },
  itemStyle: {
    fontSize: 10,
    fontFamily: "Roboto-Regular",
    color: Com_color.labletxt,
  },
  pickerStyle: {
    width: "25%",
    height: 40,
    color: Com_color.labletxt,
    fontSize: Com_font.txt14,
    fontFamily: "Roboto-Regular",
  },
  textStyle: {
    fontSize: Com_font.txt14,
    fontFamily: "Roboto-Regular",
  },
  timemainview: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: "5%",
  },
  timetxt: { color: Com_color.labletxt2 },
  att_icon: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
  },
  RightChat: {
    maxWidth: dw * 0.7,
    backgroundColor: "#e9f0a1",
    borderRadius: 20,
    marginTop: "2%",
    alignSelf: "flex-end",
  },
  LeftChat: {
    maxWidth: dw * 0.7,
    backgroundColor: "#9ee8cd",
    borderRadius: 20,
    marginTop: "2%",
    alignSelf: "flex-start",
  },
};

export default GroupChat;
