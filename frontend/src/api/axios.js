
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000',   //nestjs backend server
  withCredentials: true,
})

export default instance
