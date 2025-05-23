import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { blackColor, whiteColor } from '../constants/Color';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
const { alignItemsCenter, alignJustifyCenter, flexDirectionRow, borderRadius10 } = BaseStyle;

const CustomButton = ({ title, onPress, style, textStyle,isLoading }) => {
  return (
    <TouchableOpacity style={[styles.button, style, alignJustifyCenter, borderRadius10]} onPress={onPress} disabled={isLoading} >
      {isLoading ? (
        <ActivityIndicator size="small" color={whiteColor} />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: blackColor,
    paddingVertical: spacings.xLarge,
  },
  buttonText: {
    color: whiteColor,
    fontSize: style.fontSizeMedium.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
  },
});

export default CustomButton;
