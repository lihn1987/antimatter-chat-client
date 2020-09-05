'use strict'
var net = require('net');
class NetClient{
    constructor(server_ip, server_port){
        this.server_ip = server_ip;
        this.server_port = server_port;
        this.socket = new net.Socket();
        var that = this;
        this.socket.on("connect", function(){
            that.OnConnect.call(that)
        })
        this.socket.on("error", function(err){
            that.OnError.apply(that, err)
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
    OnConnect(){
        if(this.on_connect)this.on_connect();
        
        console.log("connect ok!!!!!!!!!")
    }
    OnError(err){
        if(this.on_error)this.on_error();
        console.log("connect faild!!!!!!!!!")
    }
}

export {NetClient};