(function () {
  'use strict';

  angular
    .module('lucidworksView.components.login', ['lucidworksView.services.auth',
      'ui.router'
    ])
    .directive('login', login);

  function login() {
    'ngInject';
    return {
      controller: Controller,
      templateUrl: 'assets/components/login/login.html',
      controllerAs: 'vm',
      bindToController: true,
      scope: true
    };

  }

  function Controller(ConfigService, Orwell, AuthService, $state) {
    'ngInject';
    var vm = this;
    vm.username = '';
    vm.password = '';
    vm.error = '';
    vm.submitting = false;

    vm.submit = submit;

    function submit() {
      vm.error = '';
      vm.submitting = true;
      AuthService
        .createSession(vm.username, vm.password)
        .then(success, failure);

      function success() {
        vm.submitting = false;
        $state.go('home');
      }

      function failure(err) {
        vm.submitting = false;
        if(err && err.data && err.data.code) {
          if(err.data.code === 'authentication-error') {
            vm.error = 'Invalid username or password. Please try again.'
          } else {
            vm.error = err.data.code;
          }
        } else {
          vm.error = err;
        }
      }
    }
  }
})();
