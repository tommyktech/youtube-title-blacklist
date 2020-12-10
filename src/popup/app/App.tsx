import equal from "fast-deep-equal";
import React, { FC } from "react";
import styled from "styled-components";
import { CenteredInput } from "./CenteredInput";
import { useBlacklist } from "./CustomHooks/useBlacklist";
import { ShowBlacklist } from "./ShowBlacklist";
import { Container } from "./styles";

const Title = styled.h6`
  font-weight: bold;
  font-size: 1.1rem;
  margin: 0px;
  margin-bottom: 15px;
`;

const Desc = styled.small`
  font-size: 0.9rem;
`;

export const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ShowIfMadeChanges = styled.span`
  font-size: 11px;
  margin-bottom: 0px;
  &::before{
    content: "${(props: { didChange: boolean }) => {
      return props.didChange ? "Refresh pages for changes to take effect" : "";
    }}";
  };
`;

export type BlacklistMap = {
  [name: string]: boolean;
};

const MadeWithLove = styled.span`
  font-size: 0.8rem;
  padding-top: 10px;
  position: absolute;
  left: 10px;
  bottom: 10px;
`;

const CustomContainer = styled(Container)`
  padding-bottom: 10px;
`;

const SourceCode = styled.a`
  position: absolute;
  bottom: 10px;
  right: 10px;
  float: right;
  text-align: right;
  font-size: 0.8rem;
`;

const App: FC = () => {
  const { blacklist, setBlacklist, firstBlacklist } = useBlacklist();
  // TODO add capitlization checking and handling here 👇
  const editKeyOnBlacklist = (text: string, toggled = true) => {
    const curr_blacklist: BlacklistMap = { ...blacklist };
    curr_blacklist[text] = toggled;

    chrome.storage.sync.set({ blacklist: curr_blacklist }, function() {
      setBlacklist(curr_blacklist);
    });
  };

  const removeKeyOnBlacklist = (blacklistedKey: string) => {
    const curr_blacklist: BlacklistMap = { ...blacklist };
    delete curr_blacklist[blacklistedKey];

    chrome.storage.sync.set({ blacklist: curr_blacklist }, function() {
      setBlacklist(curr_blacklist);
    });
  };

  return (
    <CustomContainer>
      <Title>Youtube Title Blacklist</Title>
      <Desc>
        Hide unwanted videos from your home page if they include keywords in the
        title.
      </Desc>
      <CenteredInput onAdd={editKeyOnBlacklist} />
      <ShowBlacklist
        blacklist={blacklist || {}}
        updateElement={editKeyOnBlacklist}
        removeKey={removeKeyOnBlacklist}
      ></ShowBlacklist>
      <ShowIfMadeChanges
        didChange={firstBlacklist != null && !equal(firstBlacklist, blacklist)}
      />
      <br />
      <MadeWithLove>
        Made with 💙 by{" "}
        <a href="https://github.com/creativebuilds">CreativeBuilds</a>
      </MadeWithLove>
      <SourceCode href="https://github.com/creativebuilds/youtube-title-blacklist">
        Source Code
      </SourceCode>
    </CustomContainer>
  );
};

export default App;
