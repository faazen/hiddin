import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Animated } from "react-native";

export default class ProgressBar extends Component {
  state = {
    progressStatus: 0,
  };
  anim = new Animated.Value(0);
  componentDidMount() {
    this.onAnimate();
  }
  onAnimate = () => {
    this.anim.addListener(({ value }) => {
      this.setState({ progressStatus: parseInt(value, 10) });
    });
    Animated.timing(this.anim, {
      toValue: 100,
      duration: 30000,
    }).start();
  };
  render() {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.inner, { width: this.state.progressStatus + "%" }]}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 4,
    borderRadius: 30,
    justifyContent: "center",
  },
  inner: {
    width: "100%",
    height: 4,
    borderRadius: 30,
    backgroundColor: "green",

  },
});
