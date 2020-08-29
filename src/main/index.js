'use strict'

import { app, BrowserWindow } from 'electron'

const electron = require('electron')
var Web3 = require('web3');
var web3 = new Web3();
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
  console.log(arg) // prints "ping"
  //var data = await web3.eth.personal.newAccount(arg.password)
  console.log(web3.eth.accounts.wallet.create(1))
  console.log(web3.eth.accounts.wallet.encrypt(arg.password))
  var file_path = keystore_path+arg.username;
  file_path = path.resolve(file_path)
  fs.writeFile(file_path, JSON.stringify(web3.eth.accounts.wallet.encrypt(arg.password)[0]),  function(err) {
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
  chat_client.Connect().then(function(data){
    event.returnValue = 1;
  }).catch(function(err){
    event.returnValue = 0; 
  })
})



