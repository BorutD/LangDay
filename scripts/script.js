var mainApp = angular.module("mainApp", ['ngRoute', 'ngStorage']);

mainApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.
		when('/intro', {
			templateUrl: 'partials/intro.html',
			controller: 'introCtrl'
		}).
		when('/begin', {
			templateUrl: 'partials/begin.html',
			controller: 'beginCtrl'
		}).
		when('/home', {
			templateUrl: 'partials/home.html'
		}).
		when('/chooseNot', {
			templateUrl: 'partials/chooseNot.html'
		}).
		when('/chooseLang', {
			templateUrl: 'partials/chooseLang.html',
			controller: 'chooseLangCtrl'
		}).
		when('/wordDisplay', {
			templateUrl: 'partials/wordDisplay.html',
			controller: 'wordDisplayCtrl'
		}).
		when('/settings', {
			templateUrl: 'partials/settings.html'
		}).
		when('/aboutUs', {
			templateUrl: 'partials/aboutUs.html'
		}).
		when('/progress', {
			templateUrl: 'partials/progress.html',
			controller: 'progressCtrl'
		}).
		otherwise({
			redirectTo: '/intro'
		});
}]);

mainApp.controller('mainCtrl', function ($scope, $route, $location) {
	$scope.$route = $route;
	$scope.currentPath = $location;
	$scope.isActive = function (viewLocation) {
		return viewLocation === $location.path();
	}
});

mainApp.controller('wordDisplayCtrl', function ($scope, $localStorage, $http, $route, $location, $timeout) {
	// MomentJS
	$scope.now = moment().format('YYYY, MM, DD');
	$scope.progress = 1;

	if ($localStorage.savedLang != '' && $localStorage.savedLang != undefined) {
		$scope.savedLang = $localStorage.savedLang;

		// Learning language
		$scope.language = $localStorage.savedLang;

		// Flag images
		$scope.learnPath = "partials/img/" + $scope.language + ".png";
		$scope.englishPath = "partials/img/english.png";

		// JSON files
		$scope.learnFile = "partials/content/" + $scope.language + ".json";
		$scope.englishFile = "partials/content/english.json";

		$http.get($scope.learnFile).then(function (response) {
			$scope.learningData = response.data;
			//$scope.path = 'partials/img/'+$scope.language+'.png';
		}, function (response) {
			$scope.learningData = "Something went wrong.";
		});

		$http.get($scope.englishFile).then(function (response) {
			$scope.englishData = response.data;
		}, function (response) {
			$scope.englishData = "Something went wrong.";
		});
	}


	$scope.$route = $route;
	$scope.currentPath = $location;
	if ($route.current.templateUrl == "partials/wordDisplay.html") {
		if ($localStorage.progress == '' || $localStorage.progress == undefined) {
			$localStorage.progress = 1;
			$scope.progress = 1;
			$localStorage.last_seen = moment().format("YYYY, MM, DD");
		} else if (moment(moment().format("YYYY, MM, DD"), "YYYY, MM, DD").diff(moment($localStorage.last_seen, "YYYY, MM, DD"), 'days') == 1) {
			$scope.progress = parseInt($localStorage.progress) + 1;
			$localStorage.progress = $scope.progress;
			$localStorage.last_seen = moment().format("YYYY, MM, DD");
		} else if (moment(moment().format("YYYY, MM, DD"), "YYYY, MM, DD").diff(moment($localStorage.last_seen, "YYYY, MM, DD"), 'days') > 1) {
			$localStorage.progress = 1;
			$scope.progress = 1;
			$localStorage.last_seen = moment().format("YYYY, MM, DD");
		}
	}

	// If language empty myData = select language
	if ($localStorage.progress % 10 == 0) {
		$timeout(function () {
			$('.wordDisplay').ready(function () {
				$('#progressModal').modal("show");
			});
		}, 2000);
	}
});

mainApp.controller('progressCtrl', function ($scope, $localStorage, $route, $location) {
	$scope.currentDate = moment().format("YYYY, MM, DD");
	$scope.$route = $route;
	$scope.currentPath = $location;
	$scope.progress = $localStorage.progress;
	if ($route.current.templateUrl == "partials/progress.html") {
		if (moment(moment().format("YYYY, MM, DD"), "YYYY, MM, DD").diff(moment($localStorage.last_seen, "YYYY, MM, DD"), 'days') > 1) {
			$scope.progress = 0;
			$localStorage.progress = $scope.progress;
		}
	}
});

mainApp.controller('chooseLangCtrl', function ($scope, $timeout, $location, $localStorage) {
	$scope.saveData = function (lang) {
		$localStorage.savedLang = lang;
		$timeout(function () {
			$location.path('/begin');
		});
	}
});

mainApp.controller('introCtrl', function ($timeout, $location, $localStorage) {
	$timeout(function () {
		if (($localStorage.savedLang != '' && $localStorage.savedLang != undefined)) {
			$location.path("/progress");
		} else {
			$location.path("/chooseLang");
		}
	}, 2000);
});

mainApp.controller('beginCtrl', function ($timeout, $location) {
	$timeout(function () {
		$location.path('/wordDisplay');
	}, 1500);
});

window.onload = function () {
	document.getElementsByTagName('body')[0].onclick = function (e) {
		$(".navbar-collapse").collapse('hide');
	};
}