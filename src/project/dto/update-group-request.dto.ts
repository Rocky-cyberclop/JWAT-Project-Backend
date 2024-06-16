export interface UpdateGroupDocumentRequest {
  id: number;
  name: string;
  removeDocuments: number[];
  addDocuments: number[];
}
