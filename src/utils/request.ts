import axios from "axios";
import { ElMessage } from 'element-plus'

import { getRequestBaseURL } from "./index";

import type { AxiosRequestConfig, AxiosResponse } from "axios";

const netWorkCodeMaps: Record<number, string> = {
  404: "404 Not Found",
  405: "Method Not Allowed",
  504: "网关错误",
  500: "服务器错误",
} as const;
console.log( getRequestBaseURL())
const axiosInterface = axios.create({
  baseURL: getRequestBaseURL(),
  timeout: 10000,
  headers: {
    "content-type": "application/json",
  },
});

// 响应拦截
axiosInterface.interceptors.response.use(
  async (response: AxiosResponse<API.BaseResponseType<any>>) => {
    const { status, data } = response;
    if (status === 200) {
      const { success, message } = data;

      // token 过期
      if (success) {
        // 业务中非 200 的状态码一律弹出
        ElMessage({
          message,
          type: 'success',
        });
      } else {
        ElMessage({
          message,
          type: 'warning',
        });
      }
    }
    return response;
  },
  ({ response }) => {
    // 请求失败，也弹出状态码
    ElMessage({
      message: netWorkCodeMaps[response.status] || "服务器错误",
      type: 'warning',
    });
  }
);

// 对外暴露 request 请求函数
const request = async <T>(
  config: AxiosRequestConfig
): Promise<API.BaseResponseType<T>> => {
  try {
    const { data } = await axiosInterface(config);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default request;
