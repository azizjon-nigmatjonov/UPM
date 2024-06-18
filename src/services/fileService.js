
import fileSystemConfig from "../configs/fileSystem.config";
import requestCDN from "../utils/requestCDN";

const fileService = {
  getFileList: (folderId) => requestCDN.get('/folder', { params: { parent_id: folderId } }),
  createFolder: (data) => requestCDN.post('/folder', data),
  updateFolder: (folderId, data) => requestCDN.put(`/folder/${folderId}`, data),
  deleteFolder: (folderId) => requestCDN.delete(`/folder/${folderId}`),
  createFile: (folderId, data) => requestCDN.post(`/file/${folderId}`, data),
  deleteFile: (fileId) => requestCDN.delete(`/file/${fileId}`),
  uploadImage: (data) => fileService.createFile(fileSystemConfig.imagesFolderID, data),
  uploadFile: (data) => fileService.createFile(fileSystemConfig.filesFolderID, data),
  createLinkFile: (data) =>requestCDN.post('/link-file', data ),
  deleteLinkFile: (linkFileId) =>requestCDN.delete(`/link-file/${linkFileId}` ),
}

export default fileService