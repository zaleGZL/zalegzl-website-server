const marked = require('marked')

const renderer = new marked.Renderer()

renderer.heading = function(text, level) {
  return (
    '<h' +
    level +
    '><a name="' +
    text +
    '" class="anchor" href="#' +
    text +
    '"><span class="header-link"></span></a>' +
    text +
    '</h' +
    level +
    '>'
  )
}

module.exports = renderer
