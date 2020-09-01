import React from "react";
import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";

function TranscriptSentence({ sentence_object, highlighted }) {
  React.useEffect(() => {
    // console.log(sentence_object);
  }, []);

  return (
    <Wrapper>
      {highlighted ? (
        <Sentence>{sentence_object.sentence.sentence}</Sentence>
      ) : (
        <SentenceHighlighted>
          {sentence_object.sentence.sentence}
        </SentenceHighlighted>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  z-index: 2;
  text-align: left;
`;

const Sentence = styled.div`
  background-color: white;
  text-align: left;
  padding: 10px;
  font-family: "Open Sans";
  font-size: 20px;
  font-weight: 400;
  border-bottom: solid 2px white;
  color: grey;
`;

const SentenceHighlighted = styled.div`
  background-color: white;
  font-family: "Open Sans";
  font-size: 20px;
  font-weight: 400;
  border-bottom: solid 2px black;

  text-align: left;
  padding: 10px;
  color: black;
`;

export default TranscriptSentence;
