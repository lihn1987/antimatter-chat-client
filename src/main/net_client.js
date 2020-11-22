'use strict'
var net = require('net');
import {MsgEncoder} from "./msg.js";
class NetClient{
    constructor(server_ip, server_port, prikey){
        this.server_ip = server_ip;
        this.server_port = server_port;
        this.prikey = prikey;
        this.socket = new net.Socket();
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
    Login(){
        //var ProtoBuf = require("protobufjs");
        //console.log(MsgEncoder)
    }
    OnConnect(){
        if(this.on_connect)this.on_connect();
        console.log("connect ok!!!!!!!!!")
        //this.Login();
    }
    OnError(err){
        if(this.on_error)this.on_error();
        console.log("connect faild!!!!!!!!!")
        console.log(MsgEncoder)
        //this.Login();
    }
}

export {NetClient};