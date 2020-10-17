import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import styled from "styled-components";
import "./App.css";
import AudioPlayer from "react-h5-audio-player";
import R5stylesSmall from "./r5Audiostyles.css";

import { MP3_PLAYER_STATES, TRANSLATION_MP3_PLAYER_STATES } from "./constants";

import CanadaFlagSrc from "./images/640px-Flag_of_Canada_(Pantone).png";
import QuebecFlagSrc from "./images/640px-Flag_of_Quebec.svg.png";

import {
  getTimeToJumpTo,
  getUUIDsandTimes,
  getMP3PlayerState,
  getTranslationPlaying,
  getShowTranslation,
} from "./reducers";

import { COLORS_SHOPIFY_BLUE_PALLETE } from "./constants.js";

import {
  addCurrentTime,
  changeUUIDPlaying,
  markEnglishAsPlaying,
  recordMP3PlayerState,
  markTranslationAsPlaying,
  changeTranslation,
  recordTranslationMP3PlayerState,
} from "./actions";

let prev;
let next;
let current;
let last_time_frame = 0.0;
// eslint-disable-next-line
let current_uuid;

function Player() {
  const dispatch = useDispatch();

  let mp3PlayerState = useSelector(getMP3PlayerState);

  let uuids_and_times = useSelector(getUUIDsandTimes);

  let timeToJumpTo = useSelector(getTimeToJumpTo);

  let translationPlaying = useSelector(getTranslationPlaying);

  const audioref = React.useRef(null);

  let showTranslation = useSelector(getShowTranslation);

  React.useEffect(() => {
    if (mp3PlayerState === MP3_PLAYER_STATES.PLAYING) {
      audioref.current.audio.current.play();
    } else if (mp3PlayerState === MP3_PLAYER_STATES.PAUSED) {
      audioref.current.audio.current.pause();
    }
  }, [mp3PlayerState]);

  React.useEffect(() => {
    console.log("time to jump to useEffect fired");

    if (timeToJumpTo > 0.0) {
      audioref.current.audio.current.currentTime = timeToJumpTo;
    }

    // eslint-disable-next-line
  }, [timeToJumpTo]);

  function quickishFindUUID(current_time) {
    console.log(uuids_and_times);
    let uuid = uuids_and_times.find(
      (element) => current_time > element.start && current_time < element.end
    );

    console.log(current_time);
    console.log(uuid);

    if (uuid !== undefined) {
      console.log("Player 80");
      console.log(uuid);
      console.log(translationPlaying);

      let trans_uuid = uuid.uuid + "trans";

      current_uuid = uuid;
      translationPlaying
        ? dispatch(changeUUIDPlaying({ ...uuid, uuid: trans_uuid }))
        : dispatch(changeUUIDPlaying(uuid));
    }
    // if (
    //   current_uuid !== undefined &&
    //   current_time > current_uuid.start &&
    //   current_time < current_uuid.end &&
    // ) {
    //   //console.log("already found");
    // } else {
    //   //console.log("doing search");

    //   let uuid = uuids_and_times.find(
    //     (element) => current_time > element.start && current_time < element.end
    //   );

    //   if (uuid !== undefined) {
    //     current_uuid = uuid;
    //     dispatch(changeUUIDPlaying(uuid));
    //   }
    // }
  }

  function announceListen(event) {
    let current_time = event.srcElement.currentTime;

    quickishFindUUID(current_time);
    dispatch(addCurrentTime({ current_time }));

    if (Math.abs(last_time_frame - current_time) > 2.0) {
      // console.log("========----==========================================");
      // console.log("likely jog");
      // aSynchFindUUID(current_time);
    }

    last_time_frame = current_time;
  }
  // eslint-disable-next-line

  function onPauseListen(event) {
    dispatch(recordMP3PlayerState(MP3_PLAYER_STATES.PAUSED));
  }

  function onPlayListen(event) {
    if (mp3PlayerState !== "playing") {
      dispatch(recordMP3PlayerState(MP3_PLAYER_STATES.PLAYING));
      dispatch(
        recordTranslationMP3PlayerState(TRANSLATION_MP3_PLAYER_STATES.PAUSED)
      );
    }
  }

  function handleTranslationButtonClick() {
    dispatch(changeTranslation(!showTranslation));
  }

  // src="https://dts.podtrac.com/redirect.mp3/cdn.simplecast.com/audio/1153d0/1153d031-e1ea-4aa1-8df0-78aa8be2c970/d51660c6-600d-4376-92ea-0e270af97b46/ep374-healthish_tc.mp3"

  //https://dts.podtrac.com/redirect.mp3/cdn.simplecast.com/audio/1153d0/1153d031-e1ea-4aa1-8df0-78aa8be2c970/71a9cfe9-dbbd-4572-b3d2-391c3d2f2c85/ep375-purechimp_tc.mp3

  return (
    <PlayerWrapper id={"hello"}>
      <PlayerDiv>
        <AudioPlayer
          src="https://dts.podtrac.com/redirect.mp3/cdn.simplecast.com/audio/1153d0/1153d031-e1ea-4aa1-8df0-78aa8be2c970/71a9cfe9-dbbd-4572-b3d2-391c3d2f2c85/ep375-purechimp_tc.mp3"
          customAdditionalControls={[]}
          onPlay={onPlayListen}
          onListen={announceListen}
          listenInterval={200}
          onPause={onPauseListen}
          autoPlay={false}
          customVolumeControls={[]}
          ref={audioref}
          style={{
            outline: "none",
            paddingBottom: "0px",
          }}
          styles={R5stylesSmall}
          id={"hello2"}
        />
      </PlayerDiv>
      <TranslationBtnDiv>
        <TranslationOnOFFButton onClick={handleTranslationButtonClick}>
          {showTranslation ? (
            <FlagDiv>
              <FlagImgCanada image_source={CanadaFlagSrc}></FlagImgCanada>
              <FlagImgQuebec image_source={QuebecFlagSrc}></FlagImgQuebec>
            </FlagDiv>
          ) : (
            <FlagDiv>
              <FlagImgCanada image_source={CanadaFlagSrc}></FlagImgCanada>
              <FlagImgQuebecFaded
                image_source={QuebecFlagSrc}
              ></FlagImgQuebecFaded>
            </FlagDiv>
          )}
        </TranslationOnOFFButton>
      </TranslationBtnDiv>
    </PlayerWrapper>
  );
}
const PlayerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 925px;
  justify-content: flex-end;
  padding-bottom: 5px;
`;

const PlayerDiv = styled.div`
  flex-grow: 4;
`;

const TranslationOnOFFButton = styled.button`
  background-color: transparent;
  /* border: 2px solid ${COLORS_SHOPIFY_BLUE_PALLETE.Light}; */
  border-radius: 10px;
  border: 0px;
`;

const TranslationBtnDiv = styled.div`
  display: flex;
  justify-content: space-around;
  flex-grow: 0;
`;

const FlagImgCanada = styled.div`
  background-image: url("${(props) => props.image_source}");
  height: 35px;
  width: 70px;
  background-size: contain;
  background-repeat: no-repeat;
`;
const FlagImgQuebec = styled.div`
  background-image: url("${(props) => props.image_source}");
  height: 35px;
  width: 70px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const FlagImgQuebecFaded = styled.div`
  background-image: url("${(props) => props.image_source}");
  height: 35px;
  width: 70px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.25;
`;

const FlagDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 150px;
  justify-content: space-between;
`;

export default Player;
