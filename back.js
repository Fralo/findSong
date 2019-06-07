try { const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('http://google.it')

    const song = 'even when you cry youre '
    await page.waitFor('input[name=q]')
    await page.type('input[name=q]', song + ' lyrics')


    await page.$eval('[name="btnK"]', (el) => el.click())

    await page.waitForNavigation()
    const dati = await page.content()

    let regex = /kno-ecr-pt kno-fb-ctx gsmt\s*(.*?)\s*a>/g

    const matches = regex.exec(dati)
    
    if (matches !== null) {

        regex = /<span>\s*(.*?)\s*span>/g;

        const matches2 = regex.exec(matches[0])
        if (matches2 !== null) {
            console.log(matches2[1].toString().substr(0, matches2[1].toString().length - 2))
        }
        else {
            console.log('Non siamo stati in grado di trovare alcuna corrispondenza')
        }

    }
    else {
        console.log('Non siamo stati in grado di trovare alcuna corrispondenza')
    }
    await browser.close()
    
    }
    catch(err) {
        console.log(err.message)
    }