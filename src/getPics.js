import axios from 'axios';

export const getPics = async url => {
  const response = await axios.get(url);
  const hitsArr = await response.data.hits;

  if (hitsArr.length === 0) {
    return Promise.reject(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    return {
      galleryArr: hitsArr,
      totalHits: response.data.totalHits,
    };
  }
};
