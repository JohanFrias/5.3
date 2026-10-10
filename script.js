import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // sube a 10 usuarios virtuales
    { duration: '1m',  target: 20 },  // sube a 20 usuarios
    { duration: '30s', target: 0 },   // baja a 0
  ],
  thresholds: {
    http_req_failed:   ['rate<0.01'],   // menos de 1% de errores
    http_req_duration: ['p(95)<800'],   // 95% de respuestas bajo 800 ms
  },
};

     //test-api.k6.io/public/crocodiles/  -- API publica para practicas 
export default function () {
  const res = http.get('https://test-api.k6.io/public/crocodiles/');
  check(res, {
    'status es 200': (r) => r.status === 200,
    'responde en menos de 800ms': (r) => r.timings.duration < 800,
  });
  sleep(1);
}