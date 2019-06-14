const puppeteer = require("puppeteer")
const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//test
async function trovaCanzone(testo) {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto("http://google.it")

    const song = testo
    await page.waitFor("input[name=q]")
    await page.type("input[name=q]", song + " lyrics")

    await page.$eval("[name=btnK]", el => el.click())

    //await page.waitForNavigation() => non funziona

    await sleep(1000)
    let songAuthor = await page.evaluate(
      () =>
        document.querySelector(".wwUB2c > span:nth-child(1) > a:nth-child(1)")
          .innerHTML
    )
    if (songAuthor != null) {
      return JSON.stringify({
        title: await page.evaluate(
          () =>
            document.querySelector(".kno-ecr-pt > span:nth-child(1)").innerHTML
        ),
        author: songAuthor
      })
    } else {
      return "erroraccio"
    }

    await browser.close()
  } catch (err) {
    return JSON.stringify({
      error: "Song not found"
    })
  }
}

app.get("/findSong", async function(req, res) {
  res.send(await trovaCanzone(req.query.text))
})

app.get("/", function(req, res) {
  res.send(JSON.stringify({ Hello: "World" }))
})

app.listen(port, function() {
  console.log("Server is up and running on port 5000...")
})
