import React, { useState, useContext, useRef, useEffect } from "react";
import { GameAndPlayerContext } from "./context/GameContext";

const VoiceChat = ({ peer, socket }) => {
  const [{ player, game }] = useContext(GameAndPlayerContext);
  const [callObject, setCallObject] = useState(null);
  const voiceChatroom = game.players.filter((player) => player.voiceChatAvail);
  const [chatLoading, setChatLoading] = useState(true);
  const [initiated, setInitiated] = useState(false);

  const referenceNames = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
  ];
  const audRef = {};
  const streamRef = useRef();
  audRef["one"] = useRef();
  audRef["two"] = useRef();
  audRef["three"] = useRef();
  audRef["four"] = useRef();
  audRef["five"] = useRef();
  audRef["six"] = useRef();
  audRef["seven"] = useRef();
  audRef["eight"] = useRef();
  audRef["nine"] = useRef();
  audRef["ten"] = useRef();
  audRef["eleven"] = useRef();

  const playerInVoiceChat =
    voiceChatroom.filter((playerObj) => playerObj.id === player.id).length > 0;

  const credentials = { gameId: game.id, playerId: player.id };

  // console.log(player.voiceChatId);

  const leaveVoiceChat = () => {
    if (streamRef.current) {
      let stream = streamRef.current;
      // console.log(stream.active);
      stream.getTracks().forEach((track) => track.stop());
      // console.log(stream.active);
      socket.emit("leave voice", credentials);
      if (callObject) {
        callObject.close();
        removeStreamFromDOM();
        setCallObject(null);
      }
    }
  };

  useEffect(() => console.log(chatLoading), [chatLoading]);

  if (chatLoading && !initiated) {
    setInitiated(true);
    setTimeout(() => setChatLoading(false), 6500);
  }

  const joinVoiceChat = () => {
    const constraints = {
      audio: true,
      video: false,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((streamObj) => {
        streamRef.current = streamObj;
        sendPlayersMyAudio(streamObj);
        // console.log(streamObj);
        socket.emit("join voice", credentials);

        peer.on("call", (call) => {
          // console.log("Receiving Call");
          setCallObject(call);
          call.answer(streamObj);
          call.on("stream", (userStream) => {
            addStreamToDOM(userStream);
          });
        });
      })
      .catch((err) => {
        leaveVoiceChat();
      });
  };

  // console.log("Chatty: ", player.voiceChatAvail);

  const sendPlayersMyAudio = (streamObj) => {
    voiceChatroom.forEach((playerObj) => {
      // console.log(playerObj.voiceChatId, player.id);
      if (playerObj.id !== player.id) {
        console.log("xxx: ", playerObj.handle);
        const call = peer.call(playerObj.voiceChatId, streamObj);
        setCallObject(call);
        call.on("stream", (theirStream) => {
          addStreamToDOM(theirStream);
        });

        call.on("close", (theirStream) => {});
      }
    });
  };

  const removeStreamFromDOM = () => {
    referenceNames.forEach((ref) => {
      const refObj = audRef[ref].current;
      if (refObj && refObj.srcObject) audRef[ref].current.srcObject = undefined;
    });
  };

  const addStreamToDOM = (streamObject) => {
    const freeRef = () =>
      referenceNames.filter((ref) => {
        const refObj = audRef[ref].current;
        if (refObj && refObj.srcObject) return false;
        else return true;
      });

    const streamAlreadyRunning = () => {
      let returnVal = false;
      referenceNames.forEach((ref) => {
        const refObj = audRef[ref].current;
        if (
          refObj &&
          refObj.srcObject &&
          refObj.srcObject.id === streamObject.id
        )
          returnVal = true;
      });
      return returnVal;
    };

    if (freeRef().length > 0 && !streamAlreadyRunning())
      audRef[freeRef()[0]].current.srcObject = streamObject;
  };

  return (
    <div
      style={chatLoading ? { display: "none" } : {}}
      className="voice-chat-container"
    >
      <button
        className={`vc-btn${playerInVoiceChat ? " vc-btn-on" : ""}`}
        onClick={() => (playerInVoiceChat ? leaveVoiceChat() : joinVoiceChat())}
      >
        {playerInVoiceChat ? "VOICE OFF" : "VOICE ON"}
      </button>

      <div className="vc-indicators-container">
        {voiceChatroom.map((player) => (
          <div key={player.id + "fsdxj"} className="vc-indicator"></div>
        ))}
      </div>

      {referenceNames.map((str) => (
        <audio autoPlay key={str + "sfdc"} src="" ref={audRef[str]}></audio>
      ))}
    </div>
  );
};

export default VoiceChat;
