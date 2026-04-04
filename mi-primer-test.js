import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '15s',
  iterations: 40
};

// const url = 'https://quickpizza.grafana.com';
const url = 'https://httpbin.test.k6.io/post';

export default function() {
  // let res = http.get(url);
  let res = http.post(url, "hola mundo");
  check(res, { 
    'status is 200': (res) => res.status === 200,
    'Respuesta body es "Hola mundo"':(res)=>res.body.includes("hola mundo"), //Antíguamente devolvía hola mundo. Ahora devuelve códig html
    'Tiempo de solicitud < 500ms':(res)=>res.timings.duration < 500
   });
  sleep(1);
}
