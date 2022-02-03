import React, {useEffect, Component} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Text,
  TextInput,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
//import APP_STORE from '../../storage';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from '../../utils';
import {Const_Images, Com_color, Com_font} from '../../constants';
import {Tabs, Tab, NativeBaseProvider, TabHeading, Badge} from 'native-base';
import IconDot from 'react-native-vector-icons/Entypo';
import IconSearch from 'react-native-vector-icons/Fontisto';
import Contacts from './Contacts';
import Status from './Status';
import Chat from './Chat';

const CustomMenu = ({navigation}) => {
  let _menu = null;
  return (
    <View>
      <Menu
        ref={ref => (_menu = ref)}
        button={
          <TouchableOpacity onPress={() => _menu.show()}>
            <IconDot
              style={styles.Icons2}
              name="dots-three-vertical"
              size={20}
            />
          </TouchableOpacity>
        }>
        <MenuItem
          onPress={() => {
            navigation.navigate('Newgroup')
          }}>
          New group
        </MenuItem>
        <View style={{borderBottomColor: '#3b3b3b', borderBottomWidth: 0.5}} />
        <MenuItem
          onPress={() => {
            navigation.navigate('settings')
          }}>
          Settings
        </MenuItem>
      </Menu>
    </View>
  );
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };

  render() {
    const {menu} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <View>
          <View style={styles.toolbar}>
            <Text style={styles.tooltxt}>Hiddenly</Text>
            <IconSearch style={styles.Icons1} name="search" size={20} />
            <CustomMenu  navigation={this.props.navigation} />
          </View>
        </View>

        <Tabs
          tabBarUnderlineStyle={{backgroundColor: '#003399'}}
          tabContainerStyle={styles.tabsContainer}
          initialPage={1}>
          <Tab
            heading="Contacts"
            tabStyle={{backgroundColor: '#FFF'}}
            activeTabStyle={{backgroundColor: '#fff'}}
            textStyle={styles.tabTextStyle}
            inactiveTextStyle={{color: '#fff'}}
            activeTextStyle={styles.tabActiveTextStyle}>
            <Contacts navigation={this.props.navigation} />
          </Tab>
          <Tab
            heading="Chat"
            // heading={
            //   <TabHeading  style={{backgroundColor: '#fff',}}>
            //   <Text style={styles.tabTextStyle}>Chat</Text>
            //   <Badge style={styles.Badgeview}><Text style={styles.Badgetxt}>2</Text></Badge>
            //   </TabHeading>
            // }
            tabStyle={{backgroundColor: '#FFF'}}
            activeTabStyle={{backgroundColor: '#fff'}}
            textStyle={styles.tabTextStyle}
            inactiveTextStyle={{color: '#fff'}}
            activeTextStyle={styles.tabActiveTextStyle}>
            <Chat navigation={this.props.navigation} />
          </Tab>
          <Tab
            heading="Status"
            tabStyle={{backgroundColor: '#FFF'}}
            activeTabStyle={{backgroundColor: '#fff'}}
            textStyle={styles.tabTextStyle}
            inactiveTextStyle={{color: '#fff'}}
            activeTextStyle={styles.tabActiveTextStyle}>
            <Status navigation={this.props.navigation} />
          </Tab>
        </Tabs>
      </View>
    );
  }
}

const styles = {
  container: {flex: 1},
  tooltxt: {
    fontSize: Com_font.txt20,
    color: Com_color.txtblue,
    marginLeft: '5%',
  },
  toolbar: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    width: dw,
    marginTop: '10%',
  },
  Icons1: {marginLeft: '55%'},
  Icons2: {marginLeft: '17%'},
  tabsContainer: {
    width: dw,
    height: 50,
    justifyContent: 'space-evenly',
  },
  Badgeview: {
    width: 20,
    height: 20,
    backgroundColor: '#a9a9b0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Badgetxt: {fontSize: 12},
  tabTextStyle: {
    color: '#a9a9b0',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabActiveTextStyle: {
    color: '#3b3b3b',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

export default Home;
