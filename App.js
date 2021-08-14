import React, { useState } from "react";
import {
  NativeBaseProvider,
  Button,
  View,
  Input,
  Stack,
  Center,
  Heading,
} from "native-base";
import GenGLView from "./gen-gl-view";
import { Keyboard, TouchableOpacity } from "react-native";
export const InputView = ({ onOk, value, setValue }) => {
  const handleChange = (val) => {
    setValue(val);
  };
  const handleClick = () => {
    onOk && onOk(value);
    Keyboard.dismiss();
  };
  return (
    <View>
      <Stack
        space={4}
        w="100%"
        safeArea
        style={{ paddingLeft: 8, paddingRight: 8 }}
      >
        <Center>
          <Heading>支持你喜欢的爱豆</Heading>
        </Center>
        <Input
          value={value}
          onChangeText={handleChange}
          placeholder="键入你的爱豆"
          InputRightElement={
            <Button
              ml={1}
              roundedLeft={0}
              roundedRight="md"
              onPress={handleClick}
            >
              确认
            </Button>
          }
        />
      </Stack>
    </View>
  );
};

export default function App() {
  const initialText = "";
  const [value, setValue] = useState(initialText);
  const [text, setText] = useState(initialText);
  const onOk = (val) => {
    setText(val);
  };
  return (
    <NativeBaseProvider>
      <InputView value={value} setValue={setValue} onOk={onOk} />
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
        }}
        activeOpacity={1}
        style={{ flex: 1 }}
      >
        <GenGLView text={text} />
      </TouchableOpacity>
    </NativeBaseProvider>
  );
}
