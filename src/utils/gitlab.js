export function getContent(str) {
    if (!str) return
    if (str[0] != "<") return str
    let result = ''
    let flag = false
    for (let char of str) {
        if (char === '>') {
            flag = true
        }
        if (char === '<') {
            flag = false
        }
        if (flag && char !== '>') {
            result = result + char
        }
    }
    return result
}
export function scrollToAnchor(anchorName, block = 'start') {
    if (anchorName) {
        // 找到锚点
        let anchorElement = document.getElementById(anchorName);
        // 如果对应id的锚点存在，就跳转到锚点
        if (anchorElement) { anchorElement.scrollIntoView({ block: block, behavior: 'smooth' }); }
    }
}