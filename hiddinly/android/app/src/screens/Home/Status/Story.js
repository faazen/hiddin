/* eslint-disable react/no-unused-prop-types */
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  StatusBar,
  ImageBackground,
  Text,
  Animated,
} from "react-native";
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from "../../../utils";

// import Image from 'react-native-scalable-image';
import PropTypes from "prop-types";
import { Const_Images } from "../../../constants";


const Story = (props) => {
  const { story } = props;
  const { pic } = story || {};
  const { Events, HashTag } = story;
  const { transforms, imgSketch, imgSticker, imgText, GPlaces } = Events || {};
  const imgWidth = Events ? Events.width : null ;
  const imgHeight = Events ? Events.height : null ;
  /**@MainImage */
  const scale = transforms && transforms.scale ? transforms.scale : 1;
  const rValue = transforms && transforms.rotate ? transforms.rotate : 0;
  const tValue = transforms && transforms.tilt ? transforms.tilt : 0;
  let rotate = new Animated.Value(rValue);
  const rStr = rotate.interpolate({
    inputRange: [-100, 100],
    outputRange: ["-100rad", "100rad"],
  });
  let tilt = new Animated.Value(tValue);
  const tStr = tilt.interpolate({
    inputRange: [-501, -500, 0, 1],
    outputRange: ["1rad", "1rad", "0rad", "0rad"],
  });

  /**@Sketch */
  const SketchData = imgSketch ? imgSketch : [];

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        {/* {!props.isLoaded && (
      <View style={styles.loading}>
        <ActivityIndicator color="white" />
      </View>
      )} */}
        <ImageBackground
          source={Const_Images.test2}
          style={{ width: "100%", height: "100%" }}
          resizeMode={"cover"}
          blurRadius={100}
        />

        <View style={{ ...StyleSheet.absoluteFillObject }}>
          <View
            style={{
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Animated.Image
              source={Const_Images.test2}
              onLoadEnd={props.onImageLoaded}
              style={[
                styles.content,
                {
                  aspectRatio: imgWidth > imgHeight ? 2 / 3 : 3 / 2,
                  transform: [
                    { perspective: 200 },
                    { scale: scale },
                    { rotate: rStr },
                    { rotateX: tStr },
                  ],
                },
              ]}
              resizeMode="contain"
            />
          </View>
        </View>
            
           </View>
    </View>
  );
};

Story.propTypes = {
  story: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dw,
    height: dh,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: dw,
    height: dh,
  },
  imageContent: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  loading: {
    backgroundColor: "black",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Story;
