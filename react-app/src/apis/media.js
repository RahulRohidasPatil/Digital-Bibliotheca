import { axiosInstance } from '../utils/axios';

export const searchMedia = ({ searchTerm, sortOption, filters }) =>
  axiosInstance().post(`/media/search`, {
    searchTerm, sortOption, filters
  });

export const getAllMedia = (sortOption, filters) => axiosInstance().get(`/media?sortOption=${sortOption}&filters=${filters}`);

export const getByID = (id) => axiosInstance().get(`/media/${id}`);

export const addMedia = ({ title, description, mediaType, price, demoFile, uploadFiles }) => axiosInstance().post('/media/add', {
  Title: title,
  Description: description,
  MediaType: 0,
  IsApproved: 1,
  Price: price,
  IsActive: 1,
  CreatedDate: '2023-12-12',
  FilePath: '/',
  DemoFilePath: demoFile,
  DeliveryMethod: 1
});