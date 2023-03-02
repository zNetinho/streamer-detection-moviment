
function supportsWorkerType() {
  let supports = false 
  const tester = {
    get type() { supports = true}
  }

  try {
    // se estiver no chrome vai ficar função rodando terminate serve para encerra e nã oter vazamento de memoria
    new Worker('blob://', tester).terminate()
  } finally {
    return supports
  }
}

function prepareRunChecker({ timerDelay }) {
  let lastEvent = Date.now()
  return {
    shouldRun() {
      const result = (Date.now() - lastEvent) > timerDelay
      if(result) lastEvent = Date.now()

      return result
    }
  }
}

export {
  supportsWorkerType,
  prepareRunChecker
}