import { Mut, R } from "@/utils/reactive"
import { Size } from "@/utils/position"
import { Move, Point, Scale, Transfrom } from "@/utils/coordinate"
import { GunPart } from "./GunPart"
import { Img } from "@/utils/image"


export const Global = new class {
    preview = {
        size: R.val(Size.window()) as Mut<Size>,
        scale: R.val(Transfrom.scale(Point.create(1))) as Mut<Scale>,
        offset: R.val(Transfrom.move()) as Mut<Move>
    }
    parts: Mut<Mut<GunPart>[]> = R.val([])
}()

const img0 = Img.src('http://localhost:3000/1911/滑套.png')
const img1 = Img.src('http://localhost:3000/1911/下身.png')
const img2 = Img.src('http://localhost:3000/1911/击锤.png')

console.log(img0, img1, img2)

Promise.all([img0, img1, img2]).then((list) => {
    Global.parts.update(list.map(img => R.val(new GunPart(img))))
})


;
(window as any).g = Global