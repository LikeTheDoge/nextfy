import { WebSocket } from 'ws'



export enum ConnectEventType {

}

/* 
Connect 建立流程
    1. 客户端发起 ws 链接, 服务端收到 ws 链接
    2. ws 链接成功
    3. 服务端向客户端发送 connectId
    4. 客户端收到 connectId 并保存
    5. 客户端向服务端发送其所需要监听 Zone 的名称
    6. 服务端收到监听 Zone 的名称，添加监听函数，完成 Connect
*/
export enum ConnectStatus {
    BeforeInit, // 开始建立 ws 链接
    Inited, // 成功建立 ws 链接，开始处理 id 
    Installed, // 成功建立 Connection 通信
    Registed, // 

}


export class Connection {
    ws: WebSocket
    connectId = Math.random().toString()
    constructor(ws: WebSocket) {
        this.ws = ws
    }

}