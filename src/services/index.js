//const APIURL ="http://pinponixelb-env.eba-gj363pf3.us-east-1.elasticbeanstalk.com:3000/";
//const APIURL = 'http://52.4.0.180:3000/';
//const APIURL = 'http://51.15.204.121:5000/';
const APIURL = 'http://51.15.204.121:3000/';

const headers = {
  'Content-Type': 'application/json',
  // Authorization:
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHBpbnBvbml4LmNvbSIsInBhc3N3b3JkIjoiMTIzNEAxMjM0IiwiaWF0IjoxNjIyMjY0Njc0fQ.P_yhxpgtfQaHAqVy6SGR3NUuNxw5xWNiuhcCv742MPU',
};

const services = {
  post: async (apiname, data, image = false) => {
    try {
      console.log('the api datas', data);

      const response = await fetch(APIURL + apiname, {
        method: 'POST',
        headers: !image ? headers : '',
        body: !image ? JSON.stringify(data) : data,
      });
      const json = await response.json();
      return json;
    } catch (err) {
      throw err;
    }
  },
  put: async (apiname, data, image = false) => {
    try {
      console.log('the api datas', data);

      const response = await fetch(APIURL + apiname, {
        method: 'PUT',
        headers: !image ? headers : '',
        body: !image ? JSON.stringify(data) : data,
      });
      const json = await response.json();
      return json;
    } catch (err) {
      throw err;
    }
  },
  get: async apiname => {
    try {
      const response = await fetch(APIURL + apiname, {
        method: 'GET',
        headers: headers,
      });
      const json = await response.json();
      return json;
    } catch (err) {
      throw err;
    }
  },
  delete: async apiname => {
    try {
      const response = await fetch(APIURL + apiname, {
        method: 'DELETE',
        headers: headers,
      });
      const json = await response.json();
      return json;
    } catch (err) {
      throw err;
    }
  },
};



export default services;
