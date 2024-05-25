import React from 'react';
import styled from "styled-components";

type ButtonPropsType = {
  title?: string
  onClick?: () => void
  className?: string
}

export const Button = ({title, onClick, className}: ButtonPropsType) => {
  return (
    <StyledButton onClick={onClick} className={className}>{title}</StyledButton>
  );
};

const StyledButton = styled.button<ButtonPropsType>`
    padding: 5px 10px;
    border-radius: 5px;
    border: none;
    & + & {
        margin-left: 5px;
    }
    &.active-filter {
        background-color: #abf1ab;
    }
`