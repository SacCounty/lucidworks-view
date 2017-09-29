(function () {
  'use strict';

  angular
    .module('lucidworksView.components.login', ['lucidworksView.services.auth',
      'ui.router'
    ])
    .constant('QUERY_PARAM', 'query')
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

  function Controller(ConfigService, Orwell, AuthService, $state, QUERY_PARAM) {
    'ngInject';
    var vm = this;
    vm.username = '';
    vm.password = '';
    vm.error = null;
    vm.submitting = false;

    vm.submit = submit;

    function submit() {
      vm.error = null;
      vm.submitting = true;
      AuthService
        .createSession(vm.username, vm.password)
        .then(success, failure);

      function success() {
        vm.submitting = false;
        var params = {};
        if ($state.params[QUERY_PARAM]) {
          params[QUERY_PARAM] = $state.params[QUERY_PARAM];
        }
        $state.go('home', params);
      }

      function failure(err) {
        vm.submitting = false;
        if(err && err.data) {
          if(err.data.msg && err.data.msg.includes('80090308: LdapErr: DSID-0C0903D9') === true) {
            vm.error = 'Invalid password. Please try again.';
          } else if( err.data.code && err.data.code === 'authentication-error'){
            vm.error = 'Invalid username. Please try again.';
          } else {
            vm.error = 'Unexpected security error.';//err.data.code;
          }
        } else {
          vm.error = 'Unable to login due to server error.';//err;
        }
      }
    }
  }
})();
