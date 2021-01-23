import React from "react";
import styled from "styled-components";

const ButtonBasic = styled.button`
  background-color: red;
  outline: none;
  border: none;
  color: #000;
  border-radius: 5px;
  cursor: pointer;
`;

export const PlayerCount = styled.h3`
  color: #000;
`;

export const Button = (props) => {
  return <ButtonBasic>{props.children}</ButtonBasic>;
};
