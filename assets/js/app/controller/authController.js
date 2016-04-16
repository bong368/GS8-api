(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('AuthController', AuthController);


    function AuthController($socket, $auth, $state, $http, $rootScope, $scope, ngDialog, $translate, SweetAlert) {

        $scope.login = function() {

            var credentials = {
                username: $scope.username,
                password: $scope.password
            }

            $auth.login(credentials).then(function() {

                // Return an $http request for the now authenticated
                // user so that we can flatten the promise chain
                return $http.get(baseUrl + 'api/authenticate/user');

            // Handle errors
            }, function(error) {

                SweetAlert.swal("Sorry!", $translate.instant('INVALID_CREDS'), "error");

            // Because we returned the $http.get request in the $auth.login
            // promise, we can chain the next promise to the end here
            }).then(function(response) {

                // Stringify the returned data to prepare it
                // to go into local storage
                var user = JSON.stringify(response.data.user);

                // Set the stringified user data into local storage
                localStorage.setItem('user', user);

                // The user's authenticated state gets flipped to
                // true so we can now show parts of the UI that rely
                // on the user being logged in
                $rootScope.authenticated = true;

                // Putting the user's data on $rootScope allows
                // us to access it anywhere across the app
                $rootScope.currentUser = response.data.user;

                // Everything worked out so we can now redirect to
                // the users state to view the data
                $state.go('home');

                var credentials = {
                    username : $rootScope.currentUser.username, 
                    session : auth.session
                }

                $socket.emit('auth.login', credentials);
            });
        }

        // We would normally put the logout method in the same
        // spot as the login method, ideally extracted out into
        // a service. For this simpler example we'll leave it here
        $scope.logout = function() {

            var credentials = {
                username : $rootScope.currentUser.username
            };
            
            $socket.emit('auth.logout', credentials);

            $auth.logout().then(function() {

                // Remove the authenticated user from local storage
                localStorage.removeItem('user');

                // Flip authenticated to false so that we no longer
                // show UI elements dependant on the user being logged in
                $rootScope.authenticated = false;

                // Remove the current user info from rootscope
                $rootScope.currentUser = null;

                $scope.username = '';
                $scope.password = '';
            });
        }

        $socket.on('auth.logout', function(data) {
            
            $auth.logout().then(function() {

                // Remove the authenticated user from local storage
                localStorage.removeItem('user');

                // Flip authenticated to false so that we no longer
                // show UI elements dependant on the user being logged in
                $rootScope.authenticated = false;

                // Remove the current user info from rootscope
                $rootScope.currentUser = null;

            });
               
        });

        $scope.changeLanguage = function(key) {
            $rootScope.lang = key;
            $translate.use(key);
        }
    }

})();