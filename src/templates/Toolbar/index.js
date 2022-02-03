import React, { useState } from "react";
import { View, Image, Text, Pressable, TouchableOpacity } from "react-native";
import { Com_color, Com_font, Const_Images } from "../../constants";
import { DEVICE_WIDTH as dw, deviceHeight as dh } from "../../utils";
import IconBack from "react-native-vector-icons/MaterialCommunityIcons";
import IconDot from "react-native-vector-icons/Entypo";

const NavigationBar = ({
  navigation,
  centerTitle,
  screen,
  CoName,
  image,
  props,
}) => {
  return (
    <View style={styles.mainContainer}>
      <Pressable
        onPress={() => navigation.navigation.goBack()}
        style={styles.backIcon}
      >
        <Image style={styles.notifyImage} source={Const_Images.GoBack} />
      </Pressable>
    </View>
  );
};

export default NavigationBar;

const styles = {
  mainContainer: {
    flexDirection: "row",
    marginTop: "13%",
    width: dw,
    position: "absolute",
  },
  backIcon: { marginHorizontal: "3%" },
  notifyImage: { width: 40, height: 40, marginLeft: "20%" },
};
