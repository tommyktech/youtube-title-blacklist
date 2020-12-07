import React, { useState } from "react";
import styled from "styled-components";
import { Center } from "./App";

interface IProps {
  onAdd: (text: string) => void;
}

const CustomInput = styled.input`
  margin-right: 20px;
`;

export function CenteredInput(props: IProps) {
  const [userInput, setUserInput] = useState("");

  const updateUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const validateInput = () => {
    if (userInput.length >= 3) {
      props.onAdd(userInput);
      setUserInput("");
    }
  };

  const checkForEnter = (e: any) => {
    if (e.key == "Enter") {
      validateInput();
    }
  };

  return (
    <Center>
      <CustomInput
        value={userInput}
        onChange={e => updateUserInput(e)}
        onKeyDown={e => checkForEnter(e)}
      />
      <button onClick={() => validateInput()}>Add</button>
    </Center>
  );
}
