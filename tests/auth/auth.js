import http from 'k6/http';
import { sleep, check } from 'k6';
import { Trend } from 'k6/metrics';

// ===== CUSTOM METRICS =====
const api8Duration = new Trend('auth_api8_duration');
const api9Duration = new Trend('auth_api9_duration');
const api10Duration = new Trend('auth_api10_duration');

// ===== CONFIGURACIÓN =====
const optionsGeneral = {
  executor: 'constant-vus',
  vus: 10,
  duration: '10s',
};

export const options = {
  scenarios: {
    API8: {
      ...optionsGeneral,
      exec: 'API8_PostVerifyLoginWithoutEmail',
      startTime: '0s'
    },
    API9: {
      ...optionsGeneral,
      exec: 'API9_DeleteToVerifyLogin',
      startTime: '10s'
    },
    API10: {
      ...optionsGeneral,
      exec: 'API10_PostToVerifyLoginWithInvalidDetails',
      startTime: '20s'
    },
  },
  /*
  thresholds: {
    'auth_api8_duration': ['p(95)<500'],
    'auth_api9_duration': ['p(95)<500'],
    'auth_api10_duration': ['p(95)<500']
  }
  */
};

const base_url = 'https://automationexercise.com/api';

// ===== FUNCIONES POR CASO =====

export function API8_PostVerifyLoginWithoutEmail() {
  const start = Date.now();
  const url = `${base_url}/verifyLogin`;

  // Enviar solo password sin email
  const payload = 'password=1234';
  const res = http.post(url, payload, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    tags: { name: 'Auth_API8' }
  });

  api8Duration.add(Date.now() - start);

  check(res, {
    '(Auth/API8)-----------------------------------------------': () => true === true,
    '(Auth/API8) status 400': (r) => r.status === 400,
    '(Auth/API8) error message present': (r) => r.body.includes('Bad request') && r.body.includes('email or password parameter is missing'),
    '(Auth/API8) response time < 500ms': (r) => r.timings.duration < 500
  });
  sleep(1);
}

export function API9_DeleteToVerifyLogin() {
  const start = Date.now();
  const url = `${base_url}/verifyLogin`;

  // Enviar DELETE request (método no soportado)
  const res = http.del(url, null, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    tags: { name: 'Auth_API9' }
  });

  api9Duration.add(Date.now() - start);

  check(res, {
    '(Auth/API9)-----------------------------------------------': () => true === true,
    '(Auth/API9) status 405': (r) => r.status === 405,
    '(Auth/API9) response message "This request method is not supported"': (r) => r.body.includes('This request method is not supported'),
    '(Auth/API9) response time < 500ms': (r) => r.timings.duration < 500
  });
  sleep(1);
}

export function API10_PostToVerifyLoginWithInvalidDetails() {
  const start = Date.now();
  const url = `${base_url}/verifyLogin`;

  // Enviar POST con email y password inválidos
  const payload = 'email=invalid@test.com&password=wrongpassword';
  const res = http.post(url, payload, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    tags: { name: 'Auth_API10' }
  });

  api10Duration.add(Date.now() - start);

  check(res, {
    '(Auth/API10)-----------------------------------------------': () => true === true,
    '(Auth/API10) status 404': (r) => r.status === 404,
    '(Auth/API10) response message "User not found!"': (r) => r.body.includes('User not found'),
    '(Auth/API10) response time < 500ms': (r) => r.timings.duration < 500
  });
  sleep(1);
}
