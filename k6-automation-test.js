import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '15s',
  iterations: 20
};

const base_url = 'https://automationexercise.com/api';

export default function() {
  
  API1_GetAllProductsList();
  API2_PostToAllProductsList();
  
}

function API1_GetAllProductsList(){
  const url = `${base_url}/productsList`;
  let res = http.get(url);
  check(res, { 
    'API1 - status is 200': (res) => res.status === 200,
    'API1 - Respuesta body incluye products':(res)=>res.body.includes(`"products":`),
    'API1 - products > 0':(res)=>JSON.parse(res.body).products.length > 0,
    'API1 - Tiempo de solicitud < 500ms':(res)=>res.timings.duration < 500
   });
  sleep(1);
}
function API2_PostToAllProductsList(){
  const url = `${base_url}/productsList`;
  let res = http.post(url, "This request method is not supported");
  check(res, { 
    'API2 - status is 405': (res) => res.status === 405,
    'API2 - Respuesta body: "This request method is not supported':(res)=>res.body.includes(`"This request method is not supported"`),
    'API2 - Tiempo de solicitud < 500ms':(res)=>res.timings.duration < 500
   });
  sleep(1);
}
function API3_GetAllBrandsList(){
  const url = `${base_url}/brandsList`;
  let res = http.get(url);
  check(res, { 
    'API3 - status is 200': (res) => res.status === 200,
    'API3 - Respuesta body incluye brands':(res)=>res.body.includes(`"brands":`),
    'API3 - brands > 0':(res)=>JSON.parse(res.body).brands.length > 0,
    'API3 - Tiempo de solicitud < 500ms':(res)=>res.timings.duration < 500
   });
  sleep(1);
}