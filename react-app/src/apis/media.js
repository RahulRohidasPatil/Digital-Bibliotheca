import { axiosInstance } from '../utils/axios';

export const searchMedia = ({ searchTerm, sortOption, filters }) =>
  axiosInstance().post(`/media/search`, {
    searchTerm,
    sortOption,
    filters,
  });

export const getAllMedia = (sortOption, filters) => {
  let url = `/media`;
  if (sortOption) url += `?sortOption=${sortOption}`;
  if (filters) url += `&filters=${filters}`;
  return axiosInstance().get(url);
};
export const generateTags = (imageFile) =>{
  console.log("geree",imageFile)
  const formData = new FormData();
  formData.append('Files', imageFile);
  return axiosInstance().post(`/media/generateTags`,formData)
} ;
export const updateMedia = (id, media) => {
  axiosInstance().put(`/media/update/${id}`, media);
};

export function editProfile(userId, firstName, familyName, phoneNumber) {
  return axiosInstance().patch(`/user/edit-profile`, {
    userId,
    firstName,
    familyName,
    phoneNumber,
  });
}

export const deleteMedia = (id) => axiosInstance().delete(`/media/delete/${id}`);

export const reactivateMedia = (id) => axiosInstance().patch(`/media/reactivate/${id}`);

export const getByID = (id) => axiosInstance().get(`/media/${id}`);

export const getByUserId = (ownerId) => axiosInstance().get(`/media/getuploadedmedia/${ownerId}`);

export const isOwner = (id, ownerId) =>
  axiosInstance().get(`/media/isowner?id=${id}&ownerId=${ownerId}`);

export const hasPurchased = (id, customerId) =>
  axiosInstance().get(`/media/purchased?id=${id}&customerId=${customerId}`);

export const addMedia = ({
  title,
  description,
  mediaType,
  price,
  uploadFiles,
  demoFile,
  deliveryMethod,
}) => {
  const formData = new FormData();
  
  formData.append('Title', title);
  formData.append('Description', description);
  formData.append('MediaType', mediaType); // Assuming mediaType is dynamic
  formData.append('IsApproved', 0); // Assuming a default value
  formData.append('Price', price);
  formData.append('IsActive', 1); // Assuming a default value
  formData.append('CreatedDate', '2023-12-12'); // Assuming a default value
  formData.append('DeliveryMethod', deliveryMethod);
  formData.append('IsReported', 0);

  uploadFiles.forEach((file) => {
    formData.append('Files', file);
  });

  demoFile.forEach((file) => {
    formData.append('DemoFile', file);
  });

  return axiosInstance().post('/media/add', formData);
};


export const reportMedia = (mediaId, userId, reason) => {
  const body = {
    MediaId: mediaId,
    ReportedBy: parseInt(userId, 10),
    ReasonOfReporting: reason,
  };
  return axiosInstance().post('/media/reportmedia', body);
};

export const addComment = ({ customerId, mediaId, stars, comment }) =>
  axiosInstance().post("/media/addComment", { customerId, mediaId, stars, comment })