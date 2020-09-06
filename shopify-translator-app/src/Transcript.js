import React from "react";
import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";
import { PlayerContext } from "./PlayerContext";
import { PlayerBoundariesContext } from "./PlayerBoundariesContext";
import TranscriptSentence from "./TranscriptSentence.js";
import { useDispatch } from "react-redux";
import { addTranscript, addCurrentTime, markEnglishAsPlaying } from "./actions";
import { useSelector } from "react-redux";
import {
  getSimplifiedSentences,
  getCurrentTime,
  getUUIDsandTimes,
  getTranslationPlaying,
  getTranslationTimeCodeAndUUID,
  getEnglishUUID,
} from "./reducers";
let next_start_time;
let refs = {};

function Transcript() {
  const playerContext = React.useContext(PlayerContext);
  const dispatch = useDispatch();
  let simplifiedSentences = useSelector(getSimplifiedSentences);
  let current_time = useSelector(getCurrentTime);
  let uuids_and_times = useSelector(getUUIDsandTimes);

  let translationPlaying = useSelector(getTranslationPlaying);
  let translationTimeCodeUUID = useSelector(getTranslationTimeCodeAndUUID);
  let english_uuid = useSelector(getEnglishUUID);
  const [currentUUID, setcurrentUUID] = React.useState("");

  const {
    state: { contextSentenceAndGoodWordCombined, uuidHighlighted },
    actions: { updateContextSentenceAndGoodWordCombined },
  } = React.useContext(PlayerBoundariesContext);

  const localRef = React.useRef();
  const otherRef = React.useRef();

  function handleRefsClick(id) {
    console.log(id);
    console.log(refs[id]);
    var element = document.getElementById(id);
    element.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }

  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log(highligherContext.current__play_head_time);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

  // const myRef = React.useRef();
  // const otherRef = React.useRef();

  // const executeScroll = () => scrollToRef(myRef);

  React.useEffect(() => {
    console.log("Transcript useffect");
    async function getTranscriptSentences() {
      let combined = await playerContext.getCombined();

      let sentenceAndGoodWordCombined = [];
      combined.translations.forEach((element, i) => {
        // // TODO: I could go in and hand correct the data, but I think it's more instructive to show how I deal with bad data

        const iterator = element.words[Symbol.iterator]();

        let ii = 0;
        let currentCase = "nil";
        let succesful_word = undefined;
        while (ii < element.words.length - 1 && succesful_word === undefined) {
          let aligned_word = element.words[ii];

          if (aligned_word.word.case === "success") {
            succesful_word = aligned_word;
          }
          ii = ii + 1;
        }

        let last_word;
        if (element.words[element.words.length - 1].word.case === "success") {
          last_word = element.words[element.words.length - 1];
        } else {
          // is the next word available?
          last_word = undefined;
        }

        if (succesful_word !== undefined) {
          // sentenceAndGoodWordCombined.push({
          //   english_sentence: element.english,
          //   translated_sentence: element.translation,
          //   speaker: element.speaker,
          //   word: succesful_word,
          //   last_word: last_word,
          //   words: element.words,
          //   full_sentences_i: element.full_sentences_i,
          //   uuid: element.uuid,
          //   isHighlighted: false,
          //   highlightedLang: "none",
          // });

          sentenceAndGoodWordCombined.push({
            english_sentence: element.english,
            translated_sentence: element.translation,
            speaker: element.speaker,
            word: succesful_word,
            last_word: last_word,
            // words: element.words,
            // full_sentences_i: element.full_sentences_i,
            uuid: element.uuid,
            // isHighlighted: false,
            // highlightedLang: "none",
          });
        }
      });

      console.log("Transcript useffect");

      console.log(combined.translations);
      dispatch(addTranscript(sentenceAndGoodWordCombined));
      sentenceAndGoodWordCombined.forEach((sent) => {
        refs[sent.uuid] = React.createRef();
      });
      console.log(refs);

      //updateContextSentenceAndGoodWordCombined(sentenceAndGoodWordCombined);
    }
    getTranscriptSentences();
  }, []);

  React.useEffect(() => {
    let array_i;

    // I realize I can do foreach here, but this way I can break early
    for (let i = 0; i < uuids_and_times.length - 1; i++) {
      if (
        uuids_and_times[i].start < current_time &&
        uuids_and_times[i].end > current_time
      ) {
        array_i = i;
      }
    }
    if (array_i != undefined) {
      setcurrentUUID(uuids_and_times[array_i].uuid);
      dispatch(
        markEnglishAsPlaying(current_time, uuids_and_times[array_i].uuid)
      );
    }

    // let current_sentence = uuids_and_times.filter(
    //   (s) => s.start < current_time && s.end > current_time
    // );
    // // console.log(current_sentence);
    // // console.log(uuids_and_times);
    // if (current_sentence[0] !== undefined) {
    //   setcurrentUUID(current_sentence[0].uuid);
    // }
    // console.log(current_sentence);
  }, [current_time]);

  React.useEffect(() => {
    let element = document.getElementById(english_uuid);
    if (element !== null) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [english_uuid]);

  return (
    <TranscriptWrapper>
      <TranscriptList>
        {simplifiedSentences.map((element, i) => {
          // console.log(element.uuid);
          // console.log(uuidToHighLight);
          return (
            <TranscriptItem>
              <TranscriptSentence
                sentence_object={element}
                key={element.uuid}
                englishHighlighted={
                  element.uuid === currentUUID && translationPlaying === false
                }
                translatedHightlighted={
                  element.uuid === translationTimeCodeUUID.uuid &&
                  translationPlaying
                }
                next_start_time={element.next_start_time}
                // highlightedLang={element.highlightedLang}
                // uuidHighlighted={uuidHighlighted}
              ></TranscriptSentence>
            </TranscriptItem>
          );
        })}
      </TranscriptList>
      {/* <TranscriptList>
        {contextSentenceAndGoodWordCombined.map((element, i) => {
          // console.log(element.uuid);
          // console.log(uuidToHighLight);

          return (
            <TranscriptItem>
              <TranscriptSentence
                sentence_object={element}
                key={element.uuid}
                highlighted={element.isHighlighted}
                highlightedLang={element.highlightedLang}
                uuidHighlighted={uuidHighlighted}
              ></TranscriptSentence>
            </TranscriptItem>
          );
        })}
      </TranscriptList> */}
    </TranscriptWrapper>
  );
}

const TranscriptWrapper = styled.div`
  background-color: white;
`;

const TranscriptList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const TranscriptItem = styled.div``;

export default Transcript;
