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

const toSliceArray = (data, html) => {
    return data.strongs.map((_, element) => {
        return {
            filter: html(element).text()
        }
    }).get()
}

/*
    Aqui tem um cdóigo que não me orgulho de ter escrevido.
*/
const parseFilterSlice = (slice, body) => {
    const object = []
    let indexExternal = -1
    let filt
    slice.map((value, index) => {
        if (isNaN(parseInt(value.filter))) {
            filt = value.filter
            indexExternal += 1
            object.push({ subtitle: filt, body: [] })
        } else if (filt) {
            if (body[index]) object[indexExternal].body.push(body[index - 1].body)
        }
    })
    return object
}

const SearchNoticies = async (LeanResponse) => {
    try {
        const response = await axios({ url: 'https://www.bibliatodo.com/pt/a-biblia/nova-versao-internacional/genesis-2', method: 'get' })
        const html = cheerio.load(response.data)
        let objectReturn = await LeanResponse(html)
        objectReturn = objectReturn[0]
        const body = await parseBody(objectReturn, html)
        const slice = await toSliceArray(objectReturn, html)
        const parseFilter = parseFilterSlice(slice, body)
        return {
            title: objectReturn.title,
            body: parseFilter
        }
    } catch (err) {
        console.log('err', err)
        throw new Error(err)
    }
}
(async () => {
    const search = await SearchNoticies(LeanResponse)
    console.log('search', JSON.stringify(search, null, 2))
})();
