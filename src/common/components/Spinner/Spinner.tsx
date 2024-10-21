import { CircularProgress } from "@mui/material";
import React from "react";
import styled from "styled-components";

export const Spinner = () => {
  return (
    <Wrapper>
      <CircularProgress />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 30%;
  text-align: center;
  width: 100%;
`;
