import { R, Mut } from 'nextfy-reactive'


/* 
Connect 建立流程
    1. 客户端发起 ws 链接, 服务端收到 ws 链接
    2. ws 链接成功
    3. 服务端向客户端发送 connectId
    4. 客户端收到 connectId 并保存
    5. 客户端向服务端发送其所需要监听 Zone 的名称
    6. 服务端收到监听 Zone 的名称，添加监听函数，完成 Connect
*/

export class Connect {
    ws: WebSocket
    listener: Map<string, Function> = new Map()

    constructor(ws: WebSocket) {
        if (ws.readyState != WebSocket.OPEN)
            throw new Error('connect: ws state error!')
        this.ws = ws
        this.init()
    }

    init() {
        this.ws.onmessage = (message: MessageEvent<any>) => {
            const data = message.data
            if (typeof data !== 'string')
                return // todo: 异常处理
            const { event, playload } = JSON.parse(data.toString())
            const listener = this.listener.get(event)
            if (listener) listener(playload)
        }
    }

    send(event: string, payload: any) {
        this.ws.send(JSON.stringify({ event, payload }))
    }

    on(event: string, fn: Function) {
        this.listener.set(event, fn)
    }

    off(event: string) {
        this.listener.delete(event)
    }
}

export abstract class Receiver {

    key: string = ''

    connect?: Connect

    listener: Map<string, Function> = new Map()

    abstract install(connect: Connect): void

    protected on(event: string, fn: Function) {
        this.listener.set(event, fn)
    }

    protected off(event: string) {
        this.listener.delete(event)
    }

    protected send(event: string, payload: any) {
        this.connect?.send(event, payload)
    }

}

export class ValueReceiver<T> extends Receiver {
    name: string = ''
    value: Mut<T>

    constructor(def: T) {
        super()
        this.value = R.val<T>(def)
    }


    install(conect: Connect) {
        this.connect = conect

        this.connect.on(`changed:${this.name}`, () => {
            this.onchange(this)
        })
        this.connect.on(`val:${this.name}`, (val: T) => { this.value.update(val) })
    }

    update() {
        this.connect?.send(`get:${this.name}`, null)
    }

    onchange: (_this: ValueReceiver<T>) => void = (_this) => {
        _this.update()
    }

}

export class UpdateReceiver<T> extends Receiver {

    name: string = ''
    version: string = ''

    install(connect: Connect) {
        this.connect = connect
        this.connect.on(`update:${this.name}`, ({ version }: { version: string }) => {
            if (this.version == version) return
            this.send(`from:${this.name}`, { version: this.version })
        })
        this.connect.on(`updation:${this.name}`, ({ to, from, updation }: { from: string, to: string, updation: T[] }) => {
            if (this.version == from)
                return
            this.version = to
            this.onupdate(this, updation)
        })
    }
    onupdate: (_this: UpdateReceiver<T>, list: T[]) => void = () => {}
}