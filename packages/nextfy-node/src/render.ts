export enum RenderNodeType {
    TextNode, ElementNode,
}

export enum RenderOpCode {
    insertElement, insertText,
    cacheNode, moveNode,
    destoryNode,
}

export abstract class RenderNode {
    abstract type: RenderNodeType
    parent?: RenderElementNode
    root: RenderRoot
    nodeId: string = Math.random().toString()
    constructor(root: RenderRoot) {
        this.root = root
        this.root.nodes.set(this.nodeId, this)
    }
}

export class RenderTextNode extends RenderNode {

    type = RenderNodeType.TextNode
    text: string = ''
}

export class RenderElementNode extends RenderNode {
    type = RenderNodeType.ElementNode
    tag: string = 'div'
    attr: { [key: string]: string } = {}
    style: Partial<CSSStyleDeclaration> = {}
    children: RenderNode[] = []
}

export class RenderRoot {
    nodes: Map<string, RenderNode> = new Map()
    roots: RenderNode[] = []
    cache: RenderNode[] = []

    private prase(option: any) {
        if (!option || typeof option !== 'object')
            throw new Error('parse: node options error')
        const { type } = option

        if (type === RenderNodeType.ElementNode) {
            const { tag = 'div', attr = {}, style = {}, children = [] } = option
            return Object.assign(new RenderElementNode(this), {
                tag, attr, style, children: children.map((v: any) => this.prase(v))
            })
        }
        if (type === RenderNodeType.TextNode) {
            const { text = '' } = option
            return Object.assign(new RenderTextNode(this), { text })
        }

        throw new Error('parse: node type error')
    }

    private get(nodeId: string) {
        const node = this.nodes.get(nodeId)
        if (!node) throw new Error('remove: node is not found!!!')
        return node
    }

    // 将节点插入 node 树中
    private insert(node: RenderNode, pos: { before?: string, parent?: string }) {
        if (pos.before) {
            const before = this.nodes.get(pos.before)
            if (!before)
                throw new Error('error before id !!!')
            if (before.parent)
                before.parent.children = before.parent.children
                    .flatMap(v => v === before ? [node, v] : [v])
            else
                this.roots = this.roots
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
            this.roots.push(node)
        }
        return node
    }
    // 将节点从 node 树中取出
    private unlink(node: RenderNode) {
        // 从 node 树中取出 node
        if (node.parent) {
            node.parent.children = node.parent.children.filter(v => v.nodeId !== node.nodeId)
        } else {
            this.roots = this.roots.filter(v => v.nodeId !== node.nodeId)
            this.cache = this.cache.filter(v => v.nodeId !== node.nodeId)
        }
    }

    [RenderOpCode.insertText](text: string, pos: { before?: string, parent?: string } = {},) {
        const node = Object.assign(new RenderTextNode(this), { text })
        this.insert(node, pos)
        return node
    }
    [RenderOpCode.insertElement](option: any, pos: { before?: string, parent?: string } = {}) {
        const node = this.prase(option)
        this.insert(node, pos)
        return node
    }
    [RenderOpCode.destoryNode](nodeId: string) {
        const node = this.get(nodeId)

        this.unlink(node)

        // 从 map 中注销 node 和 node 的所有子节点
        const write_off = (node: RenderNode) => {
            this.nodes.delete(node.nodeId)
            if (node instanceof RenderElementNode)
                node.children.forEach(v => write_off(v))
        }
        write_off(node)
    }
    [RenderOpCode.cacheNode](nodeId: string) {
        const node = this.get(nodeId)

        this.unlink(node)

        this.cache = this.cache.concat([node])
    }
    [RenderOpCode.moveNode](nodeId: string, pos: { before?: string, parent?: string } = {}) {
        const node = this.get(nodeId)
        this.unlink(node)
        this.insert(node, pos)
    }
}