declare namespace API {
  type BaseResponseType<T> = {
    success: boolean;
    message: string;
    data: T;
  };
  type IPage<T> = {
    page: number;
    size: number;
    records: Array<T>;
    total: number;
  }
}
