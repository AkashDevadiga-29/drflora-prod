import axios from 'axios';

const BaseUrl = process.env.REACT_APP_API_URL
const LoginUrl = 'token/'
const GetUserUrl = 'user/'
const RefreshTokenUrl = 'token/refresh/'
const LogoutUrl = 'logout/'
const AuthenticateUrl = 'authenticated/'

const api = axios.create({
    baseURL: BaseUrl,
    withCredentials: true,
});

export default api;

export const login = async(username,password) => {
    const LoginData = {
        username:username,
        password:password
    }
    const response = await api.post(LoginUrl,LoginData)
    return response.data.success
}

export const getuserdata = async() => {
    try{
        const response = await api.get(GetUserUrl,{timeout:10000})
        return response.data
    }catch(error){
        return call_refresh(error,async () => await api.get(GetUserUrl,{timeout:10000}))
    }
}

export const refresh_token = async() => {
    try{
        const response = await api.post(RefreshTokenUrl,{})
        return true;
    }catch(error){
        return false;
    }
}

const call_refresh = async (error, func) => {
    if(error.response && error.response.status === 401){
        const tokenRefreshed = await refresh_token()
        if(tokenRefreshed){
            const retryResponse = await func();
            return retryResponse.data
        }
    }
    return false
}

export const logout = async () => {
    try{
        await api.post(LogoutUrl,{})
        return true
    }catch(error){
        return false
    }
}

export const is_authenticated = async()=>{
    try{
        await api.post(AuthenticateUrl,{})
        return true
    }catch(error){
        return false
    }
}