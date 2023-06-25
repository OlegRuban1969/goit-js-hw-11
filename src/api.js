import axios from 'axios';
import Notiflix from 'notiflix';

const apiKey = '37654441-57ef890d0045f2b68462d8b34';

// Функция для выполнения запроса на получение изображений
export async function fetchImages(searchQuery, page) {
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
    const totalHits = response.data.totalHits; // Общее количество изображений

    if (images.length === 0) {
      // Если массив изображений пуст, значит ничего не найдено
      return { images: [], totalHits: 0 };
    }

    return { images, totalHits };
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('Error occurred while fetching images. Please try again later.');
    return { images: [], totalHits: 0 };
  }
}

// Функция для отображения изображений в галерее
export function renderImages(images, galleryContainer) {
  const galleryMarkup = images
    .map(
      (image) => `
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
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
}
