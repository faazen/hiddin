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
import { CheckBox } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
//import APP_STORE from '../../storage';
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from "../../utils";
import { Const_Images, Com_color, Com_font } from "../../constants";
import Toolbar from "../../templates/Toolbar";
import FingerprintScanner from "react-native-fingerprint-scanner";
import ToastMsg from "../../templates/ToastMessage";
import Iconadd from "react-native-vector-icons/MaterialIcons";
import Iconsfooter from "react-native-vector-icons/SimpleLineIcons";
import io from "socket.io-client";
import Video from "react-native-video";
import { BottomSheet } from "react-native-elements";
import CommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IconFeather from "react-native-vector-icons/Feather";
import AntDesignIcons from "react-native-vector-icons/AntDesign";
import DatePicker from "react-native-datepicker";
import moduleName from "moment";
import { Picker, Container, Content, Radio } from "native-base";
import services from "../../services";
import APP_STORE from "../../storage";

class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeline: false,
      groupNametxt: "",
      Room_id: "",
      Never: false,
      Textchecked: false,
      Voicechecked: false,
      Mediachecked: false,
      Documentschecked: false,
      Attachmentschecked: false,
      isVisible: false,
      date: new Date().getDate(),
      Selected_contact: [],
      H_selectedcat: "",
      M_selectedcat: "",
      AMPM_selectedcat: "",
    };
  }

  componentDidMount() {
    const S_contact = this.props.route.params.Selected_Contacts;
    this.setState({ Selected_contact: S_contact });
    console.log("Selected_contact tsfxsfsdfdg->", S_contact);
    // this.setState({
    //   Selected_contact: S_contact.map((items) => {
    //     return items.mobilenumber;
    //   }),
    // });
    this.socket = io("http://51.15.204.121:3000/");
  }

  onValueChangeCatH(value) {
    this.setState({ H_selectedcat: value });
  }
  onValueChangeCatM(value) {
    this.setState({ M_selectedcat: value });
  }
  onValueChangeCatS(value) {
    this.setState({ AMPM_selectedcat: value });
  }

  timelineHandle() {
    this.setState({
      timeline: !this.state.timeline,
      Never: false,
      isVisible: true,
    });
    if (this.state.timeline == true) {
      this.setState({ isVisible: false });
    }
  }

  SelectedtemIS = (item, index) => {
    return (
      <View style={{ margin: 10 }}>
        <View style={{ width: 60, height: 60, justifyContent: "center" }}>
          {/* <AntDesignIcons
            onPress={() => alert("")}
            name="close"
            size={15}
            style={{ position: "absolute", right: 0, top: 0 }}
          /> */}
          <Image source={Const_Images.profile} style={styles.proImg} />
        </View>
        <Text style={{ fontSize: Com_font.txt14, color: Com_color.labletxt2 }}>
          {item.name}
        </Text>
      </View>
    );
  };

  async handle_CreateGroup() {
    const user = await APP_STORE.read();

    this.setState({ UserDetails: user });
    const Usernamenumber = {
      name: user.name,
      number: user.mobilenumber,
      selected: true,
    };
    const joiningGroup = [...this.state.Selected_contact, Usernamenumber];
    let apiName = "creategroup";
    let parmeter = {
      groupName: this.state.groupNametxt,
      joining_group: joiningGroup,
      user_id: this.state.UserDetails.mobilenumber,
    };
    services
      .post(apiName, parmeter)
      .then((response) => {
        console.log("Response ", response);
        if (response.status === "Success") {
          console.log(response.response.room_id);
          //this.setState({ Room_id: response.response.room_id });
          this.props.navigation.navigate("groupchat", {
            CreateGroupData: response.response,
            screenName: "CreateGroup",
          });
          this.socket.emit("joinRoom", response.response.room_id);
          // this.GetMsg();
          ToastMsg(response.message, "success");
        } else {
          ToastMsg(response.message, "danger");
        }
      })
      .catch((err) => console.log("Error is ", err));
  }

  render() {
    const {
      Selected_contact,
      isVisible,
      timeline,
      Never,
      Textchecked,
      Voicechecked,
      Mediachecked,
      Documentschecked,
      Attachmentschecked,
    } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={
            isVisible == true ? "rgba(0.5, 0.25, 0, 0.2)" : "transparent"
          }
          barStyle="dark-content"
        />
        <View
          style={{
            marginTop: "10%",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => this.props.navigation.goBack()}
            style={styles.backIcon}
          >
            <CommunityIcons
              name="keyboard-backspace"
              color="#3b3b3b"
              size={40}
            />
          </Pressable>
          <Text style={styles.Labletxt}>New group</Text>
        </View>

        <ScrollView>
          <View style={styles.profileview}>
            <Image
              source={Const_Images.Empty_Prof_Pic}
              style={styles.ProfilePic}
            />
            <TextInput
              placeholder={"Add group titlle here"}
              placeholderTextColor={Com_color.labletxt2}
              style={styles.groupname}
              value={this.state.groupNametxt}
              onChangeText={(groupNametxt) => {
                this.setState({ groupNametxt });
              }}
            />
          </View>
          <View style={{ backgroundColor: "#fff", height: dh * 0.14 }}>
            <FlatList
              data={Selected_contact}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => this.SelectedtemIS(item, index)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View style={styles.submainview}>
            <Text style={styles.Labletxt}>Auto deleting group </Text>
            <View style={{ flexDirection: "row", marginTop: "3%" }}>
              <CommunityIcons
                onPress={() => this.timelineHandle()}
                name={timeline == true ? "radiobox-marked" : "radiobox-blank"}
                size={25}
                color={"#003399"}
              />
              <View style={{ marginLeft: "3%" }}>
                <Text style={styles.radiotxt}>Timeline Set for Deleting</Text>
                <Text style={styles.radiotxt2}>
                  You can set your time for deleting automatically
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <CommunityIcons
                onPress={() =>
                  this.setState({ Never: !Never, timeline: false })
                }
                name={Never == true ? "radiobox-marked" : "radiobox-blank"}
                size={25}
                color={"#003399"}
              />
              <Text style={[styles.radiotxt, { marginLeft: "3%" }]}>Never</Text>
            </View>
          </View>

          <View style={[styles.submainview, { marginTop: "10%" }]}>
            <Text style={styles.Labletxt}>Content customisation</Text>

            <View style={styles.checkview}>
              <TouchableOpacity
                onPress={() => this.setState({ Textchecked: !Textchecked })}
              >
                <Image
                  source={
                    Textchecked == true
                      ? Const_Images.Checkbox_Active
                      : Const_Images.Checkbox_Normal
                  }
                  style={styles.checkboxview}
                />
              </TouchableOpacity>
              <Text style={styles.checktxt}>Text</Text>
            </View>
            <View style={styles.checkview}>
              <TouchableOpacity
                onPress={() => this.setState({ Voicechecked: !Voicechecked })}
              >
                <Image
                  source={
                    Voicechecked == true
                      ? Const_Images.Checkbox_Active
                      : Const_Images.Checkbox_Normal
                  }
                  style={styles.checkboxview}
                />
              </TouchableOpacity>
              <Text style={styles.checktxt}>Voice</Text>
            </View>
            <View style={styles.checkview}>
              <TouchableOpacity
                onPress={() => this.setState({ Mediachecked: !Mediachecked })}
              >
                <Image
                  source={
                    Mediachecked == true
                      ? Const_Images.Checkbox_Active
                      : Const_Images.Checkbox_Normal
                  }
                  style={styles.checkboxview}
                />
              </TouchableOpacity>
              <Text style={styles.checktxt}>
                Media{" "}
                <Text
                  style={{
                    color: Com_color.labletxt2,
                    fontSize: Com_font.txt16,
                  }}
                >
                  (Image, video & GIF)
                </Text>
              </Text>
            </View>
            <View style={styles.checkview}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({ Documentschecked: !Documentschecked })
                }
              >
                <Image
                  source={
                    Documentschecked == true
                      ? Const_Images.Checkbox_Active
                      : Const_Images.Checkbox_Normal
                  }
                  style={styles.checkboxview}
                />
              </TouchableOpacity>
              <Text style={styles.checktxt}>Documents</Text>
            </View>
            <View style={styles.checkview}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({ Attachmentschecked: !Attachmentschecked })
                }
              >
                <Image
                  source={
                    Attachmentschecked == true
                      ? Const_Images.Checkbox_Active
                      : Const_Images.Checkbox_Normal
                  }
                  style={styles.checkboxview}
                />
              </TouchableOpacity>
              <Text style={styles.checktxt}>Attachments</Text>
            </View>
            <View style={styles.subview}>
              <TouchableOpacity
                style={styles.Btnview}
                onPress={() => this.handle_CreateGroup()}
              >
                <Text style={styles.Btntxt}>Create Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

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
                <Text style={styles.poplabletxt}>Auto deleting group at</Text>
                <AntDesignIcons
                  onPress={() => this.setState({ isVisible: false })}
                  name="close"
                  size={30}
                />
              </View>
              <View style={styles.calenderview}>
                {/* <Text>31 - Jun - 2021</Text>
                <IconFeather
                  name={'calendar'}
                  size={30}
                  style={{position: 'absolute', right: 0}}
                /> */}

                <DatePicker
                  style={{ width: dw * 0.7 }}
                  date={this.state.date}
                  mode="date"
                  // showIcon={false}
                  placeholder="select date"
                  format="DD - MMM - YYYY"
                  minDate={new Date().getDate()}
                  // maxDate="2016-06-01"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  iconComponent={
                    <IconFeather
                      name={"calendar"}
                      size={30}
                      style={{ position: "absolute", right: 0 }}
                    />
                  }
                  customStyles={{
                    dateInput: {
                      borderColor: "#fff",
                      position: "absolute",
                      left: 0,
                    },
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => {
                    this.setState({ date: date });
                  }}
                />
              </View>

              <View>
                <View style={{ flexDirection: "row" }}></View>
                <View style={styles.timemainview}>
                  <Text style={styles.timetxt}>hours</Text>
                  <Text style={[styles.timetxt, { marginLeft: "24%" }]}>
                    minutes
                  </Text>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => alert("Set")}
                  style={styles.Btnview2}
                >
                  <Text style={styles.Btntxt}>Set</Text>
                </TouchableOpacity>
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
  backIcon: { marginHorizontal: "3%" },
  profileview: { flexDirection: "row", margin: "5%" },
  ProfilePic: { height: 60, width: 60, borderRadius: 30 },
  groupname: {
    borderBottomWidth: 1,
    borderColor: Com_color.labletxt2,
    width: dw * 0.7,
    alignSelf: "center",
    marginLeft: "3%",
    color: "#000000",
  },
  proImg: {
    borderRadius: 25,
    width: 50,
    height: 50,
    marginLeft: "5%",
  },
  Labletxt: {
    color: Com_color.Inputtxt,
    fontSize: Com_font.txt16,
    fontWeight: "bold",
  },
  radiotxt: { color: Com_color.chattxt, fontSize: Com_font.txt16 },
  checktxt: {
    color: Com_color.chattxt,
    fontSize: Com_font.txt16,
    // fontWeight:'bold',
    marginLeft: "3%",
  },
  radiotxt2: { color: Com_color.labletxt2, fontSize: Com_font.txt14 },
  submainview: {
    marginHorizontal: "7%",
  },
  checkview: { flexDirection: "row", marginTop: "3%", alignItems: "center" },
  checkboxview: { height: 20, width: 20 },
  Btnview: {
    height: 50,
    borderRadius: 5,
    backgroundColor: Com_color.Btnblue,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "25%",
  },

  BSmainview: {
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
  Btnview2: {
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
    marginVertical: "5%",
  },
  timetxt: { color: Com_color.labletxt2 },
  calenderview: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: "20%",
    marginLeft: "7%",
  },
};

export default CreateGroup;
