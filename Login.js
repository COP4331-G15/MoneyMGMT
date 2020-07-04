import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import LoginButton from "../myNewProject/components/LoginButton";
import RegisterButton from "../myNewProject/components/RegisterButton";
import FormTextInput from "../myNewProject/components/formTextInput";
import strings from "../myNewProject/components/strings"
import colors from "../myNewProject/components/colors"
import imageLogo from "../myNewProject/components/images/logo2.png"


interface State {
  email: string;
  password: string;
}

class LoginScreen extends React.Component<{}, State> {
   state: State = {
    email: "",
    password: "",
  };

  handleEmailChange = (email: string) => {
    this.setState({ email: email });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password: password });
  };

  handleLoginPress = () => {
    console.log("Login button pressed");
  };

  handleRegisterPress = () => {
    console.log("Register button pressed");
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={imageLogo} style={styles.logo} />
        <View style={styles.form}>
          <FormTextInput
            value={this.state.email}
            onChangeText={this.handleEmailChange}
            placeholder={strings.EMAIL_PLACEHOLDER}
          />
          <FormTextInput
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            placeholder={strings.PASSWORD_PLACEHOLDER}
          />
          <LoginButton label={strings.LOGIN} onPress={this.handleLoginPress} />
          <RegisterButton label={strings.REGISTER} onPress={this.handleRegisterPress} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY,
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center",
  },
  form: {
    flex: 1,
    justifyContent: "flex-start",
    width: "80%",
  }
});

export default LoginScreen;
