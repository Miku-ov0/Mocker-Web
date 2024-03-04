import request from '../utils/request';

const BASE_PATH = '/management/api'

export const apiPage = async ({ page = 0, size = 10, params = {} }) => {
    return await request<API.IPage<Api>>({
        url: BASE_PATH + `/page?page=${page}&size=${size}`,
        params,
        method: "get"
    })
}

export const getById = async (id:number) => {
    return await request<Api>({
        url: BASE_PATH + `/${id}`,
        method: 'get'
    })
}

export const modify = async (api: any) => {
    return await request({
        url: BASE_PATH,
        method: "put",
        data: api
    })
}

export const create = async (api: any) => {
    return await request({
        url: BASE_PATH,
        method: "post",
        data: api
    })
}

export const deleteApi = async (id: number) => {
    return await request({
        url: BASE_PATH + `?id=${id}`,
        method: "delete"
    })
}

export const reload = async () => {
    return await request({
        url: BASE_PATH + '/reload',
        method: "post"
    })
}