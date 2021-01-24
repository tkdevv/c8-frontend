import React, { useState, useContext, useRef, useEffect } from "react";
import { GameAndPlayerContext } from "./context/GameContext";
import Peer from "peerjs";

const VoiceChat = ({ socket }) => {
  const [{ game, player }] = useContext(GameAndPlayerContext);
  const [callObject, setCallObject] = useState(null);
  const voiceChatroom = game.players.filter((player) => player.voiceChatAvail);
  const [chatLoading, setChatLoading] = useState(true);
  const [initiated, setInitiated] = useState(false);
  const [peer, setPeer] = useState(null);
  const [connectionErr, setConnectionErr] = useState(true);

  const connectPeer = () => {
    setPeer(
      new Peer(undefined, {
        host: "/",
        port: "9000",
      })
    );
    if (peer) console.log(peer.disconnected);
    if (peer) setConnectionErr(peer.disconnected);
  };

  // PEER
  !peer && player && game.players.length > 0 && connectPeer();

  peer &&
    peer.on("open", (id) => {
      setConnectionErr(false);
      const credentials = { gameId: game.id, playerId: player.id, vcid: id };
      socket.emit("vcid", credentials);
    });

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

  // console.log(peer);

  const leaveVoiceChat = () => {
    if (streamRef.current) {
      let stream = streamRef.current;
      stream.getTracks().forEach((track) => track.stop());
      socket.emit("leave voice", credentials);
      if (callObject) {
        callObject.close();
        removeStreamFromDOM();
        setCallObject(null);
      }
    }
  };

  if (chatLoading && !initiated) {
    setInitiated(true);
    setTimeout(() => setChatLoading(false), 6500);
  }

  peer &&
    !connectionErr &&
    peer.on("error", () => {
      console.log("Peer connection error.");
      setConnectionErr(true);
      leaveVoiceChat();
    });

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

        socket.emit("join voice", credentials);

        peer.on("call", (call) => {
          // console.log("Receiving Call");
          setCallObject(call);
          call.answer(streamObj);

          call.on("close", () => {
            console.log("call closed");
          });

          call.on("stream", (userStream) => {
            // console.log("calling stream: ", userStream);
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
    console.log("HAPPENINGS");
    voiceChatroom.forEach((playerObj) => {
      // console.log(playerObj.voiceChatId, player.id);
      if (playerObj.id !== player.id) {
        console.log("xxx: ", playerObj.handle);
        const call = peer.call(playerObj.voiceChatId, streamObj);
        if (!callObject) setCallObject(call);
        call.on("stream", (theirStream) => {
          console.log("their stream");
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

  // if (peer) console.log(peer.disconnected);

  return (
    <div
      style={chatLoading ? { display: "none" } : {}}
      className="voice-chat-container"
    >
      {(!peer || connectionErr) && (
        <button className="vc-btn-offline" onClick={connectPeer}>
          VOICE OFFLINE
        </button>
      )}

      {peer && !connectionErr && (
        <button
          className={`vc-btn${playerInVoiceChat ? " vc-btn-on" : ""}`}
          onClick={() =>
            playerInVoiceChat ? leaveVoiceChat() : joinVoiceChat()
          }
        >
          {playerInVoiceChat ? "VOICE OFF" : "VOICE ON"}
        </button>
      )}

      <div className="vc-indicators-container">
        {voiceChatroom.map((player) => (
          <div key={player.id + "fsdxj"} className="vc-indicator"></div>
        ))}
      </div>

      {referenceNames.map((str) => (
        <audio
          onLoadedMetadata={(e) => e.currentTarget.play()}
          key={str + "sfdc"}
          src=""
          ref={audRef[str]}
        ></audio>
      ))}
    </div>
  );
};

export default VoiceChat;
