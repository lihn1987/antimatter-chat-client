/*
To process message generation and parsing
*/

var ProtoBuf = require("protobufjs");
const MSG_START = 0x00000000;
const MSG_PING = 0x00000001;
const MSG_PONG = 0x00000002;
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
                rtn.net.PingType = MSG_PING;
                rtn.net.Pong = root.lookup("net.Pong");
                rtn.net.PongType = MSG_PONG;
                resolve(rtn);
            }
        })
    });
}
export {MsgEncoder};
