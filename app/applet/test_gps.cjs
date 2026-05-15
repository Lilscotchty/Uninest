import https from 'https';

const address = 'GM-167-4536';
const formData = new URLSearchParams({
  address: address,
  asaaseUser: process.env.GPGPS_asaaseUser,
  countryName: process.env.GPGPS_countryName,
  androidCert: process.env.GPGPS_androidCert,
  languageCode: process.env.GPGPS_languageCode,
  country: process.env.GPGPS_country,
  language: process.env.GPGPS_language,
  deviceId: process.env.GPGPS_deviceId,
  androidPackage: process.env.GPGPS_androidPackage
});

const options = {
  method: 'POST',
  headers: {
    'Authorization': process.env.GPGPS_authorization,
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
};

fetch(process.env.GPGPS_apiURL, {
    method: 'POST',
    headers: {
        'Authorization': process.env.GPGPS_authorization,
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
}).then(res => res.text()).then(t => console.log(t)).catch(console.error);
