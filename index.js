'use strict';

function extend(obj1, obj2) {
    obj1 = obj1 || {}
    obj2 = obj2 || {}
    for (var k in obj2) obj1[k] = obj2[k]
    return obj1
}

// TODO: support stuff like:
// 'input:number $email=foo@bar.net
function parseTagSpec(specString) {
    var parser = /^([a-z]+)((?:#|\.)[a-z]+)*$/
    var matches = (specString || '').match(parser)

    var spec = { tagName: matches[1] }
    matches.slice(2).forEach(function(str) {
        if (!str) return
        if (str[0] === '#') spec.id = str.slice(1)
        if (str[0] === '.') spec.className = str.slice(1)
    })
    return spec
}

module.exports = function jsnox(React) {
    return function(componentType, props, children) {
        if (typeof componentType === 'string') {
            var spec = parseTagSpec(componentType)
            componentType = spec.tagName
            delete spec.tagName
            props = extend(props, spec)
        }

        return React.createElement(componentType, props, children)
    }
}
