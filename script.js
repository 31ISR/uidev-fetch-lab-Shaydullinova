const statusEl = document.getElementById("status")
const cardsEl = document.querySelector(".cards")
const BASE_URL = 'https://strapi.kitek-pg.ru'
const API_URL = `${BASE_URL}/api/events?populate=*`
const API_TOKEN = 'aae8951a08e10c8fd826a0716d048fef2d1676e6ae4473759ddbc24265a1065a162a691e57d2323918794f33c19438cda3550c2694f1c014f8349783f2b913a264342551f1ebedff7f74c3e80c77cab2ee88e245ed92cfb5ff561ec269ef1d386676ba4e428d8faa30cf114f31d9ec17a9dde611bd92075dde9a1b3bc1be924f'

function createCard(item) {
    const { title, description, gallery, date, organizer} = item;

    const imageUrl = gallery
        ? `${BASE_URL}${gallery.url}`
        : 'https://via.placeholder.com/300x200?text=No+image'

    const formattedDateTime = new Date(date).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
})

    return `
        <article class="card">
          <img class="card__image" src="${imageUrl}" alt="${title}" />
          <div class="card__body">
            <h2 class="card__title">${title}</h2>
            <p class="card_organizer">Организатор: ${organizer}</p>
            <p class="card__text">${description}</p>
            <div class="card__footer">
              <span class="card__date">Дата проведения: ${formattedDateTime}</span>
            </div>
          </div>
        </article>
    `
}

async function loadCards() {
    try {
        statusEl.textContent = 'Загрузка...'

        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`)
        }
        

        const result = await response.json()

        const items = result.data
        
        if (items.length === 0) {
            statusEl.textContent = 'Записей пока нет'
            cardsEl.innerHTML = ''
            return
        }
        console.log(items.map(createCard).join(''));

        cardsEl.innerHTML = items.map(createCard).join('')
        statusEl.textContent = ''
    } catch (error) {
        console.error(error)
        cardsEl.innerHTML = ''
        statusEl.textContent = `Не удалось загрузить данные: ${error.message}`
        statusEl.classList.add('status--error')
    }
};

loadCards();

