import React, { useCallback, useMemo } from "react";
import "./App.css";
import Player2 from "./Player2.js";
import Transcript from "./Transcript.js";
import styled from "styled-components";
import { SpeechSynthContext } from "./SpeechSynthContext";

function App() {
  const {
    actions: { playOrPauseSpeechSynth },
  } = React.useContext(SpeechSynthContext);

  function handleSpeechPlayBtn(event) {
    playOrPauseSpeechSynth();
  }

  React.useEffect(() => {
    console.log("app");
    // speechSynthesis.addEventListener("voiceschanged", function () {
    //   let voices_new = speechSynthesis.getVoices();
    //   console.log(voices_new);

    // });
  }, []);

  return (
    <div className="App">
      <Player2 />
      <Button onClick={handleSpeechPlayBtn}> French</Button>
      <Transcript></Transcript>
    </div>
  );
}
const Button = styled.button`
  background-color: Transparent;
  border: none;
  cursor: pointer;
  overflow: hidden;
  z-index: 1;
`;
const TranscriptList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const TranscriptItem = styled.div``;

export default App;
