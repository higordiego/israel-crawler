const axios = require('axios')
const cheerio = require('cheerio')



const LeanResponse = (html) => {
    let $ = cheerio.load(html)
    $('#imprimible').each(async (index, element) => {
        const title = $(element).find('.text-center').text()
        const subtitle = $(element).find('h4').text()
        console.log('title', title)
        console.log('subtitle', subtitle)
        $(element).find('p').each((_, text ) => {
            console.log('body', $(text).text())
        })
    });
}


const SearchNoticies = async (LeanResponse) => {
    try {
        const response = await axios({ url: 'https://www.bibliatodo.com/pt/a-biblia/nova-versao-internacional/genesis-1', method: 'get' })
        const objectReturn = await LeanResponse(response.data)
        return objectReturn
    } catch (err) {
        return Promise.reject(err)
    }
}

SearchNoticies(LeanResponse)