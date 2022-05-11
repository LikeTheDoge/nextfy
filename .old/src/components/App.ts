import { css, View } from '@/utils/view'


@css('#app',el => { el.id = 'app'; return '#app' }, {
    '': {
        'background': "#ccc",
        'minWidth': '800px',
        'height': '100%'
    }
})
export class App extends View {
    $root =( document.querySelector('#app') as HTMLElement )|| document.createElement('div')
}