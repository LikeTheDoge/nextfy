import { expect, test } from '@jest/globals';
import { RenderRoot } from '../src/node'

// test('adds 1 + 2 to equal 3', () => {
//     expect(sum(1, 2)).toBe(3);
// });

test('node', () => {
    const root = new RenderRoot()
    const text_hello = root.insertText('hello ')
    expect(root.target[0]).toBe(text_hello)
    const bold = root.insertElement({ tag: 'b' }, { before: text_hello.nodeId })
    expect(root.target[0]).toBe(bold)
    const text_world = root.insertText('world!', { parent: bold.nodeId })
    expect(bold.children[0]).toBe(text_world)
    const text_whitespace = root.insertText(' ', { before: text_world.nodeId })
    expect(bold.children[0]).toBe(text_whitespace)

    expect(() => {
        root.insertText('', { before: 'error' })
    }).toThrow(Error)

    expect(() => {
        root.insertText('', { parent: 'error' })
    }).toThrow(Error)

    expect(() => {
        root.insertText('', { parent: text_hello.nodeId })
    }).toThrow(Error)

})