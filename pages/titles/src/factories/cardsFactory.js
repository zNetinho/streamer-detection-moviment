import "./../../lib/sdk.js"
import CardsController from "./../controllers/cardsController.js"
import CardsView from "./../views/cardsView.js"
import CardsService from "./../services/cardsService.js"

const cardListWorker = new Worker(`./src/workers/cardListWorker.js`, { type: "module" })

const [rootPath] = window.location.href.split('/pages/')
const factory = {
  async initalize() {
    return CardsController.initialize({
      worker: cardListWorker,
      view: new CardsView(),
      service: new CardsService({
        dbUrl: `${rootPath}/assets/database.json`,
        //definindo importação do arquivo cardListWorker
        cardListWorker
      })
    })
  }
}

export default factory