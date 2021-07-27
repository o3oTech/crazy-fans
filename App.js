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

export const InputView = ({ onOk, value, setValue }) => {
  const handleChange = (val) => {
    setValue(val);
  };
  const handleClick = () => {
    onOk && onOk(value);
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
          <Heading>Input your IDOL's name</Heading>
        </Center>
        <Input
          value={value}
          onChangeText={handleChange}
          placeholder="Value Controlled Input"
          InputRightElement={
            <Button
              ml={1}
              roundedLeft={0}
              roundedRight="md"
              onPress={handleClick}
            >
              Submit
            </Button>
          }
        />
      </Stack>
    </View>
  );
};

export default function App() {
  const initialText = "IDOL";
  const [value, setValue] = useState(initialText);
  const [text, setText] = useState(initialText);
  const onOk = (val) => {
    setText(val);
  };
  return (
    <NativeBaseProvider>
      <InputView value={value} setValue={setValue} onOk={onOk} />
      <GenGLView text={text} />
    </NativeBaseProvider>
  );
}
