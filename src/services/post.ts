import axios from 'axios'
const HTTP = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

export const getPosts = async() => {
    const promise = await HTTP.get("/post/all")
    return promise
}

export const getPostsWithAuth = async(token: string) => {
    HTTP.defaults.headers.common['Authorization'] = "Bearer " + token
    const promise = await HTTP.get("/post")
    return promise
}