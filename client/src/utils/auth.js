import decode from 'jwt-decode';

class AuthService {
    //retrieve data saved
    getProfile() {
        return decode(this.getToken());
    }

    //check if usr is logged in
    loggedIn() {
        //checks if there is a saved token - still valid
        const token = this.getToken();

        return !!token && !this.isTokenExpired(token);
    }

    //check if token expired
    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            } else {
                return false;
            } 
        } catch (err) {
                return false;
            }
        }

        //retrieve from local storage
        getToken() {
            return localStorage.getItem('id_token');
        }
        //set token to local storage and reload page to homepage
        login(idToken) {
            //saves user token to local
            localStorage.setItem('id_token', idToken);

            window.location.assign('/');
        }

        //clear token from local
        logout() {
            //clear user token and profile data from local
            localStorage.removeItem('id_token');
            //reload the page and reset state
            window.location.assign('/');
        }
    }

export default new AuthService();