
const api = "https://reactnd-books-api.udacity.com"


// Generate a unique token for storing your bookshelf data on the backend server.
let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

export const get = (bookId) =>
  fetch(`${api}/books/${bookId}`, { headers })
    .then(res => {
      if(!res.ok) {
        throw new Error('Bad response');
      }
      return res;
    })
    .then(res => res.json())
    .then(data => data.book)

export const getAll = () =>
  fetch(`${api}/books`, { headers })
    .then(res => {
      if(!res.ok) {
        throw new Error('Bad response');
      }
      return res;
    })
    .then(res => res.json())
    .then(data => data.books)

export const update = (book, shelf) =>
  fetch(`${api}/books/${book.id}`, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ shelf })
  })
    .then(res => {
      if(!res.ok) {
        throw new Error('Bad response');
      }
      return res;
    })
    .then(res => res.json())

export const search = (query, maxResults) =>
  fetch(`${api}/search`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, maxResults })
  })
    .then(res => {
      if(!res.ok) {
        throw new Error('Bad response');
      }
      return res;
    })
    .then(res => res.json())
    .then(data => data.books)
    .then(data => {
      let unique = {};
      return data.filter(book => {
        if(!unique.hasOwnProperty(book.id)) {
          unique[book.id] = true;
          return true;
        } else {
          return false;
        }
      })
    })
