import AsyncStorage from "@react-native-async-storage/async-storage";

const APP_STORE = {
  create: async (data) => {
    try {
      const convertedJson = JSON.stringify(data);
      await AsyncStorage.setItem("@user_details", convertedJson);
      return true;
    } catch (e) {
      return e;
    }
  },
  read: async () => {
    try {
      const userdetails = await AsyncStorage.getItem("@user_details");
      return userdetails && JSON.parse(userdetails);
    } catch (e) {
      return e;
    }
  },
  delete: async () => {
    try {
      await AsyncStorage.removeItem("@user_details");
      return true;
    } catch (e) {
      return e;
    }
  },
  update: async (data) => {
    try {
      const userdetails = await AsyncStorage.getItem("@user_details");
      const parsedDetails = JSON.parse(userdetails);
      const updateUserDetails = { ...parsedDetails, ...data };
      const convertedJson = JSON.stringify(updateUserDetails);
      await AsyncStorage.setItem("@user_details", convertedJson);
      return true;
    } catch (e) {
      console.log("Erro:", e);
      return e;
    }
  },
};

export default APP_STORE;
