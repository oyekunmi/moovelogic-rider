const API_ROOT = "https://moovelogic.herokuapp.com/api";

let token = null;

const responseBody = res => res.json();

const tokenPlugin = req => {
  req.set('Accept', 'application/json');

  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }

}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    fetch(`${API_ROOT}${url}`, { 
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }
    ).then(responseBody),
};

const Auth = {
  current: () =>
    requests.get('/v1/user/me'),
  login: (phone_number, password) =>
    requests.post('/auth/login/', { phone_number, password }),
  register: data =>
    requests.post('/auth/register', data),
  checkValidEmail: email =>
    requests.post(`/auth/email/is-valid`, { email }),
}

const Profile = {
  save: profile =>
    requests.put('/v1/profile', { profile }),
  load: () =>
    requests.get('/v1/profile/me'),
}

export default {
  Auth,
  Profile,
  setToken: _token => { token = _token; },
};
