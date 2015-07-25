var test = require('tape')
var React = require('react')
var d = require('..')(React)


test('Does not set a key by default', function(t) {
    var vdom = d('div.foo')
    t.equal(vdom.key, null)
    t.end()
})

test('Does set a key if spec string has ^ suffix', function(t) {
    var spec1 = 'div.foo^'
    t.equal(d(spec1).key, spec1)

    var spec2 = 'input:email#hi.foo.baz[placeholder=Email]^'
    t.equal(d(spec2).key, spec2)
    t.end()
})
