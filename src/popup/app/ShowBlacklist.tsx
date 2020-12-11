import React from "react";
import styled from "styled-components";
import { BlacklistMap } from "./App";
interface IProps {
  blacklist: BlacklistMap;
  updateElement: (key: string, value: boolean) => void;
  removeKey: (key: string) => void;
}

const BlackUL = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: 0;
  margin-top: 0;

  & > li:nth-child(1) > span {
    font-weight: bold;
  }
`;

const BlackLI = styled.li`
  font-size: 0.85rem;
  display: flex;
  & > span:nth-child(2) {
    flex: 1;
    text-align: right;
  }
  & > span:nth-child(3) {
    width: 20px;
  }
`;

const Name = styled.span`
  &::before {
    content: ${(props: { blacklistedKey: string }) => {
      return "'" + props.blacklistedKey + "'";
    }};
  }

  &:hover {
    font-weight: bold;
    color: red;
    content: "";
    cursor: pointer;
    &::before {
      content: "";
    }
    &::after {
      content: "Remove?";
    }
  }
`;

const NameOrRemove: React.FC<{
  blacklistedKey: string;
  removeKey: (key: string) => void;
}> = (props: { blacklistedKey: string; removeKey: (key: string) => void }) => {
  return (
    <Name
      blacklistedKey={props.blacklistedKey}
      onClick={() => props.removeKey(props.blacklistedKey)}
    />
  );
};

export function ShowBlacklist(props: IProps) {
  const showElementForEach = (blacklist: BlacklistMap) => {
    const keys = Object.keys(blacklist);
    return keys.map(key => {
      return (
        <BlackLI key={key}>
          <NameOrRemove blacklistedKey={key} removeKey={props.removeKey} />
          <span style={{ fontWeight: blacklist[key] ? "bold" : "unset" }}>
            {blacklist[key] ? "blocked" : "not blocked"}
          </span>
          <span>
            <input
              checked={blacklist[key] ? true : false}
              onChange={() => {
                props.updateElement(key, !blacklist[key]);
              }}
              type="checkbox"
              name="toggle"
            />
          </span>
        </BlackLI>
      );
    });
  };

  return (
    <BlackUL>
      <BlackLI>
        <span>Key</span>
        <span>Status</span>
        <span></span>
      </BlackLI>
      {showElementForEach(props.blacklist)}
    </BlackUL>
  );
}
