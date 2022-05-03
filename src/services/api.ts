import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://api-brazilian-soccer-clubs.herokuapp.com'
})