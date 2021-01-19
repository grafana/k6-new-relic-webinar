import { check, sleep } from 'k6';
import { NewRel } from './util/newrelic.js'
import http from 'k6/http';

const apiKey = 'ADD_KEY_HERE'
const nr = new NewRel(apiKey);

export const options = {
  vus: 10,
  duration: '10s'
}

export function setup() {  
  nr.PrintAlertingStatus();
  nr.Notify(
    '10AM load test',
    'START',
    'Beginning E2E load test script',
    'simme@k6.io',
  );
}

export default function () {
  execFrontPage();
  execMathUrl('http://nodeworkshop.eu-west-2.elasticbeanstalk.com/badmaths')
  execMathUrl('http://nodeworkshop.eu-west-2.elasticbeanstalk.com/maths')
  execMathUrl('http://nodeworkshop.eu-west-2.elasticbeanstalk.com/weirdmaths');
  sleep(1);
}

function execFrontPage() {
  const res = http.get(
    'http://nodeworkshop.eu-west-2.elasticbeanstalk.com',
    { type: 'part-of-test' },
  );

  check(res, {
    'was succesful': (r) => r.status == 200,
    'contains the header': (r) => r.body.includes('New Relic Node Workshop')
  })
}

function execMathUrl(url) {
  const res = http.get(url, { type: 'part-of-test' });
  
  return check(res, {
    'was succesful': (r) => r.status === 200,
    'has body': (r) => r.body && r.body != '',
    'returns 10': (r) => parseInt(JSON.parse(r.body).x, 10) === 10
  })
}

export function teardown(data) {
  nr.Notify(
    '10AM load test',
    'END',
    'Finishing E2E load test script',
    'simme@k6.io'
    );
  nr.PrintAlertingStatus();
}
