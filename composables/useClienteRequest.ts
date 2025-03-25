export const useClienteRequest = () => {
  const client = useSanctumClient();

  const request = async (url: string, method: string, body: any = null) => {
    try {
      const { data, error } = await useAsyncData(url, () => {
        return client(url, {
          method,
          body: body ? body : null,
        });
      });

      if (error && error.value instanceof Error) {
        throw error.value?.data;
      }

      return data.value;
    } catch (e) {
      throw e;
    }
  };

  // Función para construir el query string
  const buildQuery = (params: Record<string, any>) => {
    const query = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        query.append(key, params[key]);
      }
    }
    return query.toString();
  };

  return {
    get: (url: string, params: Record<string, any> = {}) => {
      const queryString = buildQuery(params);
      const fullUrl = queryString ? `${url}?${queryString}` : url;
      return request(fullUrl, 'GET');
    },
    post: (url: string, body: any) => request(url, 'POST', body),
    put: (url: string, body: any) => request(url, 'PUT', body),
    deleted: (url: string) => request(url, 'DELETE'),
  };
};
