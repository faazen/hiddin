import React, {Component} from 'react';
import {showMessage} from 'react-native-flash-message';
const ToastMessage = (message, type) => {
  showMessage({
    message,
    type,
  });
};

export default ToastMessage;
