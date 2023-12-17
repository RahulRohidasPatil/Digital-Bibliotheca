import { axiosInstance } from '../utils/axios';

export const searchMedia = ({ searchTerm, sortOption, filters }) =>
  axiosInstance().post(`/media/search`, {
    searchTerm, sortOption, filters
  });

export const getAllMedia = (sortOption, filters) => {
  let url = `/media`;
  if (sortOption) url += `?sortOption=${sortOption}`;
  if (filters) url += `&filters=${filters}`;
  return axiosInstance().get(url);
}

export const getByID = (id) => axiosInstance().get(`/media/${id}`);

export const addMedia = ({ title, description, mediaType, price, uploadFiles }) => {
  const formData = new FormData();

  formData.append('Title', title);
  formData.append('Description', description);
  formData.append('MediaType', mediaType); // Assuming mediaType is dynamic
  formData.append('IsApproved', 1); // Assuming a default value
  formData.append('Price', price);
  formData.append('IsActive', 1); // Assuming a default value
  formData.append('CreatedDate', '2023-12-12'); // Assuming a default value
  formData.append('DemoFilePath', '/');
  formData.append('DeliveryMethod', 1);

  uploadFiles.forEach(file => {
    formData.append('Files', file);
  });

  return axiosInstance().post('/media/add', formData);
};