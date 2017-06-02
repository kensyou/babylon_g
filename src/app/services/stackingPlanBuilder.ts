import * as moment from "moment";
import * as _ from "lodash";

import { IBuilding, Building, ISpace, Space, IFloor, Floor, IUnit, Unit, PossessionStatus, SpaceStatus, ILease, Lease } from "./stackingPlanModels";
export class ModelBuilder {
    createBuildingForJp(data: any): IBuilding {
        var spaceData = <ISpace[]>[];
        var countryCode = data.BuildingCountryCode.toLowerCase();
        for (var f in data.Floors) {
            var floor = data.Floors[f];
            for (var u in floor.Units) {
                var unit = floor.Units[u];
                for (var s in unit.Spaces) {
                    var space = unit.Spaces[s];
                    var SpaceStatusId = 1;
                    var PossessionTypeId = 1;
                    if (space.SpaceStatusId != null) {
                        SpaceStatusId = space.SpaceStatusId;
                    }
                    if (space.PossessionTypeId != null) {
                        PossessionTypeId = space.PossessionTypeId;
                    }
                    var sp = this.createSpace(countryCode, floor.FloorId, unit.UnitId, space.SpaceId, space.SpaceTotalArea, floor.FloorTotalArea, floor.FloorNumber, floor.FloorSortOrder, space.SpaceSecurityCleared, space.SpaceCreationDate, space.Landlord_Flr, space.SpaceUsageID, space.SpaceUsage, space.SpaceName, space.SpaceDescription, space.SpaceOwner, space.SpaceLandlord,  space.SpaceStatus, space.SpaceDateAvailable, space.SpaceDateAvailableSG, space.SpacePossessionType, SpaceStatusId, PossessionTypeId, space.SpaceStatusId === 7 ? SpaceStatus.Unavailable : (_.includes([2, 3, 4], space.SpaceStatusId) ? SpaceStatus.ForLease : SpaceStatus.Leased), PossessionStatus.Vacant, space.SpaceMemoTypeID, space.SpaceMemoType, space.MemoByEmployeeID, space.MemoByEmployee, space.MemoDate, space.MemoDetails, space.MemoIsMultiFloor, "", space.SpaceNetEffectiveRent, space.IsVirtual);
                    var tenantName = "";
                    for (var l in space.Leases) {
                        // 前提:1spaceにつき、1leaseになる。
                        var lease = space.Leases[l];
                        tenantName = lease.TenantName;
                        this.attachLease(sp, lease.IsLeaseThirdParty, lease.LeaseId, tenantName, lease.IsLeaseAreaEstimated, lease.IsCommencementDateEstimated, lease.IsExpiryDateEstimated, lease.LeaseArea, lease.LeaseSecurityCleared, lease.CountryCode, lease.LeaseCommencementDate, lease.LeaseExpiryDate, lease.LeaseRecordCreatedDate, lease.ThirdPartyAgentOthers, lease.ThirdPartyAgentName, lease.LeaseUpdateEmployee, lease.LeaseRecordUpdatedDate, lease.LeaseContractType, lease.LeaseIndustry, lease.LeaseNegEmployee1, lease.LeaseRentReviewDate, lease.LeaseNetEffectiveRent, lease.LeaseRent, lease.LeaseRentPerType, lease.LeaseTitle, lease.Landlord, lease.LeaseType); // april1
                    }
                    spaceData.push(sp);
                }
            }
        }

        var building = new Building(spaceData, countryCode, data.Floors);
        building.buildingName = data.BuildingName;
        building.belowGround = (data.FlrsBlwGrnd >= 1 ? data.FlrsBlwGrnd * -1 : data.FlrsBlwGrnd);
        building.aboveGround = data.FlrsAbvGrnd;
        building.buildingId = data.BuildingId;
        building.propertyCode = data.Source_PK;

        return building;
    }
    private floorStructure: IFloor[];
    createBuildingForSg(data: any): IBuilding {
        var spaceData = <ISpace[]>[];
        var countryCode = data.BuildingCountryCode.toLowerCase();

        this.calculateFloorSortOrder(data.Floors);
        for (var f in data.Floors) {
            var floor = data.Floors[f];
            for (var u in floor.Units) {
                var unit = floor.Units[u];
                for (var s in unit.Spaces) {
                    var space = unit.Spaces[s];
                    var SpaceStatusId = 1;
                    var PossessionTypeId = 1;
                    if (space.SpaceStatusId != null) {
                        SpaceStatusId = space.SpaceStatusId;
                    }
                    if (space.PossessionTypeId != null) {
                        PossessionTypeId = space.PossessionTypeId;
                    }
                    var sp = this.createSpace(countryCode, floor.FloorId, unit.UnitId, space.SpaceId, space.SpaceTotalArea, floor.FloorTotalArea, floor.FloorNumber, floor.FloorSortOrder, space.SpaceSecurityCleared, space.SpaceCreationDate, space.Landlord_Flr, space.SpaceUsageID, space.SpaceUsage, space.SpaceName, space.SpaceDescription, space.SpaceOwner, space.SpaceLandlord, space.SpaceStatus, space.SpaceDateAvailable, space.SpaceDateAvailableSG, space.SpacePossessionType, SpaceStatusId, PossessionTypeId, (_.includes([2, 3, 4], space.SpaceStatusId) ? SpaceStatus.ForLease : SpaceStatus.Leased), PossessionStatus.Vacant, space.SpaceMemoTypeID, space.SpaceMemoType, space.MemoByEmployeeID, space.MemoByEmployee, space.MemoDate, space.MemoDetails, space.MemoIsMultiFloor, space.BaseDate, null, space.IsVirtual);
                    var tenantName = "";
                    for (var l in space.Leases) {
                        // 前提:1spaceにつき、1leaseになる。
                        var lease = space.Leases[l];
                        tenantName = lease.TenantName;
                        this.attachLease(sp, lease.IsLeaseThirdParty, lease.LeaseId, tenantName, lease.IsLeaseAreaEstimated, lease.IsCommencementDateEstimated, lease.IsExpiryDateEstimated, lease.LeaseArea, lease.LeaseSecurityCleared, lease.CountryCode, lease.LeaseCommencementDate, lease.LeaseExpiryDate, lease.LeaseRecordCreatedDate, lease.ThirdPartyAgentOthers, lease.ThirdPartyAgentName, lease.LeaseUpdateEmployee, lease.LeaseRecordUpdatedDate, lease.LeaseContractType, lease.LeaseIndustry, lease.LeaseNegEmployee1, lease.LeaseRentReviewDate, lease.LeaseNetEffectiveRent, lease.LeaseRent, lease.LeaseRentPerType, lease.LeaseTitle, lease.Landlord, lease.LeaseType, lease.LeaseConfidentialReleaseDate, lease.LeaseExchangeDate); // april1
                    }
                    spaceData.push(sp);
                }
            }
        }

        //this.recalculateFloorSortOrder(data.Floors, spaceData);
        var building = new Building(spaceData, countryCode, data.Floors);
        building.buildingName = data.BuildingName;
        building.belowGround = (data.FlrsBlwGrnd > 1 ? data.FlrsBlwGrnd * -1 : data.FlrsBlwGrnd);
        building.aboveGround = data.FlrsAbvGrnd;
        building.buildingId = data.BuildingId;
        building.propertyCode = data.Source_PK;
        building.sectors = data.Sectors;
        //new properties for liftzones - HKOS
        building.LiftZone1From = data.LiftZone1From;
        building.LiftZone1To = data.LiftZone1To;
        building.LiftZone2From = data.LiftZone2From;
        building.LiftZone2To = data.LiftZone2To;
        building.LiftZone3From = data.LiftZone3From;
        building.LiftZone3To = data.LiftZone3To;
        building.LiftZone4From = data.LiftZone4From;
        building.LiftZone4To = data.LiftZone4To;
        building.LiftZone5From = data.LiftZone5From;
        building.LiftZone5To = data.LiftZone5To;
        building.LiftZone6From = data.LiftZone6From;
        building.LiftZone6To = data.LiftZone6To;
        building.LiftZone7From = data.LiftZone7From;
        building.LiftZone7To = data.LiftZone7To;
        building.LiftZone8From = data.LiftZone8From;
        building.LiftZone8To = data.LiftZone8To;
        building.LiftZone9From = data.LiftZone9From;
        building.LiftZone9To = data.LiftZone9To;
        building.LiftZone10From = data.LiftZone10From;
        building.LiftZone10To = data.LiftZone10To;
        building.LiftZone11From = data.LiftZone11From;
        building.LiftZone11To = data.LiftZone11To;
        building.LiftZone12From = data.LiftZone12From;
        building.LiftZone12To = data.LiftZone12To;
        building.LiftZone13From = data.LiftZone13From;
        building.LiftZone13To = data.LiftZone13To;

        return building;
    }
    static createBuilding(data: any): IBuilding {
        var mb = new ModelBuilder();

        if (data.BuildingCountryCode.toLowerCase() !== "jp") {
            return mb.createBuildingForSg(data);
        } else {
            return mb.createBuildingForJp(data);
        }
    }
    public dict: any[];
    public dictMinus: any[];
    calculateFloorSortOrder(dbFloors: any[]) {
        var floorNumberGenerator = 0;
        var MinusfloorNumberGenerator = -1;
        var floorDataAbove = _.filter(dbFloors, (f: any) => f.FloorSortOrder >= 0 && !f.FloorNumber.match(/.+?-.+?/));
        var floorDataBelow = _.filter(dbFloors, (f: any) => f.FloorSortOrder < 0 && !f.FloorNumber.match(/.+?-.+?/));

        this.dict = _.map(_.sortBy(_.uniq(_.map(floorDataAbove, "FloorSortOrder")))
            , (k) => {
                let floor = _.find(floorDataAbove, f => f.FloorSortOrder === k);
                //if (floor.FloorNumber.split("-").length > 1) {
                //    floorNumberGenerator = floorNumberGenerator - 1;
                //}
                return <any>{ old: k, newValue: floorNumberGenerator++, floorName: "" + floor.FloorNumber };
            });
        _.forEach(floorDataAbove, (f: any) => {
            f.FloorSortOrder = _.find(this.dict, { old: f.FloorSortOrder }).newValue;
        });
        this.dictMinus = _.map(_.sortBy(_.uniq(_.map(floorDataBelow, "FloorSortOrder")), (n) => -n)
            , (k) => {
                let floor = _.find(floorDataBelow, f => f.FloorSortOrder === k);
                //if (floor.FloorNumber.split("-").length > 1) {
                //    MinusfloorNumberGenerator = MinusfloorNumberGenerator + 1;
                //}
                return <any>{ old: k, newValue: MinusfloorNumberGenerator--, floorNumber: floor.FloorNumber };
            });
        _.forEach(floorDataBelow, (f: any) => {
            f.FloorSortOrder = _.find(this.dictMinus, { old: f.FloorSortOrder }).newValue;
        });
        this.dict.concat(this.dictMinus);
    };
    //recalculateFloorSortOrder(dbFloors: any[], spaceData: ISpace[]) {
    //    var floorDataAbove = _.filter(dbFloors, (f: any) => f.FloorSortOrder >= 0 && !f.FloorNumber.match(/.+?-.+?/));
    //    var floorDataBelow = _.filter(dbFloors, (f: any) => f.FloorSortOrder < 0 && !f.FloorNumber.match(/.+?-.+?/));
    //    var spaceDataAbove = _.filter(spaceData, (r) => r.units[0].floor.floorSortOrder >= 0);
    //    var spaceDataBelow = _.filter(spaceData, (r) => r.units[0].floor.floorSortOrder < 0);

    //    var dict = _.map(_.sortBy(_.uniq(_.map(floorDataAbove, "FloorSortOrder")))
    //        , (k) => {
    //            let floor = _.find(floorDataAbove, f=> f.FloorSortOrder === k);
    //            if (floor.FloorNumber.split("-").length > 1) {
    //                floorNumberGenerator = floorNumberGenerator - 1;
    //            }
    //            return <any>{ old: k, newValue: floorNumberGenerator++ };
    //        });
    //    _.forEach(spaceDataAbove, (s) => {
    //        _.forEach(s.units, (u) => {
    //            u.floor.floorSortOrder = _.find(dict, { old: u.floor.floorSortOrder }).newValue;
    //        });
    //    });
    //    _.forEach(floorDataAbove, (f: any) => {
    //        f.FloorSortOrder = _.find(dict, { old: f.FloorSortOrder }).newValue;
    //    });
    //    var MinusfloorNumberGenerator = -1;

    //    var dictMinus = _.map(_.sortBy(_.uniq(_.map(floorDataBelow, "FloorSortOrder")), (n) => -n)
    //        , (k) => {
    //            let floor = _.find(floorDataBelow, f=> f.FloorSortOrder === k);
    //            if (floor.FloorNumber.split("-").length > 1) {
    //                MinusfloorNumberGenerator = MinusfloorNumberGenerator + 1;
    //            }
    //            return <any>{ old: k, newValue: MinusfloorNumberGenerator-- };
    //        });
    //    _.forEach(spaceDataBelow, (s) => {
    //        _.forEach(s.units, (u) => {
    //            u.floor.floorSortOrder = _.find(dictMinus, { old: u.floor.floorSortOrder }).newValue;
    //        });
    //    });
    //    _.forEach(floorDataBelow, (f: any) => {
    //        f.FloorSortOrder = _.find(dictMinus, { old: f.FloorSortOrder }).newValue;
    //    });
    //}

    createSpace(countryCode: string, floorId: number, unitId: number, spaceId: number, spaceSize: number, floorTotalArea: number,
        floorNumber: string, floorSortOrder: number, spaceSecurityCleared: boolean, spaceCreationDate: Date, floorLandload: string, spaceUsageId: number, spaceUsage: string, spaceName: string,
        spaceDescription: string, spaceOwner: string, spaceLandlord : string, spaceStatusText: string, spaceDateAvailable: string, spaceDateAvailableSG: Date,
        spacePossessionType: string, spaceStatusId: number, possessionTypeId: number, spaceStatus: SpaceStatus, possessionStatus: PossessionStatus,
        spaceMemoTypeId: number, spaceMemoType: string, memoByEmployeeId: number, memoByEmployee: string, memoDate: Date, memoDetails: string, memoIsMultiFloor: boolean, baseDate: string,
        spaceNetEffectiveRent: number, isVirtual: boolean) {
        var space: ISpace = new Space();
        space.spaceId = spaceId;

        space.grossSize = spaceSize;
        space.spaceName = spaceName;
        space.spaceDescription = spaceDescription;
        space.spaceStatus = spaceStatus;
        space.possessionStatus = possessionStatus;
        space.securityCleared = spaceSecurityCleared;
        space.creationDate = moment(spaceCreationDate).toDate();
        space.floorLandload = floorLandload;
        space.spaceUsageId = spaceUsageId;
        space.spaceUsage = spaceUsage;
        space.spaceOwner = spaceOwner;
        space.SpaceLandlord  = spaceLandlord;
        space.spaceStatusText = spaceStatusText;
        space.spaceDateAvailable = spaceDateAvailable;
        space.spaceDateAvailableSG = moment(spaceDateAvailableSG).toDate();
        space.spacePossessionTypeText = spacePossessionType;
        space.spaceStatusId = spaceStatusId;
        space.possessionTypeId = possessionTypeId;
        space.units = [];
        space.leases = [];
        if (floorNumber.split("-").length === 1) {
            this.attachSingleFloorSpaceWithoutUnitDetail(space, countryCode, floorId, unitId, floorTotalArea, floorNumber, floorSortOrder);
        } else {
            this.attachMultiFloorSpaceWithoutUnitDetail(space, countryCode, floorTotalArea, floorNumber, floorSortOrder, (countryCode.toLowerCase() !== "jp"));
        }
        space.spaceMemoTypeId = spaceMemoTypeId;
        space.spaceMemoType = spaceMemoType;
        space.memoByEmployeeId = memoByEmployeeId;
        space.memoByEmployee = memoByEmployee;
        space.memoDate = (memoDate) ? moment(memoDate) : null;
        space.memoDetails = memoDetails;
        space.memoIsMultiFloor = memoIsMultiFloor;
        space.baseDate = baseDate;
        space.spaceNetEffectiveRent = spaceNetEffectiveRent;
        space.isVirtual = isVirtual;
        return space;
    }
    attachSingleFloorSpaceWithoutUnitDetail(space: ISpace, countryCode: string, floorId: number, unitId: number,
        floorTotalArea: number, floorNumber: any, floorSortOrder: number
    ): ISpace {
        var unit: IUnit = new Unit();
        unit.unitId = unitId;
        unit.floor = new Floor();
        unit.floor.floorId = floorId;
        if (countryCode.toLowerCase() !== "jp") {
            unit.floor.floorNumber = null;
            unit.floor.floorSortOrder = floorSortOrder;
            unit.floor.floorName = floorNumber;
        } else { // JP
            unit.floor.floorId = floorId;
            unit.floor.floorNumber = (floorSortOrder < 0 ? Math.ceil(floorSortOrder) : Math.floor(floorSortOrder));
            unit.floor.floorSortOrder = floorSortOrder;
            if (String(floorNumber).indexOf("M") > -1) {
                unit.floor.floorName = floorNumber;
                if (String(floorNumber).indexOf("B") > -1) {
                    var number = Number(String(floorNumber).replace("MB", ""))
                    if (number === 0) {
                        unit.floor.floorNumber = -0.5;
                    } else {
                        unit.floor.floorNumber = (number * -1) + 0.5;
                    }
                } else {
                    var number = Number(String(floorNumber).replace("M", ""))
                    if (number === 0) {
                        unit.floor.floorNumber = -0.5;
                    } else {
                        unit.floor.floorNumber = number - 0.5;
                    }
                }
            } else {
                unit.floor.floorName = (floorSortOrder < 0 ? "B" : "") + (floorSortOrder < 0 ? Math.abs(Math.ceil(floorSortOrder)) : Math.abs(Math.floor(floorSortOrder))); //floorNumber;//Math.abs(Math.floor(floorSortOrder));
            }
        }
        unit.floor.floorSize = floorTotalArea;
        space.units.push(unit);

        return space;
    }

    attachMultiFloorSpaceWithoutUnitDetail(space: ISpace, countryCode: string, floorTotalArea: number, floorNumber: string,
        floorSortOrder: number, hasGroundFloor: boolean = false): ISpace {
        var numFrom: number, numTo: number, floorFrom: any, floorTo: any;
        space.units = [];
        space.leases = [];
        var floorNumberSplit = floorNumber.split("-");

        if (this.dict) {
            floorFrom = floorNumberSplit[0].toString().trim();
            floorTo = floorNumberSplit[floorNumberSplit.length - 1].toString().trim();

            var newFlrFrom = _.find(this.dict, f => f.floorName == floorFrom)
            if (newFlrFrom != undefined)
                floorFrom = newFlrFrom.newValue;
            var newFlrTo = _.find(this.dict, f => f.floorName == floorTo);
            if (newFlrTo != undefined)
                floorTo = newFlrTo.newValue;

           for (var j = 1 * floorFrom; j <= floorTo; j++) {
                if (!hasGroundFloor && j === 0) continue;

                var unit: IUnit = new Unit();
                unit.unitId = Math.random() * 65535;
                unit.floor = new Floor();
                unit.floor.floorId = Math.random() * 65535;
                unit.floor.floorNumber = j;
                unit.floor.floorSize = floorTotalArea;
                unit.floor.floorSortOrder = j;
                var flrName = _.find(this.dict, f => f.newValue == j);
                if (flrName != undefined)
                    unit.floor.floorName = flrName.floorName;

                space.units.push(unit);
            }
        } else {
            var middleFrom = false;
            var middleTo = false;
            if (floorNumberSplit.length >= 1) {
                var p0 = floorNumberSplit[0];
                var p1 = floorNumberSplit[floorNumberSplit.length - 1];
                if (isNaN(<any>p0)) {
                    if (p0 === "G") {
                        numFrom = 0;
                    } else if (p0.indexOf("MB") > -1) {
                        numFrom = Number(p0.replace("MB", "")) * -1;
                        middleFrom = true;
                    } else if (p0.indexOf("B") > -1) {
                        numFrom = Number(p0.replace("B", "")) * -1;
                    } else if (p0.indexOf("M") > -1) {
                        numFrom = Number(p0.replace("M", ""));
                        middleFrom = true;
                    } else {
                        numFrom = <any>p0;
                    }
                } else {
                    numFrom = Number(floorNumber.split("-")[0]);
                }

                if (isNaN(<any>p1)) {
                    if (p1 === "G") {
                        numTo = 0;
                    } else if (p1.indexOf("MB") > -1) {
                        numTo = Number(p1.replace("MB", "")) * -1;
                        middleTo = true;
                    } else if (p1.indexOf("B") > -1) {
                        numTo = Number(p1.replace("B", "")) * -1;
                    } else if (p1.indexOf("M") > -1) {
                        numTo = Number(p1.replace("M", ""));
                        middleTo = true;
                    } else {
                        numTo = <any>p1;
                    }
                } else {
                    numTo = Number(floorNumber.split("-")[1]);
                }

                if (numFrom > numTo) {
                    floorFrom = numTo;
                    floorTo = numFrom;
                } else {
                    floorFrom = numFrom;
                    floorTo = numTo;
                }
            }
            // set middle floor
            if (middleFrom || middleTo) {
                for (var j = 1 * floorFrom; j <= floorTo; j++) {
                    if (!middleFrom && middleTo && j === 1 * floorFrom && floorTo > 0) continue;
                    if (!middleTo && j === floorTo && floorTo < 0) continue;
                    if (!hasGroundFloor && j === 0) continue;
                    var unit: IUnit = new Unit();
                    unit.unitId = Math.random() * 65535;
                    unit.floor = new Floor();
                    unit.floor.floorId = Math.random() * 65535;
                    unit.floor.floorNumber = j + (j < 0 ? 0.5 : -0.5);
                    unit.floor.floorSize = floorTotalArea;
                    unit.floor.floorSortOrder = j + (j < 0 ? 0.5 : -0.5);
                    unit.floor.floorName = "M" + (j < 0 ? "B" : "") + Math.abs(j);

                    space.units.push(unit);
                }
            }
            // set floor
            for (var j = 1 * floorFrom; j <= floorTo; j++) {
                if (middleFrom && j === 1 * floorFrom && floorFrom < 0) continue;
                if (middleTo && j === floorTo && floorTo > 0) continue;
                if (!hasGroundFloor && j === 0) continue;
                var unit: IUnit = new Unit();
                unit.unitId = Math.random() * 65535;
                unit.floor = new Floor();
                unit.floor.floorId = Math.random() * 65535;
                unit.floor.floorNumber = j;
                unit.floor.floorSize = floorTotalArea;
                unit.floor.floorSortOrder = j;
                unit.floor.floorName = j === 0 ? "G" : (j < 0 ? "B" : "") + Math.abs(j);

                space.units.push(unit);
            }
        }
        return space;
    }
    attachLease(space: ISpace, isLeaseThirdParty: boolean, leaseId: number, tenantName: string, isLeaseAreaEstimated: boolean, isCommencementDateEstimated: boolean, isExpiryDateEstimated: boolean
        , leaseArea: number, leaseSecurityCleared: boolean, countryCode: string, commencementDate?: Date, expiryDate?: Date, creationDate?: Date, trdPAgentOthers?: string, trdPAgentName?: string, leaseUpdateEmployee?: string, leaseUpdatedDate?: Date, leaseContractType?: string, leaseIndustry?: string, leaseNegEmployee1?: string, leaseRentReviewDate?: Date, leaseNetEffectiveRent?: number, leaseRent?: number, leaseRentPerType?: string, leaseTitle?: string, leaseLandlord?: string, leaseType?: string
        , leaseConfidentialReleaseDate?: Date, leaseExchangeDate?: Date, leaseAccountName?: string) {
        var lease: ILease = new Lease();
        lease.isLeaseAreaEstimated = isLeaseAreaEstimated;
        lease.isCommencementDateEstimated = isCommencementDateEstimated;
        lease.isExpiryDateEstimated = isExpiryDateEstimated;
        lease.IsLeaseThirdParty = isLeaseThirdParty;
        lease.leaseId = leaseId;
        lease.LeaseTitle = leaseTitle;
        lease.tenantName = tenantName;
        lease.commencementDate = commencementDate ? moment(commencementDate).toDate() : null;
        lease.exchangeDate = leaseExchangeDate ? moment(leaseExchangeDate).toDate() : null;
        lease.confidentialReleaseDate = leaseConfidentialReleaseDate ? moment(leaseConfidentialReleaseDate).toDate() : null;
        lease.accountName = leaseAccountName;
        lease.creationDate = moment(creationDate).toDate();
        lease.ThirdPartyAgentOthers = trdPAgentOthers;
        lease.ThirdPartyAgentName = trdPAgentName;
        lease.LeaseUpdateEmployee = leaseUpdateEmployee;
        lease.securityCleared = leaseSecurityCleared;
        lease.expiryDate = expiryDate ? moment(expiryDate).toDate() : null;
        lease.LeaseContractType = leaseContractType;
        lease.LeaseIndustry = leaseIndustry;
        lease.LeaseNegEmployee1 = leaseNegEmployee1;

        lease.LeaseRentReviewDate = leaseRentReviewDate ? moment(leaseRentReviewDate).toDate() : null;
        lease.LeaseNetEffectiveRent = leaseNetEffectiveRent;
        lease.LeaseRent = leaseRent;
        lease.LeaseRentPerType = leaseRentPerType;

        lease.Landlord = leaseLandlord;
        //            lease.Landlord_Flr = leaseLandlord_flr;
        lease.updatedDate = leaseUpdatedDate ? moment(leaseUpdatedDate).toDate() : null;
        lease.LeaseArea = leaseArea;
        lease.CountryCode = countryCode;
        lease.LeaseType = leaseType;
        space.leases.push(lease);
    }

    static randomColor(): string {
        var r = Math.round((Math.random() * 255));
        var g = Math.round((Math.random() * 255));
        var b = Math.round((Math.random() * 255));
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }

    static isNull(val: string, replaceVal: string): string {
        var retVal: string = "";
        retVal = (val != null) ? val : replaceVal
        return retVal;
    }
}
