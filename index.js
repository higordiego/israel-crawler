const axios = require('axios')
const cheerio = require('cheerio')


const LeanResponse = (html) => {

    return Promise.all(html('#imprimible').map(async (_, element) => {
        return {
            title: html(element).find('.text-center').text(),
            body_element: html(element).find('p'),
            strongs: html(element).find('strong')
        }
    }).get())
}


const parseBody = (body, html) => {
    return body.body_element.map((_, element) => {
        return {
            body: html(element).text()
        }
    }).get()
}

const regexParse = (daa) => daa.replace(new RegExp("[0-9]", "g"), " ").replace(".", '').trim()

const toSliceArray = (data, body, html) => {
    let filt = ''
    return data.strongs.map((_, element) => {
        if (isNaN(parseInt(html(element).text()))) {
            filt = html(element).text()
            return {
                topic: filt,
                verse: _ + 1 ,
                data: body[_] ? regexParse(body[_].body) : ''
            }
        } else if (filt) {
            if (body[_]) return { verse: _ + 1, topic: filt, data: body[_] ? regexParse(body[_].body) : '' }
        } else {
            filt = ''
            if (body[_]) return { verse: _ + 1, topic: '', data: body[_] ? regexParse(body[_].body) : '' }
        }
    }).get()

}


const SearchNoticies = async (LeanResponse) => {
    try {
        const response = await axios({ url: 'https://www.bibliatodo.com/pt/a-biblia/nova-versao-internacional/genesis-4', method: 'get' })
        const html = cheerio.load(response.data)
        let objectReturn = await LeanResponse(html)
        objectReturn = objectReturn[0]
        const body = await parseBody(objectReturn, html)
        const slice = await toSliceArray(objectReturn, body, html)
        
        return {
            chapter: '',
            verses: slice
        }
    } catch (err) {
        throw new Error(err)
    }
}
(async () => {
    const search = await SearchNoticies(LeanResponse)
    console.log('search', JSON.stringify(search, null, 2))
})();
