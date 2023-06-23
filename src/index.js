import axios from 'axios';
import Notiflix from 'notiflix';

const apiKey = '37654441-57ef890d0045f2b68462d8b34';
const searchForm = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let searchQuery = ''; // Переменная для хранения строки поиска
let page = 1; // Текущая страница результатов поиска

// Обработчик события отправки формы
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.trim(); 
// получает текущее значение строки поиска из элемента формы, 
//удаляет лишние пробелы и сохраняет результат в переменную 
  if (searchQuery === '') {
    return;
  }
  page = 1; // Сбрасываем текущую страницу в 1
  clearGallery(); // Очищаем галерею от предыдущих результатов
  await fetchImages(); // Выполняем запрос на получение изображений
  toggleLoadMoreButton(); // Показываем или скрываем кнопку "Загрузить еще"
});

// Обработчик события клика на кнопку "Загрузить еще"
loadMoreButton.addEventListener('click', async () => {
  page += 1; // Увеличиваем номер текущей страницы
  await fetchImages(); // Выполняем запрос на получение следующей группы изображений
});

// Функция для выполнения запроса на получение изображений
async function fetchImages() {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });

    const images = response.data.hits; // Получаем массив изображений из ответа

    if (images.length === 0) {
      // Если массив изображений пуст, значит ничего не найдено
      if (page === 1) {
        // Если это первый запрос и нет результатов, выводим сообщение
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      } else {
        // Если это последующий запрос и нет результатов, выводим другое сообщение
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      }
      toggleLoadMoreButton(false); // Прячем кнопку "Загрузить еще"
      return;
    }

    renderImages(images); // Отображаем полученные изображения
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('Error occurred while fetching images. Please try again later.');
  }
}

// Функция для отображения изображений в галерее
function renderImages(images) {
  const galleryMarkup = images
    .map(
      (image) => `
      <div class="photo-card">
      <a href="${image.largeImageURL}" target="_blank">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${image.views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${image.downloads}
        </p>
      </div>
    </div>
  `
    )
    .join('');

  galleryContainer.innerHTML += galleryMarkup; // Добавляем разметку изображений в галерею

 // Добавляем обработчики событий для превью изображений
 const photoCards = galleryContainer.querySelectorAll('.photo-card');
 photoCards.forEach((card) => {
   const image = card.querySelector('img');
   image.addEventListener('mouseenter', () => {
     showPreviewTooltip(card, image.src);
   });
   image.addEventListener('mouseleave', hidePreviewTooltip);
 });
}

// Функция для отображения превью изображения при наведении
function showPreviewTooltip(element, largeImageURL) {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.style.backgroundImage = `url(${largeImageURL})`;
    element.appendChild(tooltip);
  }
  
  // Функция для скрытия превью изображения
  function hidePreviewTooltip(event) {
    const tooltip = event.target.querySelector('.tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }

  // Функция для очистки галереи от предыдущих результатов
function clearGallery() {
    galleryContainer.innerHTML = '';
  }
  
  // Функция для показа или скрытия кнопки "Загрузить еще"
  function toggleLoadMoreButton(show = true) {
    loadMoreButton.style.display = show ? 'block' : 'none';
  }