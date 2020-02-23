import axios from 'axios';
import {AsyncStorage} from 'react-native';
let token = null;


const http = axios.create({
    baseURL: "https://moovelogic.herokuapp.com/api",
    // headers: {
    //   'Accept': 'application/json',
    //   'Authorization': `Bearer ${token}`,
    //   'X-Requested-With': 'XMLHttpRequest'
    // },
});

(async () => {
  http.defaults.headers.common['Authorization'] = `Bearer ${await AsyncStorage.getItem("jwt")}`;
})();

console.log("headers", http.defaults.headers);


const responseBody = res => res.json();

const tokenPlugin = req => {
  req.set('Accept', 'application/json');

  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }

}

// const requests = {
//   del: url =>
//     superagent.del(`${url}`).use(tokenPlugin).then(responseBody),
//   get: url =>
//     superagent.get(`${url}`),
//   put: (url, body) =>
//     superagent.put(`${url}`, body).use(tokenPlugin).then(responseBody),
//   post: (url, body) =>
//     superagent.post(`${url}`, body)  
// };

const Auth = {
  current: () =>
    http.get('/v1/user/me'),
  login: (phone_number, password) =>
    http.post('/auth/login', { phone_number, password }),
  register: data =>
    http.post('/auth/register', data),
  checkValidEmail: email =>
    http.post(`/auth/email/is-valid`, { email }),
}

const Trip = {
  active: async () => {
     const tok = await AsyncStorage.getItem("jwt");
    return http.get('/active-ride', { headers: {"Authorization" : `Bearer ${tok}`} }) 
  },

  load: () =>
    http.get('/v1/profile/me'),

  startTrip: async (tripId) => {
    const tok = await AsyncStorage.getItem("jwt");
    return http.post(`/start-trip/${tripId}`, { headers: {"Authorization" : `Bearer ${tok}`} });
  },

  endTrip: async (tripId) => {
    const tok = await AsyncStorage.getItem("jwt");
    return http.post(`/end-trip/${tripId}`, { headers: {"Authorization" : `Bearer ${tok}`} });
  }
}

const Package = {
  delivered: async (packageId) => {
    const tok = await AsyncStorage.getItem("jwt");
    return http.post(`/delivered/${packageId}`, { headers: {"Authorization" : `Bearer ${tok}`} });
  },
  notDelivered: async (packageId) => {
    const tok = await AsyncStorage.getItem("jwt");
    return http.post(`/not-delivered/${packageId}`, { headers: {"Authorization" : `Bearer ${tok}`} });
  }
}

export default {
  Auth,
  Trip,
  Package,
  setToken: _token => { token = _token; },
};