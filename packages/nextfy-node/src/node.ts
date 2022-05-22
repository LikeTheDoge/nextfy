export abstract class RenderNode {
    parent?: RenderElementNode
    root: RenderRoot
    nodeId: string = Math.random().toString()
    constructor(root: RenderRoot) {
        this.root = root
        this.root.regist(this)
    }
}

export class RenderTextNode extends RenderNode {
    text: string = ''
}

export class RenderElementNode extends RenderNode {
    tag: string = 'div'
    attr: { [key: string]: string } = {}
    style: Partial<CSSStyleDeclaration> = {}
    children: RenderNode[] = []
}

export class RenderRoot {
    nodes: Map<string, RenderNode> = new Map()
    target: RenderNode[] = []
    regist(node: RenderNode) {
        this.nodes.set(node.nodeId, node)
    }


    insertText(text: string, pos: { before?: string, parent?: string } = {},) {
        const node = Object.assign(new RenderTextNode(this), { text })
        this.insert(node, pos)
        return node
    }

    insertElement(
        { tag, attr = {}, style = {} }: { tag: string, attr?: { [key: string]: string }, style?: Partial<CSSStyleDeclaration> },
        pos: { before?: string, parent?: string } = {}
    ) {
        const node = Object.assign(new RenderElementNode(this), { tag, attr, style })
        this.insert(node, pos)
        return node
    }

    private insert(node: RenderNode, pos: { before?: string, parent?: string },) {
        if (pos.before) {
            const before = this.nodes.get(pos.before)
            if (!before)
                throw new Error('error before id !!!')
            if (before.parent)
                before.parent.children = before.parent.children
                    .flatMap(v => v === before ? [node, v] : [v])
            else
                this.target = this.target
                    .flatMap(v => v === before ? [node, v] : [v])
            node.parent = before.parent
        }
        else if (pos.parent) {
            const parent = this.nodes.get(pos.parent)
            if (!parent)
                throw new Error('error parent id !!!')
            if (!(parent instanceof RenderElementNode))
                throw new Error('parent is not a element node !!!')
            parent.children.push(node)
            node.parent = parent
        }
        else {
            this.target.push(node)
        }
        return node
    }
}