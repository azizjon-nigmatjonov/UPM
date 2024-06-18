import showdown from 'showdown'


export const HTMLToMarkdown = (html) => {
  const converter = new showdown.Converter()

  return converter.makeMarkdown(html)
}

export const markdownToHTML = (markdownText) => {
  const converter = new showdown.Converter()

  return converter.makeHtml(markdownText)
}



