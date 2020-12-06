'use strict'
var net = require('net');
const secp256k1 = require('secp256k1')
const crypto = require('crypto');
const buffer = require('buffer');
import {MsgEncoder} from "./msg.js";
class NetClient{
    constructor(server_ip, server_port, prikey){
        this.server_ip = server_ip;
        this.server_port = server_port;
        this.prikey = prikey;
        this.socket = new net.Socket();
        this.index = 0;
        var that = this;
        this.socket.on("connect", function(){
            that.OnConnect.call(that)
        })
        this.socket.on("error", function(err){
            that.OnError.call(that, err)
        })
        this.on_connect = null;
        this.on_error = null;
        
    }
    Connect(on_connect, on_error){
        this.socket.destroy()
        console.log("socket connect to "+ this.server_ip + ":" + this.server_port);
        this.socket.connect(this.server_port, this.server_ip);
        this.on_connect = on_connect;
        this.on_error = on_error;
    };
    StartTimeheart(){
        let that = this;
        setInterval(function(){
            let unix_time = (new Date()).valueOf();
            let msg = MsgEncoder.net.Ping.create(
                {
                    version:1, 
                    unixTime:unix_time,
                    index:that.index++
                }
            );
            
            let buffer_content = MsgEncoder.net.Ping.encode(msg).finish();
            let buffer_head = new Buffer.alloc(8);
            buffer_head.writeUInt32LE(buffer_content.length+4, 0, 4)
            buffer_head.writeUInt32LE(MsgEncoder.net.PingType, 4, 4)
            that.socket.write(Buffer.concat([buffer_head, buffer_content]));
            console.log(Buffer.concat([buffer_head, buffer_content]));
            console.log("write heart");
        },10000);
    }
    Login(){
        
        //var ProtoBuf = require("protobufjs");
        //console.log(MsgEncoder)
        let unix_time = (new Date()).valueOf();
        let pubkey = secp256k1.publicKeyCreate(Buffer.alloc(32, this.prikey.substring(2), "hex"),true);
        let index = this.index++;
        let buf_unix_time_low = Buffer.alloc(4);
        buf_unix_time_low.writeUInt32LE(unix_time>>32)
        let buf_unix_time_high = Buffer.alloc(4);
        buf_unix_time_high.writeUInt32LE(unix_time && 0x00000000ffffffff)
        let buf_index = Buffer.alloc(4);
        buf_index.writeUInt32LE(index)
        let sign_buf = Buffer.concat([
            Buffer(pubkey),
            buf_unix_time_low,
            buf_unix_time_high,
            buf_index]);
   
        //sign_buf.writeBigUInt64LE(unix_time);
        //sign_buf.writeUint32LE(index);
        const hash_crypto = crypto.createHash('sha256');
        hash_crypto.update(sign_buf);
        let hash = hash_crypto.digest()
        console.log("start login")
        console.log("private key:", this.prikey)
        console.log("public key:",Buffer(pubkey).toString("hex"));
        console.log("index:",index);
        console.log("sign_buf:",sign_buf.toString("hex"));
        console.log("hash:",hash.toString("hex"));

        /*let sign = 0;
        let msg = MsgEncoder.net.LoginRequest.create(
            {
                publicKey:pubkey,
                timeStamp:unix_time,
                index:index,
                sign = 4;
            }
        );*/
    }
    OnConnect(){
        if(this.on_connect)this.on_connect();
        console.log("connect ok!!!!!!!!!")
        this.StartTimeheart();
    }
    OnError(err){
        if(this.on_error)this.on_error();
        console.log("connect faild!!!!!!!!!")
        console.log(MsgEncoder)
        //this.Login();
    }
}

export {NetClient};