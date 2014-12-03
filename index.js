'use strict';

function extend(obj1, obj2) {
    obj1 = obj1 || {}
    obj2 = obj2 || {}
    for (var k in obj2) obj1[k] = obj2[k]
    return obj1
}

function parseTagSpec(specString) {
    var tagName = specString.split(/[^a-z]/)[0]
    var attrsRegex = /((?:#|\.)[\w-]+)/g
    var spec = { tagName: tagName }
    var classes = []

    var matches = (specString || '').match(attrsRegex)
    matches && matches.forEach(function(str) {
        if (!str) return
        if (str[0] === '#') spec.id = str.slice(1)
        if (str[0] === '.') classes.push(str.slice(1))
    })
    if (classes.length) spec.className = classes.join(' ')
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
