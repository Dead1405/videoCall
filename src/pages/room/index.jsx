import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function randomID(len) {
  let result = "";
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

const RoomPage = () => {
  const { roomId } = useParams();
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.current.push(event.data);
    }
  };

  const saveAudio = async () => {
    const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audioFile", audioBlob, `${roomId}.webm`);

    // Send the blob to the server
    await fetch("/api/upload-audio", {
      method: "POST",
      body: formData,
    });
  };

  const startRecording = (stream) => {
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = handleDataAvailable;
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    saveAudio(); // save the audio after stopping the recording
  };

  const myMeeting = async (element) => {
    const appId = 1930029180;
    const serverSecret = "586a2ddf584dc1c1fd241a1709199a0e";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId,
      randomID(5),
      randomID(5)
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    const room = await zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });

    // Capture the audio stream
    const audioStream = room.stream.getAudioTracks();
    if (audioStream.length) {
      startRecording(new MediaStream(audioStream));
    }

    // Stop recording when the meeting ends
    zp.on("roomLeave", () => stopRecording());
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="room-page">
      <div ref={myMeeting} />
    </div>
  );
};

export default RoomPage;
