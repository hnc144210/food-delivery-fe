import { catalogApi, extractData } from "@/lib/api";
import type {
  CatalogCategory,
  CatalogListParams,
  MessageResponse,
  PaginatedResponse,
  Product,
  ProductAvailabilityPayload,
  ProductPayload,
} from "@/types/api";

export const menuService = {
  async getCategories(params?: CatalogListParams): Promise<CatalogCategory[]> {
    const res = await catalogApi.get("/api/catalog/categories", { params });
    const data = extractData<PaginatedResponse<CatalogCategory> | CatalogCategory[]>(res);
    return Array.isArray(data) ? data : data.items;
  },

  async getMyProducts(): Promise<Product[]> {
    const res = await catalogApi.get("/api/catalog/products/merchant/me");
    console.log('raw res.data:', JSON.stringify(res.data));
    const data = extractData<PaginatedResponse<Product> | Product[]>(res);
    console.log('after extract:', JSON.stringify(data));
    return Array.isArray(data) ? data : data.items;
  },

  async getProduct(id: string): Promise<Product> {
    const res = await catalogApi.get(`/api/catalog/products/${id}/detail`);
    return extractData<Product>(res);
  },

  async createProduct(body: ProductPayload): Promise<Product | MessageResponse> {
    const res = await catalogApi.post("/api/catalog/products", body);
  console.log('create body:', JSON.stringify(body));
  console.log('create response:', JSON.stringify(res.data));
  return extractData<Product | MessageResponse>(res);
  },

  async updateProduct(id: string, body: ProductPayload): Promise<Product | MessageResponse> {
    const res = await catalogApi.put(`/api/catalog/products/${id}`, body);
    return extractData<Product | MessageResponse>(res);
  },

  async updateProductAvailability(id: string, body: ProductAvailabilityPayload): Promise<MessageResponse> {
    const res = await catalogApi.patch(`/api/catalog/products/${id}/availability`, body);
    return extractData<MessageResponse>(res);
  },

  async deleteProduct(id: string): Promise<MessageResponse> {
    const res = await catalogApi.delete(`/api/catalog/products/${id}`);
    return extractData<MessageResponse>(res);
  },
};