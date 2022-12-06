export async function uploadFile(file, url, carpeta) {
  const _token = document.querySelector('meta[name="csrf-token"]').content
  // set up the request data
  let formData = new FormData()
  formData.append('file', file.file)
  formData.append('_token', _token)
  formData.append('carpeta', carpeta)

  // track status and upload file
  file.status = 'loading'
  let response = await fetch(url, { method: 'POST', body: formData })

  // change status to indicate the success of the upload request
  file.status = response.ok

  return response
}

export function uploadFiles(files, url, carpeta) {
  return Promise.all(files.map((file) => uploadFile(file, url, carpeta)))
}

export default function createUploader(url) {
  return {
    uploadFile: function (file) {
      return uploadFile(file, url)
    },
    uploadFiles: function (files, carpeta) {
      return uploadFiles(files, url, carpeta)
    },
  }
}
