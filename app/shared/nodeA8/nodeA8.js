/**
 *
 * Node.JS Support Stuff for A8
 *
 * Works with and requires a8API
 *
 */


angular.module( 'nodeA8.service', [] )
    .factory( 'nodeA8', function ( $http, $q, $rootScope, $log, a8API ) {

        var ip = require( 'ip' );
        var service = {};

        service.getMyIp = function () {

            return ip.address();

        }

        service.getMySubnet = function () {

            var components = ip.address().split( "." );
            return components[ 0 ] + '.' + components[ 1 ] + '.' + components[ 2 ];

        }

        service.huntServers = function () {


            var searchArray = [];
            for ( var baseIp = 2; baseIp < 255; baseIp++ )
                searchArray.push( baseIp );

            searchArray.forEach( function ( ip ) {

                var endpoint = "http://" + service.getMySubnet() + '.' + ip + ":1337/api/v2/queue";
                $log.debug( "Checking endpoint: " + endpoint );

                $http.get( endpoint )
                    .then( function ( res ) {

                        $log.debug( "Found server at: " + endpoint );
                        $rootScope.$broadcast( "FOUND_A8", "http://" + service.getMySubnet() + '.' + ip + ":1337/api/v2" );
                    } )
                    .catch( function ( err ) {

                        $log.error( "Failed getting: " + endpoint );

                    } )


            } )


        }


        return service;
    } );