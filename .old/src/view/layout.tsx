import { flex, shadow } from "@/style/common";
import { cls, div, style } from "@/utils/dom";
import { css, View } from "@/utils/view";

@css({
    '&': { height: '100%' },
    '.sider': { width: '400px' },
    '.content': {},
    '.control': { height: '100px' }
})
export class MainLayout extends View<'screen' | 'control'>{


    created() {
        this.setRoot([div, style(flex.row()), [
            [div, cls('content'), style(flex.fill(), flex.col()), [
                [div, cls('control'), this.slot('control'), style(flex.fixed(), { padding: '45px 0' })],
                [div, cls('screen'), style(flex.fill()), [new CardContainer().insert('inner', [div, style({ width: '100%', height: '100%' }), this.slot('screen')])]],
            ]],
            [div, cls('sider'), style(flex.fixed())],
        ]])
    }
}

@css({
    '&.outer': { height: '100%', width: '100%', padding: '12px' },
    '.inner': { ...shadow(4), backgroundColor: '#fff', height: '100%', width: '100%' },
})
export class CardContainer extends View<'inner'>{

    protected created(): void | Promise<void> {
        this.setRoot([div, cls('outer'), [
            [div, cls('inner'), this.slot('inner')]
        ]])
    }
}


@css({
    '&.outer': { height: '100%', width: '100%', position: 'relative' },
    '.preview': {
        height: '100%', width: '100%', position: 'absolute',top:'0',left:'0',
    },
    '.controls': { height: '100%', width: '100%', position: 'absolute' ,top:'0',left:'0',
    pointerEvents: 'none'},
    '.controls--panel': {
        height: 'auto', width: '100%', position: 'relative',
        pointerEvents: 'auto'
    }
})
export class AppLayout extends View<'preview' | 'controls'>{
    protected created(): void | Promise<void> {
        this.setRoot([div, cls('outer'), [
            [div, cls('preview'),  this.slot('preview')],
            [div, cls('controls'), [
                [div, cls('controls--panel'), this.slot('controls')]
            ]]
        ]])
    }
}
