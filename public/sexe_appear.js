const femelle = document.querySelector('femelle')
const male = document.querySelector('male')

const option = document.getElementById('genre')

option.addEventListener('Event', () => {
    const f_visible = femelle.getAttribute('femelle visible')
    const m_visible = male.getAttribute('male-visible')
    const actual = req.body.genre
    const genre_now = document.getAttribute('genre')
    genre_now.setAttribute(actual)

    if(actual === "non-binaire"){
        f_visible.setAttribute('false')
        m_visible.setAttribute('false')
    }
    else if(actual ="male"){
        f_visible.setAttribute('false')
        m_visible.setAttribute('true')
    }else{
        f_visible.setAttribute('true')
        m_visible.setAttribute('false')
    }
})

