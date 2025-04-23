import React from "react";
import { Text, TextInput } from "react-native";
import styles from "./styles";
import colors from "../../constants/color";

const Input = ({ ...props }) => {
  return (
    <TextInput
      placeholderTextColor={colors.midGrey}
      {...props}
      style={styles.input}
    />
  );
};

export default React.memo(Input);
