const qiniu = (name) => {
  if (name == "indent") {
    return require("./../images/indent.png")
  } else if (name == "listordered") {
    return require("./../images/listordered.png")
  } else if (name == "strikethrough") {
    return require("./../images/strikethrough.png")
  } else if (name == "outdent") {
    return require("./../images/outdent.png")
  } else if (name == "removeformat") {
    return require("./../images/removeformat.png")
  } else if (name == "listunordered") {
    return require("./../images/listunordered.png")
  } else {
    return `https://om4m02471.qnssl.com/2018/editor/${name}.svg?2`
  }
}

const names = ['bold', 'italic', 'underline', 'strikethrough', 'color', 'listOrdered', 'listUnordered', 'listCheck', 'indent', 'outdent', 'alignLeft', 'alignCenter', 'alignRight', 'undo', 'redo', 'removeFormat', 'insertVideo', 'insertLink', 'insertImage', 'insertLine', 'insertQuote', 'insertBlock']
const icons = {}

names.forEach(name => {
  icons[name] = qiniu(name.toLowerCase())
})

export default icons