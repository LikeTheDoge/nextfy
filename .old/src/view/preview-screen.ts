import { Global } from '@/model/Global'
import { GunPart } from '@/model/GunPart';
import { full } from '@/style/common';
import { CanvasHandle } from '@/utils/canvas';
import { Matrix3x3, Move, Point, Scale, Transfrom } from '@/utils/coordinate';
import { canvas, div } from '@/utils/dom';
import { Size } from '@/utils/position';
import { Mut, R, ReactiveBinder, Ref, Watcher } from '@/utils/reactive';
import { MouseMovement } from '@/utils/touch';
import { css, WatcherView } from '@/utils/view';

const size = Global.preview.size
const scale = Global.preview.scale
const offset = Global.preview.offset
const parts = Global.parts


@css({
    '': { ...full(), 'overflow': 'hidden' },
    'canvas': { 'background': 'transparent' }
})
export class PreviewScreen extends WatcherView<never> implements Watcher<PreviewGunPartLayer[]>, Watcher<Size>, Watcher<Move>, Watcher<Scale>{


    private handle: CanvasHandle<HTMLCanvasElement> = CanvasHandle.element()
    private movement: MouseMovement = MouseMovement.create()
    private layers = R.compute(() => parts.val().map(part => new PreviewGunPartLayer(this, part)))

    private ro = new ResizeObserver(entries => {
        for (let entry of entries) {
            size.update(Size.create(
                Math.floor(entry.contentRect.width),
                Math.floor(entry.contentRect.height)
            ))
        }
    })


    protected created(): void | Promise<void> {
        this.setRoot([div, [
            [() => this.handle.target]]
        ])

        this.resize()
        this.render()

        this.ro.observe(this.handle.target)
        this.movement.target(this.handle.target)

        this.movement.getNow = () => offset.val().offset
        this.movement.move = (from, move) => {
            const s = scale.val().ratio.x
            offset.update(Transfrom.move(
                Point.create(from.x + move.x / s, from.y + move.y / s)
            ))
        }

        size.attach(this)
        scale.attach(this)
        offset.attach(this)
        this.layers.attach(this)
        
    }


    private resize() {
        this.handle.resize(size.val())
    }

    render() {
        this.handle.clear()
        const matrix = Matrix3x3.blank()
        scale.val().matrix(matrix)
        offset.val().matrix(matrix)
        this.handle.transform(matrix)
        this.handle.rect(Point.create(0), Size.create(10, 10), { fill: true })

        this.handle.transform(null)
        this.layers.val().forEach(layer => {
            this.handle.source(layer.handle, Point.create(0))
        })
    }

    emit(r: Ref<Size> | Ref<Move> | Ref<Scale> | Ref<PreviewGunPartLayer[]>) {
        if (r === size) this.resize()
        this.render()
    }


}


class PreviewGunPartLayer implements Watcher<GunPart>, Watcher<Size>, Watcher<Move>, Watcher<Scale>{


    handle: CanvasHandle<any>
    private screen: PreviewScreen
    part: Ref<GunPart>

    constructor(screen: PreviewScreen, part: Ref<GunPart>) {
        this.screen = screen
        this.part = part
        part.attach(this)
        this.handle = CanvasHandle.offscreen(size.val())
        this.handle.resize(size.val())
        this.render()

        ;(window as any).s?(window as any).s.push(this): (window as any).s = [this]
    }

    render() {
        this.handle.clear()
        const matrix = Matrix3x3.blank()
        scale.val().matrix(matrix)
        offset.val().matrix(matrix)
        this.handle.transform(matrix)
        this.handle.source(this.part.val().image, Point.create(0))
    }

    resize() {
        this.handle.resize(size.val())
    }

    remove() {
        this.render()
    }

    rescale() {
        this.render()
    }

    recycle() {
        R.recycle(this)
    }

    emit() {
        this.screen.render()
        this.screen.render()
    }
}


