import axios from 'axios';

const http = axios.create({
    baseURL: "https://api-cashingames.herokuapp.com/api",
    // headers: {
    //   // 'Accept': 'application/json',
    //   // 'Authorization': `Bearer ${token}`,
    //   // 'X-Requested-With': 'XMLHttpRequest'
    // },
});

let token = null;

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
  login: (username, password) =>
    http.post('/auth/login', { username, password }),
  register: data =>
    http.post('/auth/register', data),
  checkValidEmail: email =>
    http.post(`/auth/email/is-valid`, { email }),
}

const Profile = {
  save: profile =>
    http.put('/v1/profile', { profile }),
  load: () =>
    http.get('/v1/profile/me'),
}

export default {
  Auth,
  Profile,
  setToken: _token => { token = _token; },
};