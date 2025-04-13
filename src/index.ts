import initializeBot from "#bot/index.js"
import { initializeEmitters } from "#actionControllers/index.js"

console.log('restarted')

const main = async () => {
    await initializeBot()
    await initializeEmitters()
}

main()