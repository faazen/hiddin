import { Container } from "native-base";
import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  Pressable,
  ImageBackground,
  ProgressViewIOSComponent,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Const_Images } from "../../constants";
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from "../../utils";

const CommonBgImg = (props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground style={styles.BgImg} source={Const_Images.Bg_Img}>
        {props.children}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default CommonBgImg;

const styles = {
  BgImg: { height: dh + StatusBar.currentHeight, width: dw },
};
