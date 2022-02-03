import React, {useEffect, Component} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {Const_Images, Com_font, Com_color} from '../../../constants';
import CommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from '../../../utils';
import Iconedit from 'react-native-vector-icons/MaterialIcons';
import {TextInput} from 'react-native-gesture-handler';
import IconRight from 'react-native-vector-icons/EvilIcons';
import {Switch, ListItem} from 'react-native-elements';

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggelClicked: false,
    };
  }

  componentDidMount() {}

  render() {
    const {toggelClicked} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle="dark-content"
        />
        <View
          style={{
            marginTop: '10%',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={styles.backIcon}>
            <CommunityIcons
              name="keyboard-backspace"
              color="#3b3b3b"
              size={40}
            />
          </TouchableOpacity>
          <Text style={[styles.Labletxt, {marginLeft: '5%'}]}>
            Notifications
          </Text>
        </View>
        <View style={styles.mainview}>
          <View style={styles.subview}>
            <Text style={styles.Labletxt}>Conversation tones</Text>
            <Text style={styles.Labletxt2}>
              Play sounds for incoming and outgoing messages.
            </Text>

            <Switch
              onValueChange={val => this.setState({toggelClicked: val})}
              style={styles.Ricon}
              value={toggelClicked}
              color="#003399"
            />
          </View>
          <Text style={styles.LabletxtBlue}>Messages</Text>
          <View style={{marginTop: '5%'}}>
            <Pressable onPress={() => alert('')}>
              <View style={styles.subview}>
                <Text style={styles.Labletxt}>Notification tone</Text>
                <Text style={styles.Labletxt2}>Default</Text>
                <IconRight
                  name={'chevron-right'}
                  size={40}
                  color={'#a9a9b0'}
                  style={styles.Ricon}
                />
              </View>
            </Pressable>
          </View>
          <View style={{marginTop: '5%'}}>
            <Pressable onPress={() => alert('')}>
              <View style={styles.subview}>
                <Text style={styles.Labletxt}>Vibrate</Text>
                <Text style={styles.Labletxt2}>Default</Text>
                <IconRight
                  name={'chevron-right'}
                  size={40}
                  color={'#a9a9b0'}
                  style={styles.Ricon}
                />
              </View>
            </Pressable>
          </View>
       
          <Text style={styles.LabletxtBlue}>Groups</Text>
          <View style={{marginTop: '5%'}}>
            <Pressable onPress={() => alert('')}>
              <View style={styles.subview}>
                <Text style={styles.Labletxt}>Notification tone</Text>
                <Text style={styles.Labletxt2}>Default</Text>
                <IconRight
                  name={'chevron-right'}
                  size={40}
                  color={'#a9a9b0'}
                  style={styles.Ricon}
                />
              </View>
            </Pressable>
          </View>
          <View style={{marginTop: '5%'}}>
            <Pressable onPress={() => alert('')}>
              <View style={styles.subview}>
                <Text style={styles.Labletxt}>Vibrate</Text>
                <Text style={styles.Labletxt2}>Default</Text>
                <IconRight
                  name={'chevron-right'}
                  size={40}
                  color={'#a9a9b0'}
                  style={styles.Ricon}
                />
              </View>
            </Pressable>
          </View>
       
          <Text style={styles.LabletxtBlue}>Calls</Text>
          <View style={{marginTop: '5%'}}>
            <Pressable onPress={() => alert('')}>
              <View style={styles.subview}>
                <Text style={styles.Labletxt}>Notification tone</Text>
                <Text style={styles.Labletxt2}>Default</Text>
                <IconRight
                  name={'chevron-right'}
                  size={40}
                  color={'#a9a9b0'}
                  style={styles.Ricon}
                />
              </View>
            </Pressable>
          </View>
          <View style={{marginTop: '5%'}}>
            <Pressable onPress={() => alert('')}>
              <View style={styles.subview}>
                <Text style={styles.Labletxt}>Vibrate</Text>
                <Text style={styles.Labletxt2}>Default</Text>
                <IconRight
                  name={'chevron-right'}
                  size={40}
                  color={'#a9a9b0'}
                  style={styles.Ricon}
                />
              </View>
            </Pressable>
          </View>
       
        </View>
      </View>
    );
  }
}

const styles = {
  container: {flex: 1},
  backIcon: {marginLeft: '5%'},
  Labletxt: {
    color: Com_color.Inputtxt,
    fontSize: Com_font.txt16,
    fontWeight: 'bold',
  },
  LabletxtBlue: {
    color: Com_color.Btnblue,
    fontSize: Com_font.txt16,
    fontWeight: 'bold',
    marginTop: '5%',
  },
  Imgview: {width: dw, height: dh * 0.32},
  mainview: {
    marginHorizontal: '5%',
    marginTop: '10%',
  },
  subview: {justifyContent: 'center'},
  Ricon: {position: 'absolute', right: 0},
  Labletxt2: {
    color: Com_color.labletxt2,
    fontSize: Com_font.txt14,
    width: dw * 0.7,
  },
};

export default Notifications;
