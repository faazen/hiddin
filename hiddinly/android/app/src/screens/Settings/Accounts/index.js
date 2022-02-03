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
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {BottomSheet} from 'react-native-elements';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';

class Accounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      checked: '',
      Bottomlable1: '',
      Bottomlable2: '',
      Bottomlable3: '',
    };
  }

  componentDidMount() {}

  handle_LastSeen() {
    this.setState({
      isVisible: true,
      Bottomlable1: 'Last seen',
      Bottomlable2:
        'If you don’t share your Last Seen, you won’t be able to see other people’s Last Seen',
    });
  }

  handle_Profilephoto() {
    this.setState({
      isVisible: true,
      Bottomlable1: 'Profile photo',
      Bottomlable2: '',
      Bottomlable3: '',
    });
  }

  handle_About() {
    this.setState({
      isVisible: true,
      Bottomlable1: 'About',
      Bottomlable2: '',
      Bottomlable3: '',
    });
  }
  handle_Status() {
    this.setState({
      isVisible: true,
      Bottomlable1: 'Status Privecy',
      Bottomlable2: 'Who can see my statusupdates',
      Bottomlable3:
        'Changes to your privacy settings won’t affect status updates that you have sent already',
    });
  }
  handle_Groups() {
    this.setState({
      isVisible: true,
      Bottomlable1: 'Groups',
      Bottomlable3: '',
    });
  }

  render() {
    const option = ['Everyone', 'My contacts', 'Nobody'];

    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={
            this.state.isVisible == true
              ? 'rgba(0.5, 0.25, 0, 0.2)'
              : 'transparent'
          }
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
          <Text style={[styles.Labletxt, {marginLeft: '5%'}]}>Privacy</Text>
        </View>
        <ScrollView>
          <View style={styles.mainview}>
            <View style={styles.subview}>
              <Text style={styles.Labletxt}>Who can see my personal info</Text>
              <Text style={styles.Labletxt2}>
                If you don’t share your Last Seen, you won’t be able to see
                other people’s Last Seen
              </Text>
            </View>
            <TouchableOpacity onPress={() => this.handle_LastSeen()}>
              <View style={styles.subview}>
                <Text style={styles.Labletxt}>Last seen</Text>
                <Text style={styles.Labletxt2}>Everyone</Text>
                <IconRight
                  name={'chevron-right'}
                  size={40}
                  color={'#a9a9b0'}
                  style={styles.Ricon}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.handle_Profilephoto()}>
              <View style={styles.subview}>
                <Text style={styles.Labletxt}>Profile photo</Text>
                <Text style={styles.Labletxt2}>Everyone</Text>
                <IconRight
                  name={'chevron-right'}
                  size={40}
                  color={'#a9a9b0'}
                  style={styles.Ricon}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handle_About()}>
              <View style={styles.subview}>
                <Text style={styles.Labletxt}>About</Text>
                <Text style={styles.Labletxt2}>Everyone</Text>
                <IconRight
                  name={'chevron-right'}
                  size={40}
                  color={'#a9a9b0'}
                  style={styles.Ricon}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handle_Status()}>
              <View style={styles.subview}>
                <Text style={styles.Labletxt}>Status</Text>
                <Text style={styles.Labletxt2}>Everyone</Text>
                <IconRight
                  name={'chevron-right'}
                  size={40}
                  color={'#a9a9b0'}
                  style={styles.Ricon}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handle_Groups()}>
              <View style={styles.subview}>
                <Text style={styles.Labletxt}>Groups</Text>
                <Text style={styles.Labletxt2}>Everyone</Text>
                <IconRight
                  name={'chevron-right'}
                  size={40}
                  color={'#a9a9b0'}
                  style={styles.Ricon}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('blockedcontacts')}>
              <View style={styles.subview}>
                <Text style={styles.Labletxt}>Blocked contacts</Text>
                <Text style={styles.Labletxt2}>Everyone</Text>
                <IconRight
                  name={'chevron-right'}
                  size={40}
                  color={'#a9a9b0'}
                  style={styles.Ricon}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <BottomSheet
          isVisible={this.state.isVisible}
          containerStyle={{
            backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
          }}>
          <View style={styles.BSmainview}>
            <View style={{margin: '10%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.poplabletxt}>
                  {this.state.Bottomlable1}
                </Text>
                <AntDesignIcons
                  onPress={() =>
                    this.setState({isVisible: false, Bottomlable3: false})
                  }
                  name="close"
                  size={30}
                />
              </View>
              {this.state.Bottomlable2 == '' ? (
                <View style={{marginTop: '5%'}} />
              ) : (
                <Text style={styles.poplable}>{this.state.Bottomlable2}</Text>
              )}
              <View>
                {option.map((option, key) => {
                  return (
                    <View key={option}>
                      {this.state.checked == key ? (
                        <View style={styles.btn}>
                          <CommunityIcons
                            name={'radiobox-marked'}
                            size={25}
                            color={'#003399'}
                          />
                          <Text style={styles.radiotxt}>{option}</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({checked: key});
                          }}
                          style={styles.btn}>
                          <CommunityIcons
                            name={'radiobox-blank'}
                            size={25}
                            color={'#003399'}
                          />
                          <Text style={styles.radiotxt}>{option}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
              {this.state.Bottomlable3 == '' ? null : (
                <Text style={styles.poplable}>{this.state.Bottomlable3}</Text>
              )}
            </View>
          </View>
        </BottomSheet>
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
    paddingTop: '2%',
  },
  mainview: {marginHorizontal: '7%'},
  subview: {justifyContent: 'center', marginTop: '10%'},
  ic_view: {height: 30, width: 30},
  Ricon: {position: 'absolute', right: 0},
  BSmainview: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  poplabletxt: {
    fontSize: Com_font.txt16,
    color: Com_color.labletxt,
    fontWeight: 'bold',
  },
  poplable: {
    fontSize: Com_font.txt14,
    color: Com_color.labletxt2,
    marginVertical: '5%',
  },
  radio: {
    flexDirection: 'row',
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
  },
  radiotxt: {
    color: Com_color.Inputtxt,
    fontSize: Com_font.txt16,
    paddingLeft: '5%',
  },
};

export default Accounts;
