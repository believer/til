const fm = require('front-matter')
const path = require('path')
const { resolve } = require('path')
const { writeFile, readdir, readFile } = require('fs').promises

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getFiles(res)
    } else {
      yield res
    }
  }
}

const obsidianLinkToMarkdownLink =
  (allFilenames) => (match, offset, string) => {
    const title = match.replace(/[\[\]]/g, '')

    if (!allFilenames.includes(title)) {
      return title
    }

    return `[${title}](/posts/${title
      .toLowerCase()
      .replace(/\s/g, '-')
      .replace(/[*]/g, '')})`
  }

;(async () => {
  let tils = []

  for await (const f of getFiles(
    '/Users/rdag/Library/Mobile Documents/iCloud~md~obsidian/Documents/notes'
  )) {
    const data = await readFile(f, 'utf8')
    const { attributes } = fm(data)

    if (attributes.tags && attributes.tags.includes('til')) {
      tils.push(f)
    }
  }

  const allFilenames = tils.map((til) => path.basename(til).replace('.md', ''))

  for (const til of tils) {
    const filename = path
      .basename(til)
      .toLowerCase()
      .replace(/\s/g, '-')
      .replace(/[*']/g, '')

    const data = await readFile(til, 'utf8')
    const content = data.replace(
      /\[\[([a-zåäö0-9\s-.,]+)\]\]/gi,
      obsidianLinkToMarkdownLink(allFilenames)
    )

    await writeFile(`./posts/${filename}`, content)
  }
})()
