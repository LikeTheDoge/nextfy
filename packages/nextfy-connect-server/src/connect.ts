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
    Created, // 开始建立 ws 链接
    Inited, // 成功建立 ws 链接，开始处理 id 
    Registed, //收到需监听 Zone 的名称, 成功建立 Connection 通信
}

export class Connection {
    private ws: WebSocket
    status: ConnectStatus = ConnectStatus.Created
    connectId: string = Math.random().toString()
    listener: Map<string, Function> = new Map()
    watch: string[] = []

    private on(event: string, fn: Function) {
        this.listener.set(event, fn)
    }
    private off(event: string) {
        this.listener.delete(event)
    }


    constructor(ws: WebSocket) {
        this.ws = ws
        this.create()
    }

    private create() {
        this.ws.on('connection', () => {
            this.init()
        })
        this.ws.on('message', (data, isBinary) => {
            if (!isBinary) return
            // todo: 异常处理
            const { event, playload } = JSON.parse(data.toString())
            const listener = this.listener.get(event)
            if (listener) listener(playload)
        })
    }

    private init() {
        this.status = ConnectStatus.Inited
        this.send('init', this.connectId)
        this.on('regist', (playload: string[]) => {
            this.watch = this.watch.concat(playload)
            this.regist()
            this.off('regist')
        })
    }

    private regist() {

    }

    send(event: string, payload: any) {
        this.ws.send(JSON.stringify({ event, payload }))
    }
}