import { axiosInstance } from "../utils/axios"

export const registrateUser = ({firstName, lastName, age, emailAddress, password, phone, address, role}: any) => {
    return axiosInstance().post(`/v1/user/registration`, {
            firstName, lastName, age, emailAddress, password, phone, address, role
    })
}
