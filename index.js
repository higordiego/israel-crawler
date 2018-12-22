const axios = require('axios')
const cheerio = require('cheerio')


const LeanResponse = (html) => {

    return Promise.all(html('#imprimible').map(async (_, element) => {
        return {
            title: html(element).find('.text-center').text(),
            subtitle_element: html(element).find('h4'),
            body_element: html(element).find('p')
        }
    }).get())
}

const parseSubtitle = (sub, html) => {
    return sub.subtitle_element.map((_, element) => {
        return {
            subtitle: html(element).find('strong').text()
        }
    }).get()
}


const parseBody = (body, html) => {
    return body.body_element.map((_, element) => {
        return {
            body: html(element).text()
        }
    }).get()
}

const SearchNoticies = async (LeanResponse) => {
    try {
        const response = await axios({ url: 'https://www.bibliatodo.com/pt/a-biblia/nova-versao-internacional/genesis-3', method: 'get' })
        const html = cheerio.load(response.data)
        let objectReturn = await LeanResponse(html)
        objectReturn =  objectReturn[0]
        const sub = await parseSubtitle(objectReturn, html)
        const body = await parseBody(objectReturn, html)

        return {
            title: objectReturn.title,
            subtitle: sub,
            body: body
        }
    } catch (err) {
        console.log('err', err)
        throw new Error(err)
    }
}
(async () => {
    const search = await SearchNoticies(LeanResponse)
    console.log('search', search)
})();
