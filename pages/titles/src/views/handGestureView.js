export default class handGestureView {
    #handsCanvas = document.querySelector('#hands')
    #canvasContext = this.#handsCanvas.getContext('2d')
    #fingerLookIndexes

    constructor({ fingerLookIndexes }) {
        this.#handsCanvas.width = globalThis.screen.availWidth
        this.#handsCanvas.height = globalThis.screen.availHeight
    }

    clear() {
        this.#canvasContext.clearRect(0, 0, this.#handsCanvas.width, this.#handsCanvas.height)
    }

    drawResult(hands) {
        for( const { keypoints, handedness } of hands) {
            if(!keypoints) continue;
            this.#canvasContext.fillStyle = handedness === "Left" ? "red" : "green"
            this.#canvasContext.strokeStyle = "white"
            this.#canvasContext.lineWidth = 8
            this.#canvasContext.lineJois = "round"

            this.#drawJoients(keypoints)

            this.#drawFingerAndHoverElements
        }
    }

    clickOnElement(x, y) {
        const element = document.elementFromPoint(x, y)
        if(!element) return;

        console.log({element, x, y})
        const rect = element.getBoundingClientRect()
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: rect.left + x,
            clientY: rect.right + y,
        })

        element.dispatchEvent(event)
    }

    #drawJoients(keypoints) {
        for (const { x, y } of keypoints) {
            //Iniciar a escrita no canvas
            this.#canvasContext.beginPath() 
            //ajuste para as pontas do dedo
                const newX = x - 2;
                const newY = y - 2;
                const radius = 3;
                const starAngle = 0;
                const endAngle = 2 * Math.PI;

                this.#canvasContext.arc(newX, newY, radius, starAngle, endAngle)
                this.#canvasContext.fill()
        }
    }
    //

    #drawFingerAndHoverElements(keypoints) {
        const fingers = Object.keys(this.#fingerLookIndexes)
        for (const finger of fingers) {
            const points = this.#fingerLookIndexes[finger].map( index => keypoints[index])

            const region = new Path2D()

            const [{x, y}] = point

            region.moveTo(x, y)
            for(const point of points) {
                region.lineTo(point.x, point.y)
            }
            this.#canvasContext.stroke(region)
        }
    }

    loop(fn) {
        requestAnimationFrame(fn)
    }

    scrollPage(top) {
        scroll({
            top,
            behavior: "smooth"
        })
    }
}