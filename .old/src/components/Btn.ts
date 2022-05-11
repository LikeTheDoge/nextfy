import { shadow } from "@/style/common";
import { cls, div, refs } from "@/utils/dom";
import { Mut, Watcher } from "@/utils/reactive";
import { css, WatcherView } from "@/utils/view";

@css({
    '.slider-btn': {
        'position': 'relative',
        'margin': '0 12px',
        'padding': '13px 0'
    },
    '.slider-btn::before': {
        ...shadow(2),
        'content': '""',
        'display': 'block',
        'height': '4px',
        'borderRadius': '2px',
        'position': 'relative',
        'background': '#ddd',

    },
    '.slider-btn-slider': {
        ...shadow(3),
        'top': '2px',
        'position': 'absolute',
        'height': '24px',
        'width': '24px',
        'cursor': 'pointer',
        'borderRadius': '50%',
        'background': '#66ccff',
        'transform': 'translateX(-12px)'
    },
})
export class SliderButton extends WatcherView<never> implements Watcher<number>{

    target: Mut<number>
    current: number
    move: SliderMovement

    refs = refs('root', 'slider')

    constructor(target: Mut<number>) {
        super()
        this.target = target
        this.current = this.target.val()
        this.setRoot([div, cls('slider-btn'), this.refs.root, [
            [div, cls('slider-btn-slider'), this.refs.slider]
        ]])


        this.move = new SliderMovement(
            this.refs.root.target,
            this.refs.slider.target
        )

        this.move.getNow = () => this.target.val()
        this.move.move = (s) => { this.target.update(s) }

        
        this.target.attach(this)

        this.emit()

    }

    emit() {
        this.refs.slider.target.style.left = this.target.val() * 100 + "%"
    }

}


class SliderMovement {

    el: HTMLElement
    silder: HTMLElement

    from?: number | 'start'
    now: number = 0

    constructor(el: HTMLElement, silder: HTMLElement) {
        this.el = el
        this.silder = silder

        this.silder.onmousedown = () => {
            this.from = 'start'
            this.now = this.getNow()
            this.silder.classList.add('mouse-move')

            let { width } = this.el.getBoundingClientRect()

            const move = (e: MouseEvent) => {
                if (!this.from)
                    return
                else if (this.from === 'start')
                    this.from = e.clientX
                else {
                    let x = e.clientX - this.from
                    x = x / width + this.now
                    x = x > 1 ? 1 : x < 0 ? 0 : x
                    this.move(x)
                }
            }
            const done = () => {
                this.el.classList.remove('mouse-move')
                document.removeEventListener('mousemove', move)
                document.removeEventListener('mouseleave', done)
                document.removeEventListener('mouseup', done)
                this.done()
                this.from = undefined
            }

            document.addEventListener('mousemove', move)
            document.addEventListener('mouseleave', done)
            document.addEventListener('mouseup', done)
        }

    }

    move: (num: number) => void = (n) => { console.log(n) }
    done: () => void = () => { }
    getNow: () => number = () => 0
}