/* global angular, trackerCapture */

var trackerCapture = angular.module('trackerCapture');
trackerCapture.controller('OrgUnitsController',
    function (
        $rootScope,
        $scope,
        $translate,
        CurrentSelection,
        RegistrationService,
        OrgUnitFactory,) {

        $scope.widget = $rootScope.getCurrentWidget($scope);

        $scope.widgetTitle = $scope.widget.title;
        $scope.widgetTitleLabel = $translate.instant($scope.widgetTitle);

        OrgUnitFactory.getAllOrgUnits().then(function (orgUnit) {
            const orgs = orgUnit.organisationUnits.filter((item) => item.level === 4).map((obj) => {
                return {
                    code: obj.id,
                    id: obj.id,
                    displayName: obj.displayName
                }
            });
            $scope.attributes = [{
                id: 'organisationUnits',
                attribute: true,
                optionSet: {
                    id: 'org',
                    version: 13
                }
            }];

            $scope.attributesById = {
                'organisationUnits': {
                    optionSet: {
                        id: 'org',
                        version: 13
                    }
                }
            };
            $scope.optionSets = {
                org: {
                    displayName: 'Organisation Unit',
                    id: 'organisationUnits',
                    version: 13,
                    options: orgs
                }
            };
            $scope.orgs = orgs;
        });

        $scope.changeOrg = null;

        $scope.selectOrgUnit = (param) => {
            const org = $scope.orgs.filter((item) => item.displayName === param.organisationUnits);
            if (org.length > 0) {
                $scope.changeOrg = org[0];
            }
        }

        $scope.updateOrgUnit = () => {
            const cur = CurrentSelection.currentSelection;
            cur.tei.orgUnit = $scope.changeOrg.code;
            for (let i = 0; i < cur.tei.enrollments.length; i++) {
                cur.tei.enrollments[i].orgUnit = $scope.changeOrg.code;
                cur.tei.enrollments[i].orgUnitName = $scope.changeOrg.displayName;
            }
            console.log(cur.tei);
            RegistrationService.registerOrUpdate(cur.tei, cur.optionSets, CurrentSelection.attributesById, cur.selectedEnrollment.program)
                .then((res) => {
                    console.log("RESULT", res);
                })
                .catch((e) => { console.log("ERR SERV", e); });
        }
    });
