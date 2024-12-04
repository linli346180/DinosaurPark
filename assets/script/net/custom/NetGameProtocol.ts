import { NetProtocolJson } from "../protocol/NetProtocolJson";
import { NetProtocolProtobuf } from "../protocol/NetProtocolProtobuf";
import { netChannel } from "./NetChannelManager";
import { NetCmd } from "./NetErrorCode";


/** 自定义Protobuf通讯协议 */
export class GameProtocol extends NetProtocolProtobuf {
    async onHearbeat() {
        // var ret = await netChannel.game.req(proto.ClientCmd.HEART.toString(), null!, "GameHeartResp");
        // if (ret.isSucc) {
        //     console.log(ret.res);
        // }
    }
}

