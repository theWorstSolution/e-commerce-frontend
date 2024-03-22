import axios from 'axios';
import firebase from 'firebase/compat/app';
// config
import { HOST_API } from '../config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
});

axiosInstance.interceptors.request.use(async function (config) {
    await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        // Send token to your backend via HTTPS
        // ...
        config.headers['x-access-token'] = idToken ? idToken : '';
        // console.log(idToken);
      }).catch(function(error) {
        // Handle error
        console.log("error in axios intercep request");
      });
//   const token = localStorage.getItem('zennomi-token');
// config.headers['x-access-token'] = 'abcd'
return config;
  
}
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("error in axios intercep response");
    console.log(error.response);
    return Promise.reject((error.response && error.response.data && (error.response.data.message || error.response.data || error.response )) || 'Something went wrong')
  }
);

export default axiosInstance;