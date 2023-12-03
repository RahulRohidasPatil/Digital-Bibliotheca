import { axiosInstance } from "../utils/axios"

export const loginUser = ({email, password}: any) => {
    return axiosInstance().post(`/v1/user/login`, {
            email, password
    })
}