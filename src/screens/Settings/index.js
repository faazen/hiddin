import React, {useEffect, Component} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {Const_Images, Com_font, Com_color} from '../../constants';
import CommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from '../../utils';
import IconRight from 'react-native-vector-icons/EvilIcons';
import IconHelp from 'react-native-vector-icons/Entypo';
import {TouchableHighlight} from 'react-native';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
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
          <Text style={styles.Labletxt}>Settings</Text>
        </View>
        <View style={styles.mainview}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('profile')}>
            <View style={styles.subview}>
              <Image source={Const_Images.ic_Profile} style={styles.ic_view} />
              <Text style={styles.Labletxt}>
                Profile{'\n'}
                <Text style={styles.Labletxt2}>
                  Change your profile details
                </Text>
              </Text>
              <IconRight
                name={'chevron-right'}
                size={40}
                color={'#a9a9b0'}
                style={styles.Ricon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('accounts')}>
            <View style={styles.subview}>
              <Image source={Const_Images.ic_Accounts} style={styles.ic_view} />
              <Text style={styles.Labletxt}>
                Accounts{'\n'}
                <Text style={styles.Labletxt2}>
                  Privacy, security, change number
                </Text>
              </Text>
              <IconRight
                name={'chevron-right'}
                size={40}
                color={'#a9a9b0'}
                style={styles.Ricon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>this.props.navigation.navigate('notifications')}>
            <View style={styles.subview}>
              <Image
                source={Const_Images.ic_Notifications}
                style={styles.ic_view}
              />
              <Text style={styles.Labletxt}>
                Notifications{'\n'}
                <Text style={styles.Labletxt2}>
                  Change your notification settings
                </Text>
              </Text>
              <IconRight
                name={'chevron-right'}
                size={40}
                color={'#a9a9b0'}
                style={styles.Ricon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert()}>
            <View style={styles.subview}>
              <IconHelp name={'help-with-circle'} size={35} color={'#003399'} />
              {/* <Image source={Const_Images.ic_Profile} style={styles.ic_view} /> */}
              <Text style={styles.Labletxt}>
                Help{'\n'}
                <Text style={styles.Labletxt2}>
                  Help center, contact us, privacy policy
                </Text>
              </Text>
              <IconRight
                name={'chevron-right'}
                size={40}
                color={'#a9a9b0'}
                style={styles.Ricon}
              />
            </View>
          </TouchableOpacity>
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
    paddingLeft: 20,
  },
  Labletxt2: {
    color: Com_color.labletxt2,
    fontSize: Com_font.txt14,
  },
  mainview: {marginHorizontal: '7%'},
  subview: {flexDirection: 'row', alignItems: 'center', marginTop: '10%'},
  ic_view: {height: 30, width: 30},
  Ricon: {position: 'absolute', right: 0},
};

export default Settings;
