import Cookie from 'js-cookie'
let name = 'token'
export function setCookie(value) {
    Cookie.set(name, value)
}
export function getCookie() {
    return Cookie.get(name)
}
export function removeCookie() {
    Cookie.remove(name)
}