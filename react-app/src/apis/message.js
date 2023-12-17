import { axiosInstance } from '../utils/axios';

export const getByChatId = (chatId) => axiosInstance().get(`/message/getbychatid/${chatId}`);
export const getBySenderRecipient = (sender, recipient) => axiosInstance().get(`/message/getbysenderrecipient?senderId=${sender}&recipientId=${recipient}`)
