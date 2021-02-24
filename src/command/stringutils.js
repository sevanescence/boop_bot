
/** @param {string} str @return {string} label of command string */
const getLabel = str => {
    return str.match(/(?<=\$b\s).+?(?=\s|$)/)?.[0];
}

/** 
 * @param {String} string 
 * @param {Number} len
 * @return {Array<String>} */
const splitArgs = (string, len) => {
    let args = string.replace(/^\$b\s.+?(\s|$)/, '').split(/\s/);
    for (let i = len; i < args.length; i++) {
        args[len-1] += ` ${args[i]}`;
    }
    for (let i = len; i < args.length; args.pop());
    console.log(args);
    return args;
}

/** @param {Array<String>} arr @return {String} smallest string from array */
const findSmallestString = arr => {
    let smallestString;
    for (let str of arr) {
        if (! smallestString || str < smallestString) {
            smallestString = str;
        }
    }
    return smallestString;
}

/** @param {String} str @return {String} */
const correctMultiLineString = str => {
    let arr = str.match(/(?<=\n)\s+/ig);
    let len = findSmallestString(arr).length;
    let regex = new RegExp(`\\s{${len}}(?=\\S)`, 'g');
    return str.replace(regex, '');
}

module.exports = {
    getLabel: getLabel,
    splitArgs: splitArgs,
    findSmallestString: findSmallestString,
    correctMultiLineString: correctMultiLineString
}