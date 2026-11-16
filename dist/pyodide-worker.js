/* Python runner worker. Loads Pyodide from CDN and executes user code safely off the UI thread. */
let pyodidePromise = null
const CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'

async function ensurePyodide() {
  if (!pyodidePromise) {
    self.postMessage({ type: 'status', status: 'downloading' })
    importScripts(CDN + 'pyodide.js')
    pyodidePromise = loadPyodide({ indexURL: CDN }).then((py) => {
      py.runPython(`
import sys, io, traceback

def __pipi_run(code, stdin_text=""):
    out = io.StringIO()
    err = io.StringIO()
    scope = {"__name__": "__main__"}
    old_out, old_err, old_in = sys.stdout, sys.stderr, sys.stdin
    sys.stdout, sys.stderr, sys.stdin = out, err, io.StringIO(stdin_text or "")
    try:
        exec(compile(code, "<pipi>", "exec"), scope)
    except SystemExit:
        pass
    except BaseException:
        traceback.print_exc(file=err)
    finally:
        sys.stdout, sys.stderr, sys.stdin = old_out, old_err, old_in
    return out.getvalue(), err.getvalue()
`)
      self.postMessage({ type: 'status', status: 'ready' })
      return py
    })
  }
  return pyodidePromise
}

self.onmessage = async (event) => {
  const data = event.data || {}
  const { id, type, code, stdin } = data
  if (type === 'ping') {
    try {
      await ensurePyodide()
      self.postMessage({ id, type: 'ready' })
    } catch (error) {
      self.postMessage({ id, type: 'fatal', message: String(error) })
    }
    return
  }
  if (type !== 'run') return
  try {
    const py = await ensurePyodide()
    const run = py.globals.get('__pipi_run')
    const result = run(code || '', stdin || '')
    const output = result[0]
    const error = result[1]
    self.postMessage({
      id,
      type: 'result',
      ok: !String(error).trim(),
      output,
      error,
    })
  } catch (error) {
    self.postMessage({
      id,
      type: 'result',
      ok: false,
      output: '',
      error: String(error && error.stack ? error.stack : error),
      fatal: true,
    })
  }
}
