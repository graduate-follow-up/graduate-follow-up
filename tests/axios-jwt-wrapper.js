const jwt = require('jsonwebtoken');
const axios = require('axios');
// load env
require('dotenv').config({ path: '../.env/api.env' });

axios.defaults.baseURL = process.env.PROXY_URL | 'http://localhost';

const credentials = {
  admin: {
    id: "5eba686123cbdbf4c4b0278b",
    username: "dolor",
    role: "administrateur"
  },
  respo: {
    id: "5eba6861b0b374d1e825fa68",
    username: "excepteur",
    role: "respo-option"
  },
  prof: {
    id: "5eba68613b6d1a9069756982",
    username: "magna",
    role: "prof"
  }
}

function createConfig(payload) {
  return {
    headers: {
      'Authorization': 'Bearer ' + jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET)
    }
  }
}

let axiosServices = {};
function getOrCreateService(service) {
  if(!(service in axiosServices)) {
    axiosServices[service] = axios.create(createConfig({username: service, role: 'service', id: service}));
  }

  return axiosServices[service];
}

module.exports = {
  withoutToken: axios,
  asAdmin: axios.create(createConfig(credentials.admin)),
  asRespo: axios.create(createConfig(credentials.respo)),
  asUser: axios.create(createConfig(credentials.prof)),
  asService: getOrCreateService
}