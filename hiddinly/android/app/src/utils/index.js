import {ActivityIndicator, Dimensions} from 'react-native';
import React from 'react';
import {InvalidText} from './UtilMethods';

export const DEVICE_WIDTH = Dimensions.get('window').width;

export const DEVICE_HEIGHT = Dimensions.get('window').height;

export const STRING_VALIDATION = InvalidText;

export const LOADER = props => (
  <ActivityIndicator animating size={props.size || 'large'} color={'#fff'} />
);
