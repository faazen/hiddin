import React, { Component } from "react";
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  Linking,
} from "react-native";
import Contacts from "react-native-contacts";

import ListItem from "./ListItem";
import Avatar from "./Avatar";
//import SearchBar from "./SearchBar";
import { SearchBar } from "react-native-elements";

import { Const_Images, Com_color, Com_font } from "../../../constants";
import FingerprintScanner from "react-native-fingerprint-scanner";
import ToastMsg from "../../../templates/ToastMessage";

import services from "../../../services";
import APP_STORE from "../../../storage";
import { FlatList } from "react-native-gesture-handler";
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from "../../../utils";
import io from "socket.io-client";

export default class Contact extends Component {
  constructor(props) {
    super(props);

    // this.search = this.search.bind(this);

    this.state = {
      contacts: [],
      searchPlaceholder: "",
      typeText: null,
      loading: true,
      Activated: false,
      All_Contact: [],
      UserDetails: "",
      text: "",
    };
    Contacts.iosEnableNotesUsage(false);
  }

  async componentDidMount() {
    const user = await APP_STORE.read();
    this.setState({ UserDetails: user });
    this.Finger_print();
  }

  Finger_print() {
    FingerprintScanner.authenticate({
      description: "Scan your fingerprint on the device scanner to continue",
    })
      .then(() => {
        ToastMsg("Authenticated successfully", "success");
        this.setState({ Activated: true, loading: true });
        FingerprintScanner.release();
        this.Android_Permission();
      })
      .catch((error) => {
        FingerprintScanner.release();
        ToastMsg(error.message, "danger");
        //  this.Finger_print()
      });
  }

  Android_Permission() {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "This app would like to view your contacts.",
      }).then(() => {
        this.loadContacts();
      });
    } else {
      this.loadContacts();
    }
  }

  loadContacts() {
    Contacts.getAll()
      .then((contacts) => {
        this.setState({ contacts, loading: false });
        const data = this.state.contacts;
        const result = data.map((i) => {
          i.name = i.displayName;
          i.number = i.phoneNumbers[0]?.number.replace(/[- )(]/g, "");
          return i;
        });

        const Res = result.map(({ name, number }) => ({
          name,
          number,
        }));
        //  console.log("Local contacts----->", result);
        this.sendLocalContacts(Res);
      })

      .catch((e) => {
        this.setState({ loading: false });
      });

    // Contacts.getCount().then((count) => {
    //   this.setState({ searchPlaceholder: `Search ${count} contacts` });
    // });

    Contacts.checkPermission();
  }
  sendLocalContacts(Res) {
    let apiName = "filteringcontact";
    let parmeter = {
      allContacts: Res,
      user_id: this.state.UserDetails.mobilenumber,
    };
    services
      .post(apiName, parmeter)
      .then((response) => {
        if (response.status === "Success") {
          APP_STORE.update({ RegContact: response.contact });

          const invite_contact = response.invite;
          const Reg_contact = response.contact;

          const InviteContactAdd = invite_contact.map((m, i) => {
            m.invite = true;
            return m;
          });
          const All_Contact = [...Reg_contact, ...InviteContactAdd];
          this.setState({
            All_Contact: All_Contact,
            searchPlaceholder: `Search ${All_Contact.length} contacts`,
          });
          console.log("InviteContactAdd", All_Contact);
          // ToastMsg(response.message, "success");
        } else {
          ToastMsg(response.message, "danger");
        }
      })
      .catch((err) => console.log("Error is ", err));
  }

  // search(text) {
  //   const phoneNumberRegex =
  //     /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
  //   const emailAddressRegex =
  //     /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  //   if (text === "" || text === null) {
  //     this.loadContacts();
  //   } else if (phoneNumberRegex.test(text)) {
  //     Contacts.getContactsByPhoneNumber(text).then((contacts) => {
  //       this.setState({ contacts });
  //     });
  //   } else if (emailAddressRegex.test(text)) {
  //     Contacts.getContactsByEmailAddress(text).then((contacts) => {
  //       this.setState({ contacts });
  //     });
  //   } else {
  //     Contacts.getContactsMatchingString(text).then((contacts) => {
  //       this.setState({ contacts });
  //     });
  //   }
  // }

  search(text) {
    if (text === "" || text === null) {
      this.setState({
        text: "",
      });
      this.loadContacts();
    } else {
      const newData = this.state.All_Contact.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        All_Contact: newData,
        text: text,
      });
    }
  }

  onPressContact(contact) {
    this.props.navigation.navigate("onetoone", { contactData: contact });
    // console.log("contact-->", contact);
    // var text = this.state.typeText;
    // this.setState({ typeText: null });
    // if (text === null || text === '')
    //   Contacts.openExistingContact(contact)
    // else {
    //   var newPerson = {
    //     recordID: contact.recordID,
    //     phoneNumbers: [{ label: 'mobile', number: text }]
    //   }
    //   Contacts.editExistingContact(newPerson).then(contact => {
    //     //contact updated
    //   });
    // }
  }

  addNew() {
    Contacts.openContactForm({}).then((contact) => {
      // console.log('contact--->', contact)
      // Added new contact
      if (contact != undefined) {
        this.setState(({ contacts }) => ({
          contacts: [contact, ...contacts],
          loading: false,
        }));
      }
    });
  }
  async handle_Invite() {
    const url = `sms:${"8015432126"}${"&"}body=${"Hi.."}`;
    await Linking.openURL(url);
  }

  renderItemIS = (item, index) => {
    return (
      // <View style={{flexDirection:'row'}}>
      <ListItem
        leftElement={
          <Avatar
            img={
              item.profile_img === "" || item.invite === true
                ? Const_Images.Empty_Prof_Pic
                : {
                    uri:
                      "http://51.15.204.121/hiddenly/Hiddenly/Media/Profile_Img/" +
                      item.profile_img,
                  }
            }
            width={40}
            height={40}
          />
        }
        // 'http://51.15.204.121/hiddenly/Hiddenly/Media/Profile_Img/'
        title={item.name}
        description={item.number}
        onPress={() =>
          item.invite === true
            ? this.handle_Invite()
            : this.onPressContact(item)
        }
        rightElement={
          item.invite === true ? (
            <View
              style={{ backgroundColor: Com_color.Btnblue, borderRadius: 5 }}
            >
              <Text style={{ color: "#fff", padding: "5%" }}>Invite</Text>
            </View>
          ) : null
        }
      />
    );
  };

  render() {
    const { Activated } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {Activated != false ? (
          <View style={styles.container}>
            <Button title="Add new" onPress={() => this.addNew()} />

            <TextInput
              placeholder={this.state.searchPlaceholder}
              placeholderTextColor={"#000"}
              value={this.state.text}
              onChangeText={(text) => this.search(text)}
              style={{ borderWidth: 0.5, paddingLeft: "5%", color: "#000" }}
            />

            {/* <View style={{paddingLeft: 10, paddingRight: 10}}>
              <TextInput
                keyboardType="number-pad"
                style={styles.inputStyle}
                placeholder="Enter number to add to contact"
                onChangeText={text => this.setState({typeText: text})}
                value={this.state.typeText}
              />
            </View> */}

            {this.state.loading === true ? (
              <View style={styles.spinner}>
                <ActivityIndicator size="large" color="#003399" />
              </View>
            ) : (
              <ScrollView style={{ flex: 1 }}>
                <FlatList
                  data={this.state.All_Contact}
                  renderItem={({ item, index }) =>
                    this.renderItemIS(item, index)
                  }
                  keyExtractor={(item, index) => index.toString()}
                />

                {/* {this.state.contacts.map((contact) => {
                  return (
                    <ListItem
                      leftElement={
                        <Avatar
                          img={
                            contact.hasThumbnail
                              ? { uri: contact.thumbnailPath }
                              : undefined
                          }
                          placeholder={getAvatarInitials(
                            `${contact.givenName} ${contact.familyName}`
                          )}
                          width={40}
                          height={40}
                        />
                      }
                      key={contact.recordID}
                      title={`${contact.givenName} ${contact.familyName}`}
                      description={`${contact.company}`}
                      onPress={() => this.onPressContact(contact)}
                      onDelete={() =>
                        Contacts.deleteContact(contact).then(() => {
                          this.loadContacts();
                        })
                      }
                    />
                  );
                })} */}
              </ScrollView>
            )}
          </View>
        ) : (
          <View>
            <Image style={styles.FingerImg} source={Const_Images.Finger} />
            <Text style={styles.welcometxt}>Use Fingerprint</Text>
            <Text style={styles.lable}>
              Use Your Fingerprint to Unlock the Contacts{" "}
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  FingerImg: { width: 350, height: 350, alignSelf: "center", marginTop: "10%" },
  welcometxt: {
    fontSize: Com_font.txt20,
    alignSelf: "center",
    color: Com_color.labletxt,
    marginTop: "10%",
  },
  lable: {
    fontSize: Com_font.txt16,
    color: Com_color.lightlabletxt,
    textAlign: "center",
    margin: 40,
  },
  spinner: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
  },
  inputStyle: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    textAlign: "center",
  },
  listmainview: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: dw,
    height: dh * 0.1,
  },
  proImg: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  PFtxt: {
    width: dw * 0.6,
    fontSize: Com_font.txt14,
    color: Com_color.labletxt2,
    fontWeight: "bold",
  },
  PFtxt2: {
    width: dw * 0.6,
    fontSize: Com_font.txt14,
    color: Com_color.labletxt,
    fontWeight: "bold",
  },
});

const getAvatarInitials = (textString) => {
  if (!textString) return "";
  const text = textString.trim();
  const textSplit = text.split(" ");

  if (textSplit.length <= 1) return text.charAt(0);

  const initials =
    textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);

  return initials;
};
