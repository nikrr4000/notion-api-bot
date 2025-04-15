import { initializeStrategies } from "#actionControllers/index.js"
import initializeBot from "#bot/index.js"
import SttAgent from "#sdk/yc/stt/SttAgent.js";

console.log('restarted')

const main = async () => {
    initializeStrategies()
    SttAgent.initializeListeners()
    await initializeBot()

}

main()