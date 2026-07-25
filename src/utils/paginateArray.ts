export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export function paginateArray<T>(items: T[], page: number, perPage: number): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  return { items: items.slice(start, start + perPage), total, page, totalPages };
}
