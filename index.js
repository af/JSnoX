'use strict';

var propsRegex = /((?:#|\.)[\w-]+)|(\[\w+(?:=\w+)?\])/g
var attrRegex = /\[(\w+)(?:=(\w+))?\]/                  // matches '[foo=bar]' or '[foo]'


// Convert a tag specification string into an object
// eg. 'input#foo.bar[baz=asdf]' => { tagName: 'input', id: 'foo', className: 'bar', baz: 'asdf' }
function parseTagSpec(specString) {
    var tagName = specString.split(/[^a-z]/)[0]
    var spec = { tagName: tagName }
    var classes = []

    var matches = (specString || '').match(propsRegex)
    matches && matches.forEach(function(str) {
        if (!str) return
        else if (str[0] === '#') spec.id = str.slice(1)
        else if (str[0] === '.') classes.push(str.slice(1))
        else if (str[0] === '[') {
            var match = str.match(attrRegex)
            if (match) spec[match[1]] = match[2] || true    // If no attr value given, use true
        }
    })
    if (classes.length) spec.className = classes.join(' ')
    return spec
}


// Simple Object.assign-like utility:
function extend(obj1, obj2) {
    obj1 = obj1 || {}
    obj2 = obj2 || {}
    for (var k in obj2) obj1[k] = obj2[k]
    return obj1
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
