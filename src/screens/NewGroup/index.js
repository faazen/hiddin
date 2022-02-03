import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import services from "../../services";

import { DEVICE_HEIGHT as dh, DEVICE_WIDTH as dw } from "../../utils";
import { Const_Images, Com_color, Com_font } from "../../constants";
import ToastMsg from "../../templates/ToastMessage";

import IconBack from "react-native-vector-icons/MaterialCommunityIcons";

import Icons from "react-native-vector-icons/AntDesign";
import APP_STORE from "../../storage";

class NewGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchtext: "",
      RegContact: [],
    };
  }

  async componentDidMount() {
    const user = await APP_STORE.read();
    const R_Contact = user.RegContact;

    const RegContact = R_Contact.map((m, i) => {
      m.selected = false;
      return m;
    });
    console.log("Response getcontact---->", RegContact);
    this.setState({ RegContact: RegContact });
  }

  handle_Next() {
    const selectedContects = this.state.RegContact.filter((items) => {
      return items.selected === true;
    });
    console.log("selectedContects", selectedContects);
    this.props.navigation.navigate("creategroup", {
      Selected_Contacts: selectedContects,
    });
  }
  _selectedItem = (item) => {
    item.selected = !item.selected;
    const index = this.state.RegContact.findIndex(
      (d) => d.number == item.number
    );
    this.state.RegContact[index] = item;
    this.setState({ RegContact: this.state.RegContact });
  };

  SelectedtemIS = (item, index) => {
    return (
      <View>
        {item.selected === true ? (
          <View
            style={{ backgroundColor: "#fff", height: dh * 0.14, margin: 10 }}
          >
            <View style={{ width: 60, height: 60, justifyContent: "center" }}>
              <Icons
                onPress={() => this._selectedItem(item)}
                name="close"
                size={15}
                style={{ position: "absolute", right: 0, top: 0 }}
              />
              <Image source={Const_Images.profile} style={styles.proImg} />
            </View>
            <Text
              style={{ fontSize: Com_font.txt14, color: Com_color.labletxt2 }}
            >
              {item.name}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  RegContactsItems = (item, index) => {
    return (
      <TouchableOpacity onPress={() => this._selectedItem(item)}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: "5%",
          }}
        >
          <Image source={Const_Images.profile} style={styles.proImg} />
          <View style={{ width: dw * 0.6, marginLeft: "5%" }}>
            <Text
              style={{ color: Com_color.chattxt, fontSize: Com_font.txt16 }}
            >
              {item.name}
            </Text>
            <Text
              style={{
                color: Com_color.labletxt2,
                fontSize: Com_font.txt14,
                width: dw * 0.55,
              }}
              numberOfLines={1}
            >
              {item.mobilenumber}
            </Text>
          </View>
          {item.selected === true ? (
            <Icons
              name="checkcircle"
              color={"#32aa4e"}
              size={35}
              style={{ marginLeft: "5%" }}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { RegContact } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
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
            <IconBack name="keyboard-backspace" color="#3b3b3b" size={40} />
          </Pressable>
          <TextInput
            style={styles.TxtInput}
            placeholderTextColor={Com_color.labletxt2}
            placeholder="Search"
            value={this.state.searchtext}
            onChangeText={(text) => {
              this.setState({ searchtext: text });
            }}
          />
        </View>

        <View>
          <FlatList
            data={RegContact}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => this.SelectedtemIS(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <ScrollView>
          <FlatList
            data={RegContact}
            renderItem={({ item, index }) => this.RegContactsItems(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: "5%",
          }}
        >
          <TouchableOpacity onPress={() => this.handle_Next()}>
            <Image
              source={Const_Images.Ic_Next}
              style={{
                width: 70,
                height: 70,
                opacity: 1,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = {
  container: { flex: 1 },
  backIcon: { marginHorizontal: "3%" },
  TxtInput: { fontSize: Com_font.txt16, color: Com_color.Inputtxt },
  proImg: {
    borderRadius: 25,
    width: 50,
    height: 50,
    marginLeft: "5%",
  },
};

export default NewGroup;
