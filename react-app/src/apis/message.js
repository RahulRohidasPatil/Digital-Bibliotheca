import { axiosInstance } from '../utils/axios';

export const getByChatId = (chatId) => axiosInstance().get(`/message/getbychatid/${chatId}`);
export const getBySenderRecipient = (chatId, isDiscussion) => axiosInstance().get(`/message/getbysenderrecipient?chatId=${chatId}&isDiscussion=${isDiscussion}`)
