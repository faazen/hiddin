import React, { useEffect, Component } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { Const_Images } from '../../constants';
//import APP_STORE from '../../storage';
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from '../../utils';
import BgImage from '../../templates/BgImage';
import APP_STORE from '../../storage';

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => {
      this.nextScreen();
    }, 3000);
  }

  // nextScreen(){
  //   this.props.navigation.navigate('signup');
  // }

  async nextScreen() {
    const user = await APP_STORE.read();
    if (STRING_VALIDATION(user)) {
      this.props.navigation.navigate('signup');
    }
    else {
      this.props.navigation.navigate('home');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} barStyle='dark-content' backgroundColor="transparent" />
        <BgImage>
          <Image style={styles.splashImg} source={Const_Images.Splash} />
        </BgImage>
      </View>
    );
  }
}

const styles = {
  container: { flex: 1 },
  splashImg: { width: 200, height: 250, alignSelf: 'center', marginTop: '80%' },
};

export default Splash;
