const express = require('express'); // 載入 express 檔案
const app = express(); // 建立 express 伺服器
const url = require('url'); // 用來抓url內容
const { WebSocketServer } = require('ws');
const wsServer = require('ws').Server; // 載入 ws 檔案
wss = new WebSocketServer({port: 8230}); // 設定 ws 的 port 號
app.listen(3000, function(){ // localhost:3000
    console.log("Running on port 3000!"); // console 輸出
    console.log("---------------------");
});

var Index = ['0']; // 宣告陣列用來存放目前線上數量
var wsArray = {}; // 宣告ws物件，接收伺服器傳送的訊息

// ws溝通
wss.on('connection', function(ws, req){ // 當有新的使用者連線時執行
    const location = url.parse(req.url); // 取得 Url
    const name = location.path.substring(1); // 取得名字
    ws.send("Hello!" + name); // server 傳送訊息

    const time = new Date();
    for(var i = 1; i < Index.length; i++){
        if(i != ws.id){ // 傳給這次連線的人
            wsArray[i].send(name + ' joined to the roooom at: ' + time.toLocaleDateString());
        }
    }

    for(var i = 0; i <= Index.length; i++){
        if(!Index[i]){
            Index[i] = i; // 儲存目前總共有幾個連線
            ws.id = i; // 儲存id到ws物件 之後可以用到
            ws.name = name; // 儲存name到ws物件
            wsArray[ws.id] = ws; // 宣告陣列內容為ws物件
            break;
        }
    }

    // 使用者傳訊息
    ws.on('message', function(msg){ // ws收到訊息時執行 msg是使用者傳來的
        ws.send(msg);
        for(var i = 1; i < Index.length; i++){
            if(i != ws.id){
                wsArray[i].send(ws.name + " : " + msg);
            }
        }
    });

    // 使用者離線
    ws.on('close', function(){
        for(var i = 1; i < Index.length; i++){
            if(i != ws.id){
                wsArray[i].send(ws.name + " left!!");
            }
        }
    });
});