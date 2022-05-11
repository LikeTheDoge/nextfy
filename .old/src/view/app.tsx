import { SliderButton } from '@/components/Btn';
import { Global } from '@/model/Global';
import { Point, Transfrom } from '@/utils/coordinate';
import { div, id } from '@/utils/dom';
import { R } from '@/utils/reactive';
import { css, View } from '@/utils/view'
import { AppLayout} from './layout';
import { PreviewScreen } from './preview-screen';


@css({
    '&': {
        'background': "#fff",
        'minWidth': '800px',
        'height': '100%'
    }
})
export class App extends View {
    protected created(): void | Promise<void> {
        this.setRoot([div, id('app'), [
            new AppLayout()
                .insert('preview', new PreviewScreen())
                .insert('controls', new SliderButton(R.translate(
                    () => {
                        const s = (v: number) => ((Math.log(v) / Math.log(4)) + 1) / 2
                        const num = Global.preview.scale.val().ratio.x
                        return s(num)
                    },
                    num => {
                        const m = (v: number) => 4 ** (2 * (v - 0.5))
                        const s = Transfrom.scale(Point.create(m(num)))
                        Global.preview.scale.update(s)
                    }
                )))
        ]])
    }
}