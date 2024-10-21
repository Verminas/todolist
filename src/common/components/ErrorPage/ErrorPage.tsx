import React from "react";
import styled from "styled-components";

export function ErrorPage() {
  return (
    <Wrapper className="error-page">
      <div>
        <h1>Oops!</h1>
        <p>Page not found 404</p>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  & div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
