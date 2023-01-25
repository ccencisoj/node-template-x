export class Pagination {
  public readonly page: number;
  public readonly limit: number;
  public readonly totalDocs: number;
  public readonly totalPages: number;
  public readonly hasNextPage: boolean;
  public readonly nextPage: number | null;
  public readonly hasPrevPage: boolean;
  public readonly prevPage: number | null;
  
  constructor(page: number, limit: number, totalDocs: number) {
    this.page = page;
    this.limit = limit;
    this.totalDocs = totalDocs;
    this.totalPages = Math.ceil(this.totalDocs / this.limit);
    this.hasNextPage = this.page < this.totalPages;
    this.nextPage = this.hasNextPage ? this.page + 1 : null;
    this.hasPrevPage = this.page > 1;
    this.prevPage = this.hasPrevPage ? this.page - 1 : null;
  }
}
