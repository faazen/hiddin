import React, { PureComponent } from "react";
import {
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  View,
  ActivityIndicator,
  ImageBackground,
  Text,
} from "react-native";

import { DEVICE_HEIGHT as dh, DEVICE_WIDTH as dw } from "../../../utils";
import { Const_Images, Com_font, Com_color } from "../../../constants";
import AntIcon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");
const perspective = width;
const angle = Math.atan(perspective / (width / 20));
const ratio = Platform.OS === "ios" ? 2 : 1.2;

export default class Stories extends PureComponent {
  stories = [];
  state = {
    x: new Animated.Value(0),
  };

  constructor(props) {
    super(props);
    this.stories = props.stories.map(() => React.createRef());
  }

  async componentDidMount() {
    this.setState({ stories: this.props.stories });
    const { x } = this.state;
    await x.addListener(() =>
      this.stories.forEach((story, index) => {
        const offset = index * width;
        const inputRange = [offset - width, offset + width];
        const translateX = x
          .interpolate({
            inputRange,
            outputRange: [width / ratio, -width / ratio],
            extrapolate: "clamp",
          })
          .__getValue();

        const rotateY = x
          .interpolate({
            inputRange,
            outputRange: [`${angle}rad`, `-${angle}rad`],
            extrapolate: "clamp",
          })
          .__getValue();

        const parsed = parseFloat(
          rotateY.substr(0, rotateY.indexOf("rad")),
          10
        );
        const alpha = Math.abs(parsed);
        const gamma = angle - alpha;
        const beta = Math.PI - alpha - gamma;
        const w = width / 2 - ((width / 2) * Math.sin(gamma)) / Math.sin(beta);
        const translateX2 = parsed > 0 ? w : -w;

        const style = {
          transform: [
            { perspective },
            { translateX },
            { rotateY },
            { translateX: translateX2 },
          ],
        };
        story.current.setNativeProps({ style });
      })
    );
  }

  Viewers() {
    alert("ji");
  }

  render() {
    const { x, ready } = this.state;
    const { stories } = this.props;
    console.log("stories...", stories);

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        {stories
          .map((story, i) => (
            <Animated.View
              ref={this.stories[i]}
              style={StyleSheet.absoluteFill}
             // key={story.length}
            >
              <ImageBackground
                source={{
                  uri:
                    "http://51.15.204.121/hiddenly/Hiddenly/Media/status/" +
                    story.statusStory[0],
                }}
                style={{
                  width: "100%",
                  height: dh * 0.78,
                }}
                // resizeMode={"cover"}
                // blurRadius={100}
              />
              <TouchableOpacity onPress={() => this.Viewers(i)}>
                <View style={styles.footerView}>
                  <Text style={styles.footerTxt}>
                    Total views ( {story.viewers.length} )
                  </Text>
                  <AntIcon
                    onPress={() => alert("hi")}
                    name={"down"}
                    size={30}
                    color={"gray"}
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
          .reverse()}
        <Animated.ScrollView
          ref={this.scroll}
          style={StyleSheet.absoluteFillObject}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          snapToInterval={width}
          contentContainerStyle={{ width: width * stories.length }}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { x },
                },
              },
            ],
            { useNativeDriver: false }
          )}
          decelerationRate={0.5}
          horizontal
        />
      </View>
    );
  }
}
const styles = {
  footerView: {
    backgroundColor: "#fff",
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
