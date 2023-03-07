import { WebContainer } from '@webcontainer/api'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import debounce from 'debounce'
import { files } from './files'
import 'xterm/css/xterm.css'

const init = async() => {
  // init the node web container
  const webcontainer = await WebContainer.boot()
  // fill local file system with some files
  await webcontainer.mount(files)

  // init terminal 
  const terminal = new Terminal({ convertEol: true })
  terminal.open(document.querySelector('.terminal'))
  // with an interactive shell
  const shellProcess = await webcontainer.spawn('jsh')
  shellProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data)
      },
    }),
  )
  const input = shellProcess.input.getWriter()
  terminal.onData((data) => {
    input.write(data)
  })

  // make terminal and shell responsive
  const fitAddon = new FitAddon()
  terminal.loadAddon(fitAddon)
  const onResize = debounce(() => {
    fitAddon.fit()
    shellProcess.resize({
      cols: terminal.cols,
      rows: terminal.rows,
    })
  }, 100)
  onResize()
  window.addEventListener('resize', onResize)

  // log the local server address
  // we can use this url to call our local apis
  webcontainer.on('server-ready', (port, url) => {
    terminal.write(`App is live at --> ${url} \n`)
  })

  // init file editor
  const editor = document.querySelector('textarea')
  editor.value = files['index.js'].file.contents

  document.body.addEventListener('keydown', (e) => {
    // handle file save
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      webcontainer.fs.writeFile('/index.js', editor.value)
      return
    } 
    // handle tab
    if (e.key === 'Tab') {
      e.preventDefault()
      const tabLength = 2
      const tab = Array(tabLength).fill().map(() => ' ').join('')
      const start = editor.selectionStart
      const end = editor.selectionEnd
      editor.value = `${editor.value.substring(0, start)}${tab}${editor.value.substring(end)}`
      editor.selectionStart = start + tabLength
      editor.selectionEnd = start + tabLength
    }
  })
}

window.addEventListener('load', init)
