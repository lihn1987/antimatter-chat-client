/*
To process message generation and parsing
*/

var ProtoBuf = require("protobufjs");
const MSG_START = 0x00000000;
const MSG_Ping = 0x00000001;
const MSG_Pong = 0x00000002;
const MSG_LoginRequest = 0x00000003;
const MSG_LoginResponse = 0x00000004;
const MSG_TextMessageRequest = 0x00000005;
const MSG_TextMessageresponse = 0x00000006;
var MsgEncoder = (async ()=>{
    MsgEncoder = await InitEncoder();
})()

//Initialize the encoder
function InitEncoder(){
    return new Promise((resolve, reject)=>{
        var rtn = Object;
        ProtoBuf.load("./static/proto/base.proto", function(err, root) {
            if (err){
                reject(err)
            }else{
                rtn.net = Object;
                rtn.net.Ping = root.lookup("net.Ping");
                rtn.net.PingType = MSG_Ping;

                rtn.net.Pong = root.lookup("net.Pong");
                rtn.net.PongType = MSG_Pong;

                rtn.net.LoginRequest = root.lookup("net.LoginRequest");
                rtn.net.LoginRequestType=MSG_LoginRequest;

                rtn.net.LoginResponse = root.lookup("net.LoginResponse");
                rtn.net.LoginResponseType=MSG_LoginResponse;

                rtn.net.TextMessageRequest = root.lookup("net.TextMessageRequest");
                rtn.net.TextMessageRequestType=MSG_TextMessageRequest;

                rtn.net.TextMessageresponse = root.lookup("net.TextMessageresponse");
                rtn.net.TextMessageresponseType=MSG_TextMessageresponse;

                resolve(rtn);
            }
        })
    });
}
export {MsgEncoder};
