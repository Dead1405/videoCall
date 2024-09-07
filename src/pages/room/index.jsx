import React from "react";
import {useParams} from "react-router-dom";
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'

function randomID(len) {
    let result = '';
    if (result) return result;
    var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
      maxPos = chars.length,
      i;
    len = len || 5;
    for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  }

const RoomPage = () => {
    const {roomId} = useParams();
    
    const myMeeting = async(element) => {
        const appId = 1930029180;
        const serverSecret = "586a2ddf584dc1c1fd241a1709199a0e";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appId, 
            serverSecret,
            roomId,
            randomID(5),
            randomID(5),
        );
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            },
        });

    };

    return (
        <div className="room-page">
            <div ref={myMeeting}/>
        </div>
    );
};

export default RoomPage;