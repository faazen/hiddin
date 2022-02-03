import { Container } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import {
  Easing,
  View,
  Image,
  Text,
  Pressable,
  ImageBackground,
  Animated,
  SafeAreaView,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Const_Images, Com_font, Com_color } from "../../../constants";
import { DEVICE_HEIGHT as dh, DEVICE_WIDTH as dw } from "../../../utils";
import AntIcon from "react-native-vector-icons/AntDesign";
import Option from "react-native-vector-icons/SimpleLineIcons";
import { BottomSheet } from "react-native-elements";
import {
  Avatar,
  ListItem,
  Badge,
  Icon,
  withBadge,
} from "react-native-elements";
import Modal from "react-native-modalbox";
import services from "../../../services";
import ToastMsg from "../../../templates/ToastMessage";
import APP_STORE from "../../../storage";
import ProgressBar from "./ProgressBar";
import StoriesView from "./storiesView";
import const_images from "../../../constants/const_images";

const StoryContainer = (props) => {
  const { MyStatus_View } = props;
  console.log("MyStatus_View", MyStatus_View);

  const [isSubModelOpen, setModel] = useState(false);
  const [isVisible_BottomSheet, setBottomSheet] = useState(false);
  const [Stories, setstories] = useState(MyStatus_View);
  const scale = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);
  const [x, setx] = useState(new Animated.Value(0));

  const [isPause, setIsPause] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(6);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onLayoutAdded = (evt) => {
    setWidth(evt.width);
  };

  const ViewedMyStatus = () => {
    setModel(true);
  };

  const nextStory = () => {
    if (story.length - 1 > currentIndex) {
      setCurrentIndex(currentIndex + 1);
      setLoaded(false);
      setDuration(6);
    } else {
      setCurrentIndex(0);
      props.onStoryNext();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        hidden
        translucent={true}
        barStyle="dark-content"
        backgroundColor="transparent"
      />

      {/* ProgressBar */}

      <ProgressBar
        next={nextStory}
        isLoaded={isLoaded}
        duration={duration}
        pause={isPause}
        //isNewStory={props.isNewStory}
        stories={Stories}
        currentIndex={currentIndex}
        currentStory={Stories[currentIndex]}
        length={Stories}
        progress={{ _id: currentIndex }}
      />

      {/* <View
         // onLayout={(evt) => onLayoutAdded(evt.nativeEvent.layout)}
          style={styles.container}
        >
          <Animated.View
            style={[
              styles.container,
              {
                width: scale,
                backgroundColor: "green",
                position: "absolute",
                top: 0,
                margin: 0,
                borderRadius: 10,
              },
            ]}
          />
        </View> */}

      <View
        style={{
          flexDirection: "row",
          height: dh * 0.12,
          backgroundColor: Com_color.Black,
          alignItems: "center",
          paddingHorizontal: "3%",
          justifyContent: "space-between",
        }}
      >
        <Avatar
          rounded
          containerStyle={{ borderColor: Com_color.white, borderWidth: 2 }}
          source={{
            uri: "http://51.15.204.121/hiddenly/Hiddenly/Media/Profile_Img/profile_img_1633516101123.jpg",
          }}
          size={60}
        />
        <Text
          style={{
            fontSize: Com_font.txt20,
            color: Com_color.white,
            position: "absolute",
            left: "22%",
          }}
        >
          My Status
        </Text>
        <Option
          name="options-vertical"
          size={20}
          color={Com_color.white}
          onPress={() => alert("Option's")}
        />
      </View>

      {/* Status Image */}

      <View
        style={{
          width: "100%",
          height: dh * 0.78,
        }}
      >
        <StoriesView
        onImageLoaded={Stories}
         stories={Stories} 
         navigation={props.navigation} 
         />
      </View>
      <TouchableHighlight onPress={() => ViewedMyStatus()}>
        <View style={styles.footerView}>
          {/* <Text style={styles.footerTxt}>
            Total views ( {Stories[0].user_id} )
          </Text>
          <AntIcon name={"down"} size={30} color={"gray"} /> */}
        </View>
      </TouchableHighlight>
      <Modal
        style={{
          height: dh,
          width: dw,
          flex: 1,
        }}
        isOpen={isSubModelOpen}
        onClosed={() => setModel(false)}
        position="center"
        swipeToClose
        swipeArea={250}
        backButtonClose
        coverScreen={true}
      >
        <View style={{ flexDirection: "row", margin: "5%" }}>
          <AntIcon
            name={"arrowleft"}
            size={30}
            color={Com_color.Black}
            onPress={() => setModel(false)}
          />
          <Text style={[styles.footerTxt, { marginLeft: "5%" }]}>
            Total views (10)
          </Text>
        </View>
        <FlatList
          data={Stories}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => setBottomSheet(true)}>
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: "10%",
                  marginBottom: "2%",
                }}
              >
                <Avatar
                  rounded
                  source={const_images.Empty_Prof_Pic}
                  size={60}
                />
                <View style={{ alignSelf: "center", marginLeft: "5%" }}>
                  <Text
                    style={{ fontSize: Com_font.txt16, fontWeight: "bold" }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: Com_font.txt14,
                      color: Com_color.labletxt2,
                    }}
                  >
                    {item.viewed}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </Modal>
      <BottomSheet
        isVisible={isVisible_BottomSheet}
        containerStyle={{
          backgroundColor: "rgba(0.5, 0.25, 0, 0.2)",
        }}
      >
        <View
          style={{
            height: dh * 0.5,
            backgroundColor: Com_color.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View
            style={{
              margin: "5%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Avatar
              rounded
              containerStyle={{
                borderColor: Com_color.white,
                borderWidth: 2,
              }}
              source={Const_Images.test2}
              size={60}
            />
            <View
              style={{
                alignSelf: "center",
                position: "absolute",
                marginLeft: "20%",
              }}
            >
              <Text style={{ fontSize: Com_font.txt16, fontWeight: "bold" }}>
                Emre Yilmaz
              </Text>
              <Text
                style={{
                  fontSize: Com_font.txt14,
                  color: Com_color.labletxt2,
                }}
              >
                4 times
              </Text>
            </View>
            <AntIcon
              name="close"
              style={{ alignSelf: "center" }}
              size={30}
              color={Com_color.Black}
              onPress={() => setBottomSheet(false)}
            />
          </View>
          <FlatList
            data={Stories}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: "5%",
                  marginBottom: "5%",
                }}
              >
                <Text style={{ fontSize: Com_font.txt16, fontWeight: "bold" }}>
                  {item.date}
                </Text>
                <Text
                  style={{
                    fontSize: Com_font.txt14,
                    color: Com_color.labletxt2,
                    paddingLeft: "3%",
                  }}
                >
                  {item.time}
                </Text>
              </View>
            )}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default StoryContainer;

const styles = {
  container: {
    height: 4,
    backgroundColor: "green",
    marginHorizontal: 2,
  },
  footerView: {
    backgroundColor: "transparent",
    height: dh * 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "6%",
  },
  footerTxt: {
    fontSize: Com_font.txt20,
    color: Com_color.labletxt,
    fontWeight: "bold",
  },
};
