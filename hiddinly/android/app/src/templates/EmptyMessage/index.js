import React from 'react';
import {Text} from 'react-native';

const EmptyMessage = props => (
  <Text
    style={{
      fontSize: 14,
      color: 'red',
      marginTop: props.top == 'none' ? 0 : 10,
      marginBottom: props.top == 'none' ? 10 : 0,
      marginLeft: 20,
    }}>
    * {props.name ? props.name : ''}{' '}
    {props.invalid === 'yes' ? 'is Invalid' : 'Cannot be empty'}
  </Text>
);

export default EmptyMessage;
