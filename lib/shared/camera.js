export default class Camera {
  constructor() {
    this.video = document.createElement('video')
  }

  static async init() {
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        `Browser API navigator.mediaDevices.getUserMedia not available`
      )
    }
    const videoConfig = {
      audio: false,
      video: {      
        // Tamanho disponivel da tela altura x largura
        width: globalThis.screen.availWidth,
        height: globalThis.screen.availHeight,
        //define o FPS
        frameRate: {
          ideal: 60
        }
      }
    }
    //objeto do browser passamdp as configurações acima 
    const stream = await navigator.mediaDevices.getUserMedia(videoConfig)
    const camera = new Camera()
    camera.video.srcObject = stream
    // camera.video.height = 240
    // camera.video.width = 320
    // document.body.append(camera.video)

    // aguarda pela camera!
    // ficara preso nessa promise ate que tudo seja carregado
    await new Promise((resolve) => {
      camera.video.onloadedmetadata = () => {
        resolve(camera.video)
      }
    })

    camera.video.play()
// retorna o objeto para se usar se preciso
    return camera
  }
}