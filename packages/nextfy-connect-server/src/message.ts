import { Effect, R, Ref } from "nextfy-reactive"
import { Connection } from "./connect"

export interface Transporter {
    events(): { [key: string]: (connect: Connection, payload: any) => void }
}
export class ValueTransporter<T extends Object> implements Transporter {

    name: string = ''
    value: Ref<T>
    connections: Connection[]
    effect: Effect<T>

    constructor(name: string, connection: Connection[], value: Ref<T>) {
        this.name = name
        this.value = value
        this.connections = connection
        this.value.attach(this.effect = R.effect(() => { this.connections.forEach(v => v.send(`changed:${this.name}`, null)) }))
    }

    events() {
        return {
            [`get:${this.name}`]: (connect: Connection) => {
                connect.send(`val:${this.name}`, this.value.val())
            }
        }
    }
}
export type Record = { version: string, json: () => any }

export class UpdateTransporter<T extends Record> implements Transporter {


    name: string = ''
    connections: Connection[]
    records: T[] = []

    constructor(name: string, connection: Connection[]) {
        this.name = name
        this.connections = connection
    }

    events() {
        return {
            ['from:' + this.name]: (connect: Connection, { version }: { version: string }) => {
                const fromIndex = this.records.findIndex(v => v.version === version)
                if (fromIndex < 0) return

                const updation = this.records.filter((_, i) => i > fromIndex).map(v => v.json())

                connect.send(`updation:${this.name}`, {
                    from: version, updation,
                    to: this.records[this.records.length - 1].version,
                })
            }
        }
    }
 
    update(t: T) {
        this.records.push(t)
        const version = t.version
        this.connections.forEach(v => v.send(`update:${this.name}`, { version }))
    }
}