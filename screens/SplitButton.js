import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SplitButton = ({ onLeftPress, onRightPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.leftButton]} onPress={onLeftPress}>
        <Text style={styles.buttonText}>Left Action</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.rightButton]} onPress={onRightPress}>
        <Text style={styles.buttonText}>Right Action</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10,
  },
  button: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    backgroundColor: '#4CAF50', // Green for the left button
  },
  rightButton: {
    backgroundColor: '#F44336', // Red for the right button
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SplitButton;
