'use strict'

import { app, BrowserWindow } from 'electron'
const secp256k1 = require('secp256k1')
const electron = require('electron')
var Web3 = require('web3');
var web3 = new Web3();

const buffer = require('buffer');
import {NetClient} from "./net_client";
var chat_client = new NetClient("192.168.31.61", 9987)

//create path
const USER_HOME = process.env.HOME || process.env.USERPROFILE
var config_path = USER_HOME+"/antimatter/"
var keystore_path = USER_HOME+"/antimatter/keystore/";
var path= require("path");
var fs = require("fs");

try{fs.mkdirSync(path.resolve(config_path))}catch(e){}
try{fs.mkdirSync(path.resolve(keystore_path))}catch(e){}
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  electron.Menu.setApplicationMenu(null)
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const { ipcMain } = require('electron')
ipcMain.on('test', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})

ipcMain.on('create_account', (event, arg) => {
  console.log("创建账户")
  var accout_str = JSON.stringify(web3.eth.accounts.encrypt(web3.eth.accounts.create().privateKey, arg.password))
  console.log("要创建的账户为:"+accout_str);
  var file_path = keystore_path+arg.username;
  file_path = path.resolve(file_path)
  fs.writeFile(file_path, accout_str,  function(err) {
    if (err) {
      event.returnValue = 0;
    }
    event.returnValue = 1;
  });
})
ipcMain.on('get_account_list', (event, arg) => {
  fs.readdir(keystore_path,function(err,files){  
    if(err){  
        console.warn(err)   
    }else{  
      var rtn = []
      files.forEach(function(filename){  
        var filedir = path.join(keystore_path, filename); 
        var stats = fs.statSync(filedir)
        var isFile = stats.isFile(); 
        if(isFile){  
            rtn.push(filename) 
        } 
      });  
      event.returnValue = rtn; 
    }  
  }) 
})

ipcMain.on('login', (event, arg) => {
  fs.readFile(keystore_path+arg.accout, function (err, data) {
    if (err) {
      event.returnValue = -1;
      return; 
    }else{
      console.log(data.toString());
      try{
        var result = web3.eth.accounts.decrypt(JSON.parse(data.toString()), arg.passwd);
        console.log(result)
        chat_client.Connect(
          function(){
            //获取公钥
            const pub_key_buf_compress = secp256k1.publicKeyCreate(Buffer.alloc(32, result.privateKey.substring(2), "hex"),true);
            console.log(Buffer.from(pub_key_buf_compress,'hex').toString('hex'))
            event.returnValue = 0;
          },function(){
            event.returnValue = -3; 
          })
      }catch(e){
        console.log(e)
        event.returnValue = -2;
        return; 
      }
       
    }
  });
  //web3.eth.accounts.wallet.()
  /*chat_client.Connect().then(function(data){
    event.returnValue = 1;
  }).catch(function(err){
    event.returnValue = 0; 
  })*/
  //console.log(arg.accout + "~~" + arg.passwd)
})



