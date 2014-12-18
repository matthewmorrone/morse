var morseApp = angular.module('morseApp', []);

morseApp.controller('morsesDataControl', function($scope, $http)
{
	$http.get('morse.json').success(function(data)
	{
		$scope.morses = data;

        $scope.glyph = _.pluck(data, 'glyph');
		$scope.morse = _.pluck(data, 'morse');
		$scope.sound = _.pluck(data, 'sound');
	});

	$scope.orderProp = 'glyph';

});
