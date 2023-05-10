const initDB = require('../utils/init-db')
const User = require('../models/user')
const readline = require('readline')
const util = require('util')

const main = async () => {
    await initDB()
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    const question = util.promisify(rl.question).bind(rl)
    const firstName = await question("First name: ")
    const lastName = await question("Last name: ")
    const email = await question("Email: ")
    const password = await question("Password: ")
    const role = "superuser"
    const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        role
    })
    console.log("User created")
}

main().catch(console.error).finally(() => process.exit(0))
