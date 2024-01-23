export const config = {
    headers: {
      Authorization: localStorage.getItem('token'),
      'Content-Type': 'multipart/form-data',
    },
  }