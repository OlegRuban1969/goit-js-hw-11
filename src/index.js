import { fetchImages, renderImages } from './api';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let searchQuery = ''; // Переменная для хранения строки поиска
let page = 1; // Текущая страница результатов поиска
let totalHits = 0; // Общее количество изображений

// Скрываем кнопку "Загрузить еще" изначально
toggleLoadMoreButton(false);

// Обработчик события отправки формы
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.trim(); // Получаем значение строки поиска
  if (searchQuery === '') {
    return;
  }
  page = 1; // Сбрасываем текущую страницу в 1
  clearGallery(); // Очищаем галерею от предыдущих результатов
  toggleLoadMoreButton(false); // Скрываем кнопку "Загрузить еще"
  const { images, total } = await fetchAndRenderImages(); // Выполняем запрос на получение и отображение изображений
  totalHits = total; // Обновляем общее количество изображений
  toggleLoadMoreButton(); // Показываем или скрываем кнопку "Загрузить еще"
  showNotification(`We found ${totalHits} images.`); // Показываем уведомление о количестве найденных изображений
});

// Обработчик события клика на кнопку "Загрузить еще"
loadMoreButton.addEventListener('click', async () => {
  page += 1; // Увеличиваем номер текущей страницы
  const { images, total } = await fetchAndRenderImages(); // Выполняем запрос на получение и отображение следующей группы изображений
  totalHits = total; // Обновляем общее количество изображений
  toggleLoadMoreButton(); // Показываем или скрываем кнопку "Загрузить еще"
});

// Функция для выполнения запроса на получение и отображение изображений
async function fetchAndRenderImages() {
  const { images, totalHits } = await fetchImages(searchQuery, page);
  renderImages(images, galleryContainer);
  return { images, total: totalHits };
}

// Функция для очистки галереи от предыдущих результатов
function clearGallery() {
  galleryContainer.innerHTML = '';
}

// Функция для показа или скрытия кнопки "Загрузить еще"
function toggleLoadMoreButton(show = true) {
  loadMoreButton.style.display = show ? 'block' : 'none';
  if (!show && totalHits > 0 && page > 2) {
    showNotification("We're sorry, but you've reached the end of search results.");
  }
}

// Функция для показа уведомления
function showNotification(message) {
  Notiflix.Notify.info(message);
}
