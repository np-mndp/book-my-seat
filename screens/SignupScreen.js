
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import commonStyles from "../assets/styles";

const SignupScreen = ({navigation}) => {
  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.hero}>
        <Text style={commonStyles.heroText}>Sign Up</Text>
        <Text style={commonStyles.logo}> 🪑 </Text>
      </View>

      <View style={commonStyles.formContainer}>
        <Text style={commonStyles.label}>Name</Text>
        <TextInput style={commonStyles.input} placeholder="Full Name" />
        <Text style={commonStyles.label}>E-mail:</Text>
        <TextInput style={commonStyles.input} placeholder="E-mail" />
        <Text style={commonStyles.label}>Password:</Text>
        <TextInput style={commonStyles.input} placeholder="Password" />
        <Text style={commonStyles.label}>Confirm Password:</Text>
        <TextInput style={commonStyles.input} placeholder="Confirm Password" />

        <TouchableOpacity
          style={commonStyles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={commonStyles.buttonText}>Register</Text>
        </TouchableOpacity>
        <Text style={commonStyles.goBack}>Back to Sign in</Text>
      </View>
    </View>
  );
};
export default SignupScreen;
