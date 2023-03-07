import { WebContainer } from '@webcontainer/api'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import debounce from 'debounce'
import { files } from './files'
import 'xterm/css/xterm.css'

// The tutorial I used:
// https://webcontainers.io/tutorial/1-build-your-first-webcontainer-app

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

  // handle file save
  document.body.addEventListener('keydown', (e) => {
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      webcontainer.fs.writeFile('/index.js', editor.value)
    }
  })
}

window.addEventListener('load', init)
