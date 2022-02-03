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
import const_images from "../../../constants/const_images";
import { TextInput } from "react-native-gesture-handler";

const StoryContainer_Others = (props) => {
  console.log("StoryContainer_Others", props);

  const { OtherStatus_View } = props;

  const [isSubModelOpen, setModel] = useState(false);
  const [isVisible_BottomSheet, setBottomSheet] = useState(false);
  const [Stories, setstories] = useState(OtherStatus_View);
  const scale = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);

  const onLayoutAdded = (evt) => {
    setWidth(evt.width);
  };

  const ViewedOtherStatus = () => {
    setBottomSheet(true);
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

      <ProgressBar />

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
          source={
            Stories[0].profile_img === ""
              ? const_images.Empty_Prof_Pic
              : {
                  uri:
                    "http://51.15.204.121/hiddenly/Hiddenly/Media/Profile_Img/" +
                    Stories[0].profile_img,
                }
          }
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
          {Stories[0].name}
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
        <FlatList
          data={Stories}
          // horizontal ={true}
          renderItem={({ item, index }) => (
            <View>
              <ImageBackground
                source={{
                  uri:
                    "http://51.15.204.121/hiddenly/Hiddenly/Media/status/" +
                    item.statusStory,
                }}
                style={{
                  width: "100%",
                  height: dh * 0.78,
                }}
                // resizeMode={"cover"}
                // blurRadius={100}
              />
            </View>
          )}
        />
      </View>
      <TouchableHighlight onPress={() => ViewedOtherStatus()}>
        <View style={styles.footerView}>
          <AntIcon name={"up"} size={30} color={"gray"} />
          <Text style={styles.footerTxt}>Reply</Text>
        </View>
      </TouchableHighlight>

      <BottomSheet
        isVisible={isVisible_BottomSheet}
        containerStyle={{
          backgroundColor: "rgba(0.5, 0.25, 0, 0.2)",
        }}
      >
        <View
          style={{
            height: dh * 0.25,
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
          <TextInput
            placeholder={"Type here ..."}
            style={{
              borderWidth: 1,
              borderRadius: 50,
              marginHorizontal: "10%",
              paddingLeft: 30,
            }}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default StoryContainer_Others;

const styles = {
  container: {
    height: 4,
    backgroundColor: "green",
    marginHorizontal: 2,
  },
  footerView: {
    backgroundColor: "#fff",
    height: dh * 0.1,
    alignItems: "center",
  },
  footerTxt: {
    fontSize: Com_font.txt20,
    color: Com_color.labletxt,
    fontWeight: "bold",
  },
};
