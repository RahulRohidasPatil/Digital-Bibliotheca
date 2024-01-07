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

export const updateMedia = (id, media) => {
  axiosInstance().put(`/media/update/${id}`, media);
}

export const deleteMedia = (id) => axiosInstance().delete(`/media/delete/${id}`);

export const reactivateMedia = (id) => axiosInstance().patch(`/media/reactivate/${id}`);

export const getByID = (id) => axiosInstance().get(`/media/${id}`);

export const getByUserId = (ownerId) => axiosInstance().get(`/media/getuploadedmedia/${ownerId}`)

export const isOwner = (id, ownerId) => axiosInstance().get(`/media/isowner?id=${id}&ownerId=${ownerId}`);

export const hasPurchased = (id, customerId) => axiosInstance().get(`/media/purchased?id=${id}&customerId=${customerId}`);

export const addMedia = ({ title, description, mediaType, price, uploadFiles, demoFile, deliveryMethod }) => {
  const formData = new FormData();

  formData.append('Title', title);
  formData.append('Description', description);
  formData.append('MediaType', mediaType); // Assuming mediaType is dynamic
  formData.append('IsApproved', 1); // Assuming a default value
  formData.append('Price', price);
  formData.append('IsActive', 1); // Assuming a default value
  formData.append('CreatedDate', '2023-12-12'); // Assuming a default value
  formData.append('DeliveryMethod', deliveryMethod);

  uploadFiles.forEach(file => {
    formData.append('Files', file);
  });

  demoFile.forEach(file => {
    formData.append('DemoFile', file);
  })


  return axiosInstance().post('/media/add', formData);
};