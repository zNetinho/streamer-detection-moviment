import { knownGestures, gestureStrings } from "../utils/gestures.js"

export default class HandGestureService {
    #gestureEstimator
    #handPoseDetection
    #handsVersion
    #detector = null
    constructor({ fingerpose, handPoseDetection, handsVersion }) {
        this.#gestureEstimator = new fingerpose.GestureEstimator(knownGestures) 
        this.#handPoseDetection = handPoseDetection
        this.#handsVersion = handsVersion
    }

    async estimate(keypoints3D) {
        const predictions = await this.#gestureEstimator.estimate(
            this.#getLandMarksFromKeypoints(keypoints3D),
            // Porcentagem de confiança 90% 1 a 10
            9
        )
        // console.log({predictions})
        return predictions.gestures;
    }

    async * detectGestures(predictions) {
        for(const hand of predictions) {
            if(!hand.keypoints3D) continue

            const gestures = await this.estimate(hand.keypoints3D) 
            if(!gestures.length) continue;

            const result = gestures.reduce((previous, next ) => (previous.score > next.score) ? previous: next)
            const { x, y } = hand.keypoints.find(keypoint => keypoint.name === 'index_finger_tip')
            // Acelera o laço, utilizando yield assim que ele ja tiver o valor ele ja volta para quem chamou no caso a função
            yield {event: result.name, x, y}
            console.log(`Detected, ${gestureStrings[result.name]}`)
        }
    }

    #getLandMarksFromKeypoints(keypoints3D) {
        return keypoints3D.map(keypoint =>
            [keypoint.x, keypoint.y, keypoint.z]
        )
    }

    async estimateHands(video) {
        return this.#detector.estimateHands(video, {
            // espelha a camera, para aconpanhar o caminho e movimento correto.
            flipHorinzontal: true,
        })
    }

    async initializeDetector() {
        if (this.#detector) return this.#detector;

        const detectorConfig = {
            runtime: 'mediapipe', // or 'tfjs',
            // Garante que sempre iremos ter a versão atualizada da biblioteca do tfjs
            solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${this.#handsVersion}`,
            //Mais pesado, porém e o que traz mais precisão
            // modelType: 'full'
            // Menos gasto de processamento, mas serve para a aplicação
            modelType: 'lite',
            maxHands: 2,
        }
        this.#detector = await this.#handPoseDetection.createDetector(
            this.#handPoseDetection.SupportedModels.MediaPipeHands,
            detectorConfig
            )
            
            return this.#detector
    }
}