(function () {
    angular.module('accessControl', ['ngMaterial','md.data.table'])
        .service('connection', [function() {
            var inst = this;
            inst.socket = io();
        }])
        .controller('tabsController', ['$scope','connection','$rootScope',function($scope, connection, $rootScope) {
            var inst = this;

            connection.socket.on('connect', function () { // On connection established
                inst.locked = false; // Enable view
                $scope.$apply(); // Re-render view
            });

            connection.socket.on('disconnect', function () { // Hide everything on disconnect
                inst.locked = true;
                $scope.$apply();
            });

            inst.setActiveTab = function(tabId){
                $rootScope.activeTab = tabId;
            };
        }])
        .controller('newUserController', ['$scope','connection','$rootScope',function($scope,connection,$rootScope) {
            var inst = this;
            inst.userInfo = {};
            inst.states = {
                registration:false
            };

            connection.socket.on('reader:get', function (data) {
                if($rootScope.activeTab === "add-user"){
                    inst.userInfo.userId = data.userId;
                    inst.states.registration = false;
                    $scope.$apply();
                }
            });

            connection.socket.on('user:add:ok', function () {
                inst.userInfo = {};
                inst.userForm.$setPristine();
                inst.userForm.$setUntouched();
            });

            inst.add = function(){
                connection.socket.emit("user:add", inst.userInfo)
            };

            inst.registration = function(){
                connection.socket.emit("user:registration");
                inst.states.registration = true;
            };
        }])
        .controller('userListController', ['$scope','connection','$rootScope',function($scope, connection, $rootScope) {
            var inst = this;
            inst.selected = [];

            $scope.$watch(
                function(){return $rootScope.activeTab},
                function(newValue){
                    if(newValue === "user-list"){
                        connection.socket.emit("user:fetch-list")
                    }
                }
            );

            connection.socket.on('user:list', function (data) {
                inst.list = data;
                $scope.$apply();
            });

            inst.delete = function(){
                connection.socket.emit("user:delete",inst.selected[0].rowid);
            };

            connection.socket.on('user:delete:ok', function () {
                connection.socket.emit("user:fetch-list")
            });
        }])
        .controller('eventsListController', ['$scope','$rootScope','connection',function($scope, $rootScope, connection) {
            var inst = this;

            var eventNames = {
                "register": "User Registered",
                "unregister": "User Unregistered",
                "allowed": "Access Allowed",
                "denied": "Access Denied"
            };

            var beautifyRecord = function(item){
                return {
                    firstname: item.firstname === null ? "---" : item.firstname,
                    lastname: item.lastname === null ? "---" : item.lastname,
                    timestamp:item.timestamp,
                    type:eventNames[item.type]
                };
            };

            $scope.$watch(
                function(){return $rootScope.activeTab},
                function(newValue){
                    if(newValue === "events-list"){
                        connection.socket.emit("events:fetch-list")
                    }
                }
            );

            connection.socket.on('events:list', function (data) {
                inst.list = data.map(function(item){
                    return beautifyRecord(item)
                });
                $scope.$apply();
            });

            connection.socket.on('events:add', function (record) {
                inst.list.unshift(
                    beautifyRecord(record)
                );
                console.log(inst.list);
                $scope.$apply();
            });
        }]);
})();
