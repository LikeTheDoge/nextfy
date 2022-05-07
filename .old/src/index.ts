document.body.innerHTML = `<h1>Hello World</h1> `


var oTxt1 = document.getElementById("t") as any;

const ta = document.createElement('textarea')
const log = () => {

    const sIdx = ta.selectionStart
    const eIdx = ta.selectionEnd

    if (sIdx !== eIdx)
        return console.log('range')

    console.log(ta.value[sIdx - 1])

    const list = scan(ta.value)

    const target = list.find(([begin, end]: [number, number]) => (begin <= sIdx) && (end >= sIdx))

    if(target){
        console.log('hit',target)
    }

}

const scan = (value: string) => {
    let idx = 0
    let begin = -1

    const atList: [number, number][] = []
    const breakWord = /\s/

    while (idx < value.length) {
        const val = value[idx]

        // 未匹配模式
        if (begin < 0) {
            if (val === '@') begin = idx
        } else

        // 匹配模式
        {
            if (breakWord.test(val)) {
                atList.push([begin, idx - 1])
                begin = -1
            }
        }
        idx++
    }

    if(begin > 0){
        atList.push([begin, idx])
    }

    return atList
}

ta.cols = 100
ta.rows = 50
document.body.appendChild(ta)

ta.onfocus = ta.oninput = log



