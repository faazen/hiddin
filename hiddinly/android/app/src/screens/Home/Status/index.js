import React, { useRef, useEffect, Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  TouchableHighlight,
  TouchableHighlightBase,
} from "react-native";
import APP_STORE from "../../../storage";
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from "../../../utils";
import { Const_Images, Com_color, Com_font } from "../../../constants";
import { Avatar, Badge, Icon, withBadge } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import Story from "react-native-story";
import ImagePicker from "react-native-image-crop-picker";
import Modal from "react-native-modalbox";
import StoryContainerView from "../Status/StoryContainer";
import StoryContainer_Others from "../Status/StoryContainer_Others";
import Icons from "react-native-vector-icons/Ionicons";
import services from "../../../services";
import ToastMsg from "../../../templates/ToastMessage";

//const modalScroll = useRef(null);

class Status extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen_My: false,
      isModalOpen_Other: false,
      orderedStories: null,
      selectedStory: null,
      currentUserIndex: 0,
      Others_stories: "",
      LastAdded_MyStory_Img: "",
      MyStatus_stories: "",
      OtherStatus_View:''
    };
    this.modalScroll = null;
    //  this.modalScroll = React.createRef(null);
  }

  componentDidMount() {
    this.getstatusstory();
  }

  async getstatusstory() {
    const user = await APP_STORE.read();
    const user_id = user.mobilenumber;

    let apiName = "getstatusstory/" + user_id;
    services
      .get(apiName)
      .then((response) => {
        console.log("getstatusstory----> ", response);
        if (response.status === "Success") {
          const LastAdded_MyStory_Img = response.mystatus.slice(-1);

          this.setState({
            Others_stories: response.otherStatus,
            MyStatus_stories: response.mystatus,
            LastAdded_MyStory_Img: LastAdded_MyStory_Img[0].statusStory[0],
          });
        } else {
          ToastMsg(response.message, "danger");
        }
      })
      .catch((err) => console.log("Error is ", err));
  }

  handle_Mystatus() {
    this.setState({ isModalOpen_My: true });
  }

  handle_OtherStatus(item) {
    this.setState({ isModalOpen_Other: true, OtherStatus_View: item });
   // console.log("item",item);
  }

  onStoryClose = () => {
    this.setState({ isModelOpen: false });
  };

  CreatMyStatus() {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      this.createStatusStory(image);
    });
  }

  onStoryNext = (isScroll) => {
    const newIndex = this.state.currentUserIndex + 1;
    if (this.state.stories.length - 1 > this.state.currentUserIndex) {
      this.setState({ currentUserIndex: newIndex });
      // if (!isScroll) {
      //   // this.modalScroll.current.scrollTo(newIndex, true);
      //   console.log("modalScroll", this.modalScroll);
      // }
    } else {
      this.setState({ isModelOpen: false });
    }
  };

  onStoryPrevious = (isScroll) => {
    const newIndex = this.state.currentUserIndex - 1;
    if (this.state.currentUserIndex > 0) {
      this.setState({ currentUserIndex: newIndex });
      // if (!isScroll) {
      //   // this.modalScroll.current.scrollTo(newIndex, true);
      // }
    }
  };

  async createStatusStory(image) {
    //console.log('image',image.path.split('/')[11]);

    const user = await APP_STORE.read();
    const user_id = user.mobilenumber;

    const MyStory = new FormData();

    MyStory.append("status", {
      uri: image.path,
      name: image.path.split("/")[11],
      type: image.mime,
    });

    let apiName = "createStatusStory/" + user_id;

    services
      .post(apiName, MyStory, true)
      .then((response) => {
        console.log("Response ", response);
        if (response.status === "Success") {
          this.getstatusstory()
          ToastMsg("Uploaded Successfull", "success");
        } else {
          ToastMsg(response.message, "danger");
        }
      })
      .catch((err) => console.log("Error is ", err));
  }

  StatusItemIS = (item, index) => {
    const date = new Date(item[0].updatedAt);
    var hours = date.getHours() % 12;
    var minutes = date.getMinutes();
    const min = minutes < 10 ? "0" + minutes : minutes;
    const hrs = hours < 10 ? "0" + hours : hours;
    const ampm = hours <= 12 ? "pm" : "am";
    const time = hrs + ":" + min + " " + ampm;
    return (
      <TouchableHighlight
        underlayColor="#DDDDDD"
        onPress={() => this.handle_OtherStatus(item)}
      >
        <View style={styles.otherdpview}>
          <Avatar
            rounded
            containerStyle={{ borderColor: "green", borderWidth: 4 }}
            source={
              //Const_Images.test
              item === "" || item === undefined
                ? Const_Images.Empty_Prof_Pic
                : {
                    uri:
                      "http://51.15.204.121/hiddenly/Hiddenly/Media/status/" +
                      item[0].statusStory[0],
                  }
            }
            size={60}
          />
          <View style={{ marginLeft: "5%" }}>
            <Text style={styles.lable1}>{item[0].name}</Text>

            <Text numberOfLines={1} style={styles.lable2}>
              {time}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const { footerComponent, unPressedBorderColor, pressedBorderColor } =
      this.props;
    const {
      Others_stories,
      isModalOpen_My,
      isModalOpen_Other,
      orderedStories,
      selectedStory,
    } = this.state;
    return (
      <View style={styles.container}>
        <TouchableHighlight
          underlayColor="#DDDDDD"
          onPress={() => this.handle_Mystatus("user")}
        >
          <View style={styles.mydpview}>
            <View>
              <Avatar
                rounded
                source={
                  this.state.LastAdded_MyStory_Img === ""
                    ? Const_Images.Empty_Prof_Pic
                    : {
                        uri:
                          "http://51.15.204.121/hiddenly/Hiddenly/Media/status/" +
                          this.state.LastAdded_MyStory_Img,
                      }
                }
                size={60}
              />
              <Image source={Const_Images.Add_status} style={styles.addIcon} />
            </View>
            <View style={{ marginLeft: "5%" }}>
              <Text style={styles.lable1}>My Status</Text>
              <Text style={styles.lable2}>Tap to add status</Text>
            </View>
          </View>
        </TouchableHighlight>
        <View style={styles.seenview}>
          <Text style={[styles.lable1, { marginLeft: "5%" }]}>Unseen</Text>
        </View>
        <FlatList
          data={Others_stories}
          renderItem={({ item, index }) => this.StatusItemIS(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
        <Modal
          style={{
            height: dh,
            width: dw,
            flex: 1,
          }}
          isOpen={isModalOpen_My}
          onClosed={() => this.setState({ isModalOpen_My: false })}
          position="center"
          swipeToClose
          swipeArea={250}
          backButtonClose
          coverScreen={true}
        >
          {/* {stories.length > 0 &&
            stories.map((item, index) => ( */}
          <StoryContainerView
            ref={(ref) => (this.modalScroll = ref)}
            // key={index.toString()}
            //      onClose={this.onStoryClose()}
            //    onStoryNext={this.onStoryNext()}
            //     onStoryPrevious={this.onStoryPrevious()}
            MyStatus_View={this.state.MyStatus_stories}
            // isNewStory={index !== this.state.currentUserIndex}
            navigation={this.props.navigation}
          />
          {/* ))} */}
        </Modal>

        <Modal
          style={{
            height: dh,
            width: dw,
            flex: 1,
          }}
          isOpen={isModalOpen_Other}
          onClosed={() => this.setState({ isModalOpen_Other: false })}
          position="center"
          swipeToClose
          swipeArea={250}
          backButtonClose
          coverScreen={true}
        >
          {/* {stories.length > 0 &&
            stories.map((item, index) => ( */}
          <StoryContainer_Others
            ref={(ref) => (this.modalScroll = ref)}
            // key={index.toString()}
            //      onClose={this.onStoryClose()}
            //    onStoryNext={this.onStoryNext()}
            //     onStoryPrevious={this.onStoryPrevious()}
            OtherStatus_View={this.state.OtherStatus_View}
            // isNewStory={index !== this.state.currentUserIndex}
            navigation={this.props.navigation}
          />
          {/* ))} */}
        </Modal>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            margin: "5%",
            right: 0,
            height: 10,
            width: 10,
            backgroundColor: "green",
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icons
            onPress={() => this.CreatMyStatus()}
            color={Com_color.txtblue}
            name="camera"
            size={30}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  container: { flex: 1 },
  mydpview: { flexDirection: "row", margin: "5%", alignItems: "center" },
  otherdpview: {
    flexDirection: "row",
    marginLeft: "5%",
    alignItems: "center",
    marginVertical: "2%",
  },
  ProfileImg: { height: 60, width: 60, borderRadius: 30 },
  addIcon: {
    height: 40,
    width: 40,
    position: "absolute",
    bottom: -10,
    right: -10,
  },
  lable1: {
    color: Com_color.chattxt,
    fontWeight: "bold",
    fontSize: Com_font.txt16,
  },
  lable2: {
    color: Com_color.labletxt2,
    fontSize: Com_font.txt14,
    width: dw * 0.7,
  },
  seenview: {
    height: "5%",
    width: dw,
    backgroundColor: "#efefef",
    justifyContent: "center",
  },
};

export default Status;
