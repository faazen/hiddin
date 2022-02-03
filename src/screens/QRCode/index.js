import React, { useEffect, Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Text,
  ImageBackground,
  TextInput,
  ScrollView,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { Const_Images, Com_color, Com_font } from '../../constants';
import {
  DEVICE_HEIGHT as dh,
  DEVICE_WIDTH as dw,
  STRING_VALIDATION,
} from '../../utils';
import Toolbar from '../../templates/Toolbar';
import QRCode from 'react-native-qrcode-generator';
import ViewShot from 'react-native-view-shot';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import GDrive from 'react-native-google-drive-api-wrapper';
import RNFS from 'react-native-fs';
import APP_STORE from '../../storage';
import services from '../../services';
import ToastMsg from '../../templates/ToastMessage';
import { Spinner } from 'native-base';
import CommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class QRCodeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      QRvalue: '',
      email: '',
      fileName: '',
      uri: '',
      QRmail: false,
      QRdrive: false,
      isLoader: false,
      userInfo: null,
      gettingLoginStatus: null,
      accessToken: null,
      filePath: []
    };
  }

  componentDidMount = async () => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata',
        "https://www.googleapis.com/auth/drive.appfolder",
      ],
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      webClientId: Platform.OS == 'ios' ? '273044272176-6kuu7r91jubddnajjjq00l3g3rahm1op.apps.googleusercontent.com' : '571220796854-g2aa0oqmosvgfrvncltia93p4eucd0ms.apps.googleusercontent.com',
    });
    const user = await APP_STORE.read();
    this.setState({ QRvalue: user.name + '@' + user.mobilenumber })
  };

  onImageLoad = () => {
    this.refs.viewShot.capture().then(uri => {
      const src = uri;
      const data = Platform.OS === 'ios' ? src.split('/')[15] : src.split(/[',','/']/)[8];
      console.log('data', src);
      console.log("After split screenshot", data);
      this.setState({ fileName: data, uri: src });
    });
  };

  handle_SendQRcode() {
    this.onImageLoad()
    if (this.state.QRdrive === true && this.state.QRmail === true) {
      //alert('send Mail & Drive');
      this.props.navigation.navigate('home');
    } else if (this.state.QRdrive === true) {
      this.SendtoDrive();
    } else {
      //this.uploadQRcode();
      this.props.navigation.navigate('home');
    }
  }

  SendtoDrive = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo);
      // APP_STORE.create(userInfo.user);
      this.uploadDriveDataImage();
    } catch (error) {
      console.log('Message', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        ToastMsg('User Cancelled the Login Flow', 'danger');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        ToastMsg('Signing In', 'danger');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        ToastMsg('Play Services Not Available or Outdated', 'danger');
      } else {
        ToastMsg(error.message, 'danger');
      }
    }
  };

  _initGoogleDrive = async () => {
    // Getting Access Token from Google
    let token = await GoogleSignin.getTokens();
    if (!token) return alert('Failed to get token');
    console.log('res.accessToken =>', token.accessToken);
    // Setting Access Token
    GDrive.setAccessToken(token.accessToken);
    // Initializing Google Drive and confirming permissions
    GDrive.init();
    // Check if Initialized
    return GDrive.isInitialized();
  };

  uploadDriveDataImage = async () => {
    try {
      this.setState({ isLoader: true });

      if (!(await this._initGoogleDrive())) {
        return alert('Failed to Initialize Google Drive');
      }

      // Convert Selected File into base64
      let fileContent = await RNFS.readFile(this.state.uri, 'base64');
      console.log('fileContent -> ', JSON.stringify(fileContent));
      // Create Directory on Google Device
      let directoryId = await GDrive.files.safeCreateFolder({
        name: "Hiddenly App",
        parents: ['root'],
      });
      console.log('directoryId -> ', directoryId);
      // Create Multipart and Upload
      let result = await GDrive.files.createFileMultipart(
        fileContent,
        'image/png',
        {
          parents: [directoryId],
          name: this.state.fileName,
        },
        true,
      );
      // Check upload file response for success
      if (!result.ok) return alert('Uploading Failed');
      console.log('result-->', result)
      this.setState({ isLoader: false });
      // Getting the uploaded File Id
      let fileId = await GDrive.files.getId(
        this.state.fileName,
        [directoryId],
        'image/png',
        false,
      );
      console.log(`Uploaded Successfull. File Id: ${fileId}`);
      this.setState({ isLoader: false });
      ToastMsg('Qr Images Uploaded Successfull', 'success');
      this.props.navigation.navigate('home');
    } catch (error) {
      this.setState({ isLoader: false });
      console.log('Error->', error);
      alert(`Error-> ${error}`);
    }
    this.setState({ isLoader: false });
  };

  uploadQRcode = async () => {
    this.setState({ isLoader: true });
    console.log('Getting api ');
    const user = await APP_STORE.read();
    const user_id = user._id.toString();
    const QRImg = new FormData();
    QRImg.append('qrimages', {
      uri: this.state.uri,
      name: this.state.fileName,
      type: 'image/png',
    });
    let apiName = 'upload/' + user_id;
    console.log('apiName', apiName);
    services
      .post(apiName, QRImg, true)
      .then(response => {
        console.log('Response ', response);
        if (response.message === 'Qr Images updated succsfully') {
          ToastMsg('Qr Images updated succsfully', 'success');
          this.setState({ isLoader: false });
          this.props.navigation.navigate('home');
        } else {
          ToastMsg(response.message, 'danger');
          this.setState({ isLoader: false });
        }
      })
      .catch(err => console.log('Error is ', err));
  };

  render() {
    const { QRvalue, QRmail, QRdrive, email } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: '#fff' }}>
          <ImageBackground style={styles.BgImg} source={Const_Images.Bg_Img}>
            <StatusBar
              translucent={true}
              backgroundColor="transparent"
              barStyle="dark-content"
            />
            <Toolbar navigation={this.props} />
            <Image style={styles.splashImg} source={Const_Images.Splash} />
            <Text style={styles.welcometxt}>QR CODE</Text>
            <View style={styles.mainview}>
              <View style={styles.subview}>
                <Text style={[styles.lable, { textAlign: 'center' }]}>
                  Please write any text or word to create your QR Code.
                </Text>
              </View>
              <View style={styles.QRview}>
                <ViewShot ref="viewShot" options={{ format: "png", quality: 0.9 }} >
                  <QRCode
                    value={QRvalue}
                    // onLoad={this.onImageLoad}
                    size={150}
                    bgColor="black"
                    fgColor="white"
                  />
                </ViewShot>
                {/* <QRCode
                  value={QRvalue}
                  getRef={(c) => (this.svg = c)}
                  size={120}
                  bgColor="black"
                  fgColor="white"
                /> */}
              </View>

              {/* <View style={[styles.subview, {marginTop: '15%'}]}>
                <Text style={styles.lable}>QR Text</Text>
                <TextInput
                  style={styles.TxtInput}
                  placeholderTextColor={Com_color.labletxt}
                  placeholder="Enter QR Text"
                  value={QRvalue}
                  onChangeText={text => this.setState({QRvalue: text})}
                />
              </View> */}

              <View style={[styles.subview]}>
                <Text style={styles.lable}>Email ID</Text>
                <TextInput
                  style={styles.TxtInput}
                  placeholderTextColor={Com_color.labletxt}
                  placeholder="Enter Email ID"
                  value={email}
                  onChangeText={text => {
                    this.setState({ email: text });
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row', marginTop: '3%' }}>
                <CommunityIcons
                  onPress={() => this.setState({ QRmail: !QRmail })}
                  name={QRmail == true ? 'radiobox-marked' : 'radiobox-blank'}
                  size={25}
                  color={'#003399'}
                />
                <Text style={[styles.radiotxt, { marginLeft: '3%' }]}>
                  Send Mail
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: '3%' }}>
                <CommunityIcons
                  onPress={() => this.setState({ QRdrive: !QRdrive })}
                  name={QRdrive == true ? 'radiobox-marked' : 'radiobox-blank'}
                  size={25}
                  color={'#003399'}
                />
                <Text style={[styles.radiotxt, { marginLeft: '3%' }]}>
                  Send Google Drive
                </Text>
              </View>
              {/* <View tyle={styles.subview}>
                <Text style={styles.Bluelable}>
                  Please keep your QR code in a safe place, we are going to ask
                  for it anytime you want to activate the app in another device!
                </Text>
              </View> */}

              <View style={[styles.subview, { marginBottom: '10%' }]}>
                <TouchableOpacity
                  disabled={QRmail == true || QRdrive == true ? false : true}
                  onPress={() => {
                    this.handle_SendQRcode();
                  }}
                // onPress={() => this.next_Home()}
                >
                  <View
                    style={[
                      styles.Btnview,
                      { opacity: QRmail == true || QRdrive == true ? 1 : 0.5 },
                    ]}>
                    {this.state.isLoader ? (
                      <Spinner color="#fb0143" />
                    ) : (
                      <Text style={styles.Btntxt}>Submit</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  container: { flex: 1 },
  BgImg: {},
  splashImg: { width: 200, height: 250, marginTop: '20%', alignSelf: 'center' },
  welcometxt: {
    fontSize: Com_font.txt24,
    alignSelf: 'center',
    color: Com_color.labletxt,
  },
  mainview: { marginHorizontal: 40 },
  QRview: { alignItems: 'center', marginTop: '5%' },
  lable: { fontSize: Com_font.txt14, color: Com_color.labletxt2 },
  TxtInput: { fontSize: Com_font.txt16, color: Com_color.Inputtxt },
  subview: { marginTop: 20 },
  Btnview: {
    height: 50,
    borderRadius: 10,
    backgroundColor: Com_color.Btnblue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Btntxt: {
    fontSize: Com_font.txt20,
    color: Com_color.txtyellow,
    fontWeight: 'bold',
  },
  Bluelable: {
    fontSize: Com_font.txt16,
    color: Com_color.txtblue,
    textAlign: 'left',
  },
  radiotxt: { color: Com_color.chattxt, fontSize: Com_font.txt16 },
};

export default QRCodeScreen;

