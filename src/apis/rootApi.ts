import axios from 'axios';

const rootApi = axios.create({
    baseURL: 'https://ohbau.cloud/api/v1/',
})

export default rootApi; 