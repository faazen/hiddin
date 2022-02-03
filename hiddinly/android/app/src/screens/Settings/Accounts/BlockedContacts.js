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
import {Const_Images, Com_font, Com_color} from '../../../constants';
import CommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from '../../../utils';

import IconRight from 'react-native-vector-icons/EvilIcons';
import IconAdd from 'react-native-vector-icons/Ionicons';
import {Avatar, Badge, Icon, withBadge} from 'react-native-elements';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {BottomSheet} from 'react-native-elements';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import const_color from '../../../constants/const_color';

class BlockedContacts extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const option = ['Everyone', 'My contacts', 'Nobody'];

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
            Blocked contacts
          </Text>
          <IconAdd
            name={'add'}
            size={35}
            color={const_color.labletxt}
            style={{position: 'absolute', right: '5%'}}
          />
        </View>
        <View style={{marginTop:'5%'}}>
          <View style={styles.mainview}>
            <Avatar
              rounded
              source={{
                uri: 'https://randomuser.me/api/portraits/men/41.jpg',
              }}
              size={60}
            />
            <View style={{marginLeft: '5%'}}>
              <Text style={styles.Labletxt}>Aarya</Text>
              <Text style={styles.Labletxt2}>+91 9876543210</Text>
            </View>
          </View>
          <View style={styles.mainview}>
            <Avatar
              rounded
              source={{
                uri: 'https://randomuser.me/api/portraits/men/41.jpg',
              }}
              size={60}
            />
            <View style={{marginLeft: '5%'}}>
              <Text style={styles.Labletxt}>Abhimanyu</Text>
              <Text style={styles.Labletxt2}>+91 9876543210</Text>
            </View>
          </View>
          <View style={styles.mainview}>
            <Avatar
              rounded
              source={{
                uri: 'https://randomuser.me/api/portraits/men/41.jpg',
              }}
              size={60}
            />
            <View style={{marginLeft: '5%'}}>
              <Text style={styles.Labletxt}>Mani</Text>
              <Text style={styles.Labletxt2}>+91 9876543210</Text>
            </View>
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
  Labletxt2: {
    color: Com_color.labletxt2,
    fontSize: Com_font.txt14,
  },
  mainview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '10%',
    marginVertical: '3%',
  },
};

export default BlockedContacts;
