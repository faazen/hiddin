import React, {useEffect, Component} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Text,
  TextInput,
  ScrollView,
} from 'react-native';
import {Const_Images, Com_color, Com_font} from '../../constants';
//import APP_STORE from '../../storage';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from '../../utils';
import Toolbar from '../../templates/Toolbar';
import ToastMsg from '../../templates/ToastMessage';
import FingerprintScanner from 'react-native-fingerprint-scanner';

class Fingerprint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Activated: false,
      
    };
  }

  componentDidMount() {
    this.Finger_print();
  }

  Finger_print() {
       FingerprintScanner.authenticate({
      description: 'Scan your fingerprint on the device scanner to continue',
    })
      .then(() => {
        ToastMsg('Authenticated successfully', 'success');
        this.setState({Activated: true});
        FingerprintScanner.release();
      })
      .catch(error => {
        FingerprintScanner.release();
        ToastMsg(error.message, 'danger');
      });
  }

  next_QRCode() {
    this.props.navigation.navigate('QRcode');
  }

  render() {
    const {Activated} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
        <StatusBar translucent={true} backgroundColor="transparent" />
        {/* <BgImage> */}
        <Toolbar navigation={this.props} />
        <>
          <Image style={styles.FingerImg} source={Const_Images.Finger} />
          <Text style={styles.welcometxt}>Fingerprint</Text>
          <View style={styles.mainview}>
            <Text style={styles.lable}>
              Activate finger print, so you don’t need to confirm your PIN every
              time to authenticate.
            </Text>
            <View style={styles.subview}>
              <TouchableOpacity
                disabled={Activated == true ? false : true}
                onPress={() => this.next_QRCode()}>
                <View
                  style={[
                    styles.Btnview,
                    {opacity: Activated == true ? 1 : 0.51},
                  ]}>
                  <Text style={styles.Btntxt}>Activate</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </>
        {/* </BgImage> */}
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  container: {flex: 1},
  FingerImg: {width: 350, height: 350, alignSelf: 'center', marginTop: '30%'},
  welcometxt: {
    fontSize: Com_font.txt20,
    alignSelf: 'center',
    color: Com_color.labletxt,
    marginTop: '10%',
  },
  mainview: {margin: 40},
  lable: {
    fontSize: Com_font.txt16,
    color: Com_color.lightlabletxt,
    textAlign: 'center',
  },
  subview: {marginTop: 20},
  Btnview: {
    height: 50,
    borderRadius: 10,
    backgroundColor: Com_color.Btnblue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Btntxt: {fontSize: Com_font.txt20, color: Com_color.txtyellow},
  underlineStyleBase: {
    width: 60,
    height: 60,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: '#161f3d',
    fontSize: Com_font.txt20,
  },

  underlineStyleHighLighted: {
    borderColor: '#1d1d26',
    borderBottomWidth: 1,
  },
};

export default Fingerprint;
