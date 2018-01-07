webApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/about', {
			templateUrl: 'views/about.html',
			controller: 'AboutController'
		}).
		when('/create-event', {
			templateUrl: 'views/create-event.html',
			controller: 'CreateController'
		}).
		otherwise({
			templateUrl: 'views/homepage.html',
			controller: 'HomepageController'
		});
}]);
