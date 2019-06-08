const puppeteer = require('puppeteer')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//test
async function trovaCanzone(testo) {
    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('http://google.it')

        const song = testo
        await page.waitFor('input[name=q]')
        await page.type('input[name=q]', song + ' lyrics')


        await page.$eval('[name=btnK]', (el) => el.click())

        //await page.waitForNavigation() => non funziona

        await sleep(1000)

        const dati = await page.content()

        let regex = /kno-ecr-pt kno-fb-ctx gsmt\s*(.*?)\s*a>/g

        const matches = regex.exec(dati)
        if (matches !== null) {

            regex = /<span>\s*(.*?)\s*span>/g;

            const matches2 = regex.exec(matches[0])
            if (matches2 !== null) {
                return (matches2[1].toString().substr(0, matches2[1].toString().length - 2))
            }
            else {
                return 'Non siamo stati in grado di trovare alcuna corrispondenza'
            }

        }
        else {
            return 'Non siamo stati in grado di trovare alcuna corrispondenza'
        }
        await browser.close()

    }
    catch (err) {
        return err.message
    }
}

app.get('/findSong', async function (req, res) {
    let titolo = await trovaCanzone(req.query.text)
    res.send(titolo)
})

app.get('/', function (req, res) {
    res.send(JSON.stringify({ Hello: 'World'}))
})

app.listen(port, function () {
    console.log('Server is up and running on port 4600...')
})

