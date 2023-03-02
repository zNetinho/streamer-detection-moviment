export default class Controller {
  #view
  #camera
  #worker
  #blinkCounter = 0
  constructor({ view, worker, camera }) {
    this.#view = view
    this.#camera = camera
    this.#worker = this.#configureWorker(worker)

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
  }

  static async initialize(deps) {
    const controller = new Controller(deps)
    controller.log('not yet detecting eye blink! click in the button to start')
    return controller.init()
  }

  #configureWorker(worker) {
    let ready = false
    worker.onmessage = ({ data }) => {
      if ('READY' === data) {
        console.log('worker is ready!')
        this.#view.enableButton()
        ready = true
        return
      }
      const blinked = data.blinked
      this.#blinkCounter += blinked
      this.#view.togglePlayVideo()
      console.log('blinked', blinked)
    }

    return {
      send(msg) {
        if (!ready) return
        worker.postMessage(msg)
      }
    }
  }
  async init() {
    console.log('init!!')
  }

  loop() {
    const video = this.#camera.video
    // tira um print do video 60FPS
    const img = this.#view.getVideoFrame(video)
    //envia para o worket poder verificar se piscou
    this.#worker.send(img)
    this.log(`detecting eye blink...`)
    //garante que a função seja executada cada segundo
    setTimeout(() => this.loop(), 100)
  }
  log(text) {
    const times = `      - blinked times: ${this.#blinkCounter}`
    this.#view.log(`status: ${text}`.concat(this.#blinkCounter ? times : ""))
  }

  onBtnStart() {
    this.log('initializing detection...')
    this.#blinkCounter = 0
    this.loop()
  }
}