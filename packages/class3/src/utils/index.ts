
export const isEmail = (email: string) => {
    return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email);
}

export const isNumber = (value?: any): boolean => {
    if (Object.prototype.toString.call(value) !== '[object Number]') {
      return false;
    }
    return /^-?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)$/.test(value);
}