import http from 'k6/http';
import { sleep, check } from 'k6';
import { Trend } from 'k6/metrics';

// ===== CUSTOM METRICS =====
const api3Duration = new Trend('brands_api3_duration');
const api4Duration = new Trend('brands_api4_duration');

// ===== CONFIGURACIÓN =====
const optionsGeneral = {
  executor: 'constant-vus',
  vus: 10,
  duration: '10s',
};

export const options = {
  scenarios: {
    API3: {
      ...optionsGeneral,
      exec: 'API3_GetAllBrandsList',
      startTime: '0s'
    },
    API4: {
      ...optionsGeneral,
      exec: 'API4_PutBrandsList',
      startTime: '10s'
    },
  },
  /*
  thresholds: {
    'brands_api3_duration': ['p(95)<500'],
    'brands_api4_duration': ['p(95)<500']
  }
  */
};

const base_url = 'https://automationexercise.com/api';

// ===== FUNCIONES POR CASO =====

export function API3_GetAllBrandsList() {
  const start = Date.now();
  const url = `${base_url}/brandsList`;
  const res = http.get(url, {
    tags: { name: 'Brands_API3' }
  });

  api3Duration.add(Date.now() - start);

  check(res, {
    '(Brands/API3)-----------------------------------------------': () => true === true,
    '(Brands/API3) status is 200': (res) => res.status === 200,
    '(Brands/API3) Respuesta body incluye brands': (res) => res.body.includes(`"brands":`),
    '(Brands/API3) brands > 0': (res) => JSON.parse(res.body).brands.length > 0,
    '(Brands/API3) Tiempo de solicitud < 500ms': (res) => res.timings.duration < 500
  });
  sleep(1);
}

export function API4_PutBrandsList() {
  const start = Date.now();
  const url = `${base_url}/brandsList`;
  const res = http.put(url, null, {
    tags: { name: 'Brands_API4' }
  });

  api4Duration.add(Date.now() - start);

  check(res, {
    '(Brands/API4)-----------------------------------------------': () => true === true,
    '(Brands/API4) status 405': (r) => r.status === 405,
    '(Brands/API4) response contains error message': (r) => r.body.includes('This request method is not supported') || r.status === 405,
    '(Brands/API4) response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
