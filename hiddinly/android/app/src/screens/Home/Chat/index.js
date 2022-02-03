import React, { useEffect, Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Text,
  TextInput,
  ScrollView,
  AppState,
} from "react-native";
//import APP_STORE from '../../storage';
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from "../../../utils";
import { Const_Images, Com_color, Com_font } from "../../../constants";
import FingerprintScanner from "react-native-fingerprint-scanner";
import ToastMsg from "../../../templates/ToastMessage";
import Iconcheck from "react-native-vector-icons/Ionicons";
import { Badge } from "native-base";
import { FlatList } from "react-native-gesture-handler";
import APP_STORE from "../../../storage";
import services from "../../../services";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Activated: false,
      Chat_History: [],
    };
  }

  componentDidMount() {
    this.handle_Fingerprint();
    this.GetDatas();
  }

  handle_Fingerprint() {
    FingerprintScanner.authenticate({
      description: "Scan your fingerprint on the device scanner to continue",
    })
      .then(() => {
        ToastMsg("Authenticated successfully", "success");
        this.setState({ Activated: true });
        FingerprintScanner.release();
      })
      .catch((error) => {
        ToastMsg(error.message, "danger");
        FingerprintScanner.release();
        //  this.handle_Fingerprint()
      });
  }

  async GetDatas() {
    let user = await APP_STORE.read();
    let apiName = "filteringgroup" + "/" + user.mobilenumber;
    services
      .get(apiName)
      .then((response) => {
        console.log("GetGroup  chatMessages----> ", [
          ...response.group,
          ...response.onetoonechat,
        ]);
        if (response.status === "Success") {
          this.setState({
            Chat_History: [...response.group, ...response.onetoonechat],
          });
        } else {
          ToastMsg(response.message, "danger");
        }
      })
      .catch((err) => console.log("Error is ", err));
  }

  handle_chatroom(index) {
    console.log(this.state.Chat_History[index]);
    const userName = this.state.Chat_History[index];
    this.props.navigation.navigate("groupchat", {
      groupData: userName,
      screenName2: "chat",
    });
  }

  renderItemIS = (item, index) => {
    return (
      <TouchableOpacity onPress={() => this.handle_chatroom(index)}>
        <View style={styles.listmainview}>
          <Image
            source={
              item.profile_img === "" || item.group_profile_img === ""
                ? Const_Images.Empty_Prof_Pic
                : item.profile_img != ""
                ? {
                    uri:
                      "http://51.15.204.121/hiddenly/Hiddenly/Media/Profile_Img/" +
                      item.profile_img,
                  }
                : null || item.group_profile_img !== ""
                ? {
                    uri:
                      "http://51.15.204.121/hiddenly/Hiddenly/Media/Profile_Img/" +
                      item.group_profile_img,
                  }
                : null
            }
            style={styles.proImg}
          />
          <View style={{ width: dw * 0.6 }}>
            <Text numberOfLines={1} style={styles.PFtxt}>
              {item.groupName == undefined ? item.name : item.groupName} .{" "}
              {"4d ago"}
            </Text>
            <Text numberOfLines={1} style={styles.PFtxt2}>
              {item.about === ""
                ? "Hey there! I am using Hiddenly"
                : item.about}
            </Text>
          </View>
          <Iconcheck
            style={{ marginTop: "5%", right: "30%" }}
            color={
              item.groupName == undefined
                ? true
                : false == true
                ? "#118df0"
                : "#a9a9b0"
            }
            name="md-checkmark-done-outline"
            size={20}
          />
          <View style={{ width: dw * 0.05 }}>
            {/* {item.groupName == undefined ? (
              true
            ) : false != false ? ( */}
            <Badge style={styles.Bgeview}>
              <Text style={styles.Bgetxt}>{"2"}</Text>
            </Badge>
            {/* ) : null} */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { Activated, Chat_History } = this.state;
    return (
      <View style={styles.container}>
        {Activated != false ? (
          <View style={{ marginTop: "5%" }}>
            <FlatList
              data={Chat_History}
              renderItem={({ item, index }) => this.renderItemIS(item, index)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : (
          <View>
            <Image style={styles.FingerImg} source={Const_Images.Finger} />
            <Text style={styles.welcometxt}>Use Fingerprint</Text>
            <Text style={styles.lable}>
              Use Your Fingerprint to Unlock the Chat{" "}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = {
  container: { flex: 1 },
  FingerImg: { width: 350, height: 350, alignSelf: "center", marginTop: "10%" },
  welcometxt: {
    fontSize: Com_font.txt20,
    alignSelf: "center",
    color: Com_color.labletxt,
    marginTop: "10%",
  },
  mainview: { margin: 40 },
  lable: {
    fontSize: Com_font.txt16,
    color: Com_color.lightlabletxt,
    textAlign: "center",
    margin: 40,
  },
  listmainview: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: dw,
    height: dh * 0.1,
  },
  proImg: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  PFtxt: {
    width: dw * 0.6,
    fontSize: Com_font.txt14,
    color: Com_color.labletxt2,
    fontWeight: "bold",
  },
  PFtxt2: {
    width: dw * 0.6,
    fontSize: Com_font.txt14,
    color: Com_color.labletxt,
    fontWeight: "bold",
  },
  Bgeview: {
    height: 25,
    width: 25,
    alignItems: "center",
    backgroundColor: "#32aa4e",
    alignSelf: "center",
  },
  Bgetxt: {
    color: "#fff",
  },
};
export default Chat;
