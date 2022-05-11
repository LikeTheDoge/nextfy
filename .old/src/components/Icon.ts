import { css, View } from '@/utils/view'

@css('.icon',el => { el.className += 'icon'}, {
    '': {
        'width': '1em',
        'height': '1em',
        'fill': 'currentColor',
        'overflow': 'hidden'
    },
    'svg':{
        'transform': 'translateY(10%)',
    }
})
export class Icon extends View {
    $root = document.createElement('i')
    constructor(name: string) {
        super()
        this.$root.innerHTML = `<svg aria-hidden="true" class="icon"><use xlink:href="#icon-${name}"></use></svg>`
    }
}