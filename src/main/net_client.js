'use strict'
var net = require('net');
class NetClient{
    constructor(server_ip, server_port){
        this.server_ip = server_ip;
        this.server_port = server_port;
        this.socket = new net.Socket();
    }
    Connect(){
        console.log("socket connect to "+ this.server_ip + ":" + this.server_port);
        var _this = this;
        return new Promise((resolve, reject) =>{
            _this.socket.on("connect", function(){
                console.log("connect ok!!!!!!!!!")
                resolve("");
            })
            _this.socket.on("error", function(err){
                console.log("connect faild!!!!!!!!!")
                reject(err);
            })
            _this.socket.connect(_this.server_port, _this.server_ip);
            
        })
    };
}

export {NetClient};