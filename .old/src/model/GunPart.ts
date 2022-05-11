import { Transfrom } from "@/utils/coordinate";
import { Img } from "@/utils/image";

export class GunPart {
    image:Img
    name:string = ''
    transfrom : Transfrom[] = []
    constructor(image:Img){
        this.image = image
    }
}