// TypeScript dom lib 包含基础 FileSystemDirectoryHandle / FileSystemFileHandle 类型,
// 但缺 File System Access API 的方法 (showDirectoryPicker, queryPermission, requestPermission)。
// 这里给这些方法补类型,跟 Chrome 实际实现对齐。

interface FileSystemHandlePermissionDescriptor {
  mode?: "read" | "readwrite";
}

// FileSystemHandle 是基类;dom lib 已定义 kind 字段,我们补充方法
interface FileSystemHandle {
  queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
  requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
}

interface FileSystemDirectoryHandle {
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
}

interface FileSystemFileHandle {
  getFile(): Promise<File>;
  createWritable(options?: { keepExistingData?: boolean }): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: string | BufferSource | Blob): Promise<void>;
  seek(position: number): Promise<void>;
  truncate(size: number): Promise<void>;
}

interface Window {
  showDirectoryPicker(options?: {
    mode?: "read" | "readwrite";
    startIn?: FileSystemHandle | string;
  }): Promise<FileSystemDirectoryHandle>;
}
