import * as moment from "moment";
import * as _ from "lodash";

export enum SpaceStatus { Leased, ForLease, Unavailable }
export enum PossessionStatus { Vacant, TenantOccupied }

export interface IBuilding {
    countryCode: string;
    buildingId: number;
    sectors: number[];
    buildingName: string;
    spaces: ISpace[];
    floors: IFloor[];
    units: IUnit[];
    minFloor: number;
    maxFloor: number;
    belowGround: number;
    aboveGround: number;
    maxSizeAmongAllFloor: number;
    sizeOfTopMostAvailableFloor: number;
    normalize_jp(): void;
    propertyCode: string;
    //new properties for liftzones - HKOS
    LiftZone1From: number;
    LiftZone1To: number;
    LiftZone2From: number;
    LiftZone2To: number;
    LiftZone3From: number;
    LiftZone3To: number;
    LiftZone4From: number;
    LiftZone4To: number;
    LiftZone5From: number;
    LiftZone5To: number;
    LiftZone6From: number;
    LiftZone6To: number;
    LiftZone7From: number;
    LiftZone7To: number;
    LiftZone8From: number;
    LiftZone8To: number;
    LiftZone9From: number;
    LiftZone9To: number;
    LiftZone10From: number;
    LiftZone10To: number;
    LiftZone11From: number;
    LiftZone11To: number;
    LiftZone12From: number;
    LiftZone12To: number;
    LiftZone13From: number;
    LiftZone13To: number;
}
export interface IFloor {
    floorId: number;
    floorNumber: number;
    floorSortOrder: number;
    floorName: string;
    floorSize: number;
    floorSizeAllocated: number;
    floorTotalArea: number;
    estimatedFloorSize: number;
    units: IUnit[];
}
export interface IUnit {
    unitId: number;
    floor: IFloor;
    unitSize: number;
    estimatedUnitSize: number;
    spaces: ISpace[];
    isProcessed: boolean;
}
export interface ISpace {
    spaceId: number;
    grossSize: number;
    spaceName: string;
    spaceDescription: string;
    spaceStatus: SpaceStatus;
    possessionStatus: PossessionStatus;
    estimatedStartDate: Date;
    estimatedExpiryDate: Date;
    creationDate: Date;
    securityCleared: boolean;
    floorLandload: string;
    spaceUsageId: number;
    spaceUsage: string;
    spaceOwner: string;
    SpaceLandlord: string;
    spaceStatusText: string;
    spaceDateAvailable: string;
    spaceDateAvailableSG: Date;
    spaceNetEffectiveRent: number;
    baseDate: string;
    spacePossessionTypeText: string;
    spaceStatusId: number;
    possessionTypeId: number;
    units: IUnit[];
    leases: ILease[];

    spaceMemoTypeId: number;
    spaceMemoType: string;
    memoByEmployeeId: number;
    memoByEmployee: string;
    memoDate: moment.Moment;
    memoDetails: string;
    memoIsMultiFloor: boolean;
    isVirtual: boolean;
}
export interface ILease {
    tenantName: string;
    commencementDate: Date;
    exchangeDate: Date;
    confidentialReleaseDate: Date;
    accountName: string;
    expiryDate: Date;
    creationDate: Date;
    updatedDate: Date;
    leaseId: number;
    securityCleared: boolean;
    isLeaseAreaEstimated: boolean;
    isCommencementDateEstimated: boolean;
    isExpiryDateEstimated: boolean;

    LeaseNumber: string;
    LeaseTitle: string;
    LeaseDepartmentTeamId: number;
    IsLeaseThirdParty: boolean
    ThirdPartyAgentId: number;
    ThirdPartyAgentName: string;
    ThirdPartyAgentOthers: string;
    LeaseArea: number;
    LeaseArea_SqM: number;
    LeaseArea_SqF: number;
    LeaseUpdateEmployeeId: number;
    LeaseUpdateEmployee: string;
    LeaseNegEmployee1Id: number;
    LeaseNegEmployee1: string

    LeaseContractTypeId: string
    LeaseContractType: string;
    LeaseIndustryId: string;
    LeaseIndustry: string;

    LeaseRentReviewDate: Date;
    LeaseNetEffectiveRent: number;
    LeaseRent: number;
    LeaseRentPerTypeId: string;
    LeaseRentPerType: string;
    Landlord: string;

    CountryCode: string;
    LeaseType: string;

    space: ISpace;
}
export class Building implements IBuilding {
    countryCode: string;
    buildingId: number;
    sectors: number[] = [];
    buildingName: string;
    spaces: ISpace[] = [];
    floors: IFloor[] = [];
    units: IUnit[] = [];
    minFloor: number;
    maxFloor: number;
    propertyCode: string;
    //new properties for liftzones - HKOS
    LiftZone1From: number;
    LiftZone1To: number;
    LiftZone2From: number;
    LiftZone2To: number;
    LiftZone3From: number;
    LiftZone3To: number;
    LiftZone4From: number;
    LiftZone4To: number;
    LiftZone5From: number;
    LiftZone5To: number;
    LiftZone6From: number;
    LiftZone6To: number;
    LiftZone7From: number;
    LiftZone7To: number;
    LiftZone8From: number;
    LiftZone8To: number;
    LiftZone9From: number;
    LiftZone9To: number;
    LiftZone10From: number;
    LiftZone10To: number;
    LiftZone11From: number;
    LiftZone11To: number;
    LiftZone12From: number;
    LiftZone12To: number;
    LiftZone13From: number;
    LiftZone13To: number;
    private _belowGround: number;
    get belowGround(): number {
        return this._belowGround;
    }
    set belowGround(bg: number) {
        this._belowGround = bg;
        this.floorCalculate();
    }
    private _aboveGround: number;
    get aboveGround(): number {
        return this._aboveGround;
    }
    set aboveGround(ag: number) {
        this._aboveGround = ag;
        if (this.countryCode !== "jp") {
            this.floorCalculate();
        } else {
            this.floorCalculatefinalJp();
        }
    }
    maxSizeAmongAllFloor: number;
    sizeOfTopMostAvailableFloor: number;

    constructor(spaces: ISpace[], countryCode: string, dbFloors: any[]) {
        this.spaces = spaces;
        this.countryCode = countryCode.toLowerCase();
        if (this.countryCode !== "jp") {
            this.normalize_sg();
            this.addFloors(dbFloors);
        } else {
            this.normalize_jp();
        };
    }
    addFloors = (dbFloors: any) => {
        if (this.countryCode !== "jp") {
            _.each(dbFloors, (dbFloor: any) => {
                if (!_.find(this.floors, f => f.floorSortOrder === dbFloor.FloorSortOrder)) {
                    if (!dbFloor.FloorNumber.match(/.+?-.+?/)) {
                        this.floors.push(new Floor(dbFloor.FloorSortOrder, dbFloor.FloorNumber, "sg", dbFloor.FloorTotalArea));
                    }
                }
            });
            if (!this.maxSizeAmongAllFloor) {
                this.maxSizeAmongAllFloor = _.maxBy(this.floors, "floorTotalArea").floorTotalArea;
            }
        }
    }
    floorCalculate() {
        let getFloorSortOrder = (x) => (!x) ? 0 : x.floorSortOrder;
        if (this.countryCode !== "jp") {
            this.minFloor = getFloorSortOrder(_.minBy(this.floors, f => f.floorSortOrder));
            this.maxFloor = getFloorSortOrder(_.maxBy(this.floors, f => f.floorSortOrder));
            this.floors = _.sortBy(this.floors, f => -f.floorSortOrder);
        } else {
            var minfloorFromFloor = _.minBy(this.floors, (f: IFloor) => f.floorNumber).floorNumber;
            this.minFloor = _.minBy([this.belowGround, minfloorFromFloor, 0]);
            var maxfloorFromFloor = _.maxBy(this.floors, (f: IFloor) => f.floorNumber).floorNumber;
            this.maxFloor = _.maxBy([this.aboveGround, maxfloorFromFloor]);
            // interpolate non-existing floors
            this.floors = _.sortBy(this.floors, f => -f.floorNumber);
        }
    }
    floorCalculatefinalJp() {
        var minfloorFromFloor = _.minBy(this.floors, (f: IFloor) => f.floorNumber).floorNumber;
        this.minFloor = _.minBy([this.belowGround, minfloorFromFloor, 0]);
        this.minFloor = Math.ceil(this.minFloor)
        var maxfloorFromFloor = _.maxBy(this.floors, (f: IFloor) => f.floorNumber).floorNumber;
        this.maxFloor = _.maxBy([this.aboveGround, maxfloorFromFloor]);
        this.maxFloor = Math.floor(this.maxFloor)
        // search middle floors
        var belowGround = 0;
        var aboveGround = 0;
        for (var j = 0; j < this.floors.length; j++) {
            if (this.floors[j].floorName.indexOf("M") > -1 && this.floors[j].floorNumber <= 0) { belowGround++; }
            if (this.floors[j].floorName.indexOf("M") > -1 && this.floors[j].floorNumber > 0) { aboveGround++; }
        }
        // interpolate non-existing floors
        for (var j = this.maxFloor; j >= this.minFloor; j--) {
            _.find(this.floors, f => f.floorNumber === j) || this.floors.push(new Floor(j));
        }
        this.floors = _.sortBy(this.floors, f => -f.floorNumber);
        // reset floorNumber
        this.maxFloor += aboveGround;
        this.minFloor -= belowGround;
        var belowGroundCnt = 0;
        for (var j = 0; j < this.floors.length; j++) {
            var f = this.floors[j];
            if (f.floorNumber == 0) continue;
            if (f.floorNumber > 0) {
                if (f.floorName.indexOf("M") === -1) {
                    f.floorNumber += aboveGround;
                } else {
                    aboveGround--;
                    f.floorNumber += 0.5 + aboveGround;
                }
            } else {
                if (f.floorName.indexOf("M") > -1) {
                    belowGroundCnt++;
                    f.floorNumber = f.floorNumber + 0.5 - belowGroundCnt;
                } else {
                    f.floorNumber -= belowGroundCnt;
                }
            }
            f.floorSortOrder = f.floorNumber;
        }
        this.floors = _.sortBy(this.floors, f => -f.floorNumber);
    }

    normalize_sg() {
        this.floors = [];
        this.units = [];

        _.forEach(this.spaces, s => {
            s.leases = _.sortBy(s.leases, l => -l.commencementDate);
            var currentS = _.find(this.spaces, ts => ts.spaceId === s.spaceId);
            if (!currentS) {
                this.spaces.push(s);
                currentS = s;
            }

            var unallocatedGrossSize = s.grossSize;
            var unallocatedUnitNumber = s.units.length;
            _.forEach(
                _.sortBy(currentS.units, (ua => -ua.unitSize || 0))
                , (u, i) => {
                    var currentU = _.find(this.units, tu => tu.unitId === u.unitId);
                    if (!currentU) {
                        this.units.push(u);
                        currentU = u;
                        currentU.isProcessed = true;
                        currentU.estimatedUnitSize = 0;
                    } else {
                        if (currentU !== u)
                            currentS.units.push(currentU);
                    }
                    if (currentU.unitSize && currentU.unitSize > 0) {
                        currentU.estimatedUnitSize = currentU.unitSize;
                        unallocatedGrossSize = unallocatedGrossSize - currentU.unitSize;
                    } else {
                        var toAllocate = unallocatedGrossSize / unallocatedUnitNumber;
                        currentU.estimatedUnitSize += toAllocate;
                        unallocatedGrossSize = unallocatedGrossSize - toAllocate;

                    }
                    unallocatedUnitNumber = unallocatedUnitNumber - 1;
                    // if not yet in the unit's space collection add it
                    _.find(currentU.spaces, cs => cs.spaceId === currentS.spaceId) || currentU.spaces.push(currentS);

                    var currentF = _.find(this.floors, tf => tf.floorSortOrder === currentU.floor.floorSortOrder);
                    if (!currentF) {
                        this.floors.push(currentU.floor);
                        currentF = currentU.floor;
                        currentF.estimatedFloorSize = 0; 
                    } else {
                        if (currentF !== currentU.floor) {
                            currentU.floor = currentF; 
                        }
                    }
                    // if not yet in the unit's space collection add it
                    if (!_.find(currentF.units, cu => cu.unitId === currentU.unitId)) {
                        currentF.estimatedFloorSize += currentU.unitSize || currentU.estimatedUnitSize;
                        currentF.units.push(currentU);
                    }

                }, this);
            var unitsHandled = _.filter(currentS.units, (u: IUnit) => u.isProcessed);
            currentS.units = unitsHandled;
        }, this);

        this.spaces = _.sortBy(this.spaces, space => _.minBy(space.units, x => x.floor.floorNumber));
        this.maxSizeAmongAllFloor = _.max(this.floors.map(x => x.floorSize && x.floorSize !== 999999 ? x.floorSize : x.estimatedFloorSize));
        var topFloorAvailabe = _.sortBy(this.floors, (f: IFloor) => (f.estimatedFloorSize > 0 ? 1 : 0) * -f.floorNumber)[0];

        if (topFloorAvailabe != undefined) {
            this.sizeOfTopMostAvailableFloor = topFloorAvailabe.floorSize || topFloorAvailabe.estimatedFloorSize || 0;
        } else {
            this.sizeOfTopMostAvailableFloor = 0;
        }

        this.floorCalculate();

        // link up lease with its space

        // handles those with leases
        _.forEach(_.filter(this.spaces, space => space.leases), (s, si) => {
            // sort by future-to-past
            var sortedLease = _.sortBy(s.leases, l => -Date.parse((l.commencementDate || l.creationDate || new Date(2000, 0, 1)).toString())); // the last fallback just for test purpose, all record should have creationdate
            s.leases = sortedLease;
            _.forEach(s.leases, lease => lease.space = s);
        });
        // determine s.estimatedStartDate and s.estimatedExpiryDate
        // set a default one first
        _.forEach(this.spaces, (s, si) => {
            if (s.leases && s.leases.length > 0) {
                if (s.leases.length == 1) {
                    s.estimatedStartDate = s.leases[0].commencementDate || (s.leases[0].IsLeaseThirdParty ? s.creationDate : s.leases[0].creationDate) || new Date(1900, 0, 31);
                    s.estimatedExpiryDate = s.leases[0].expiryDate || new Date(2060, 11, 31);
                }
                else {
                    var baseDate = moment(new Date(s.baseDate)).toDate();
                    var spacename = s.spaceName;
                    var floorName = s.units[0].floor.floorName;
                    var lease = _.filter(s.leases, l => (l.commencementDate ? l.commencementDate < baseDate : new Date(1900, 0, 31) < baseDate) && (l.expiryDate ? l.expiryDate > baseDate : new Date(2060, 0, 31) > baseDate))
                    if (lease.length > 0) {
                        _.each(lease, (item) => {
                            s.estimatedStartDate = item.commencementDate || (item.IsLeaseThirdParty ? s.creationDate : item.creationDate) || new Date(1900, 0, 31);
                            s.estimatedExpiryDate = item.expiryDate || new Date(2060, 11, 31);
                        });
                    } else {
                        s.estimatedStartDate = s.leases[0].commencementDate || (s.leases[0].IsLeaseThirdParty ? s.creationDate : s.leases[0].creationDate) || new Date(1900, 0, 31);
                        s.estimatedExpiryDate = s.leases[0].expiryDate || new Date(2060, 11, 31);
                    }
                }
            } else {
                s.estimatedStartDate = s.creationDate || new Date(1900, 0, 31);
                s.estimatedExpiryDate = new Date(2060, 11, 31); // assume a very long date.
            }
        });
        var lastStartDate: Date = undefined;
        // set s.estimatedStartDate and s.estimatedExpiryDate for those needed ()
        _.forEach(_.filter(this.units, unit => unit.spaces.length > 1
            && unit.unitSize
        ), (u, ui) => {
            var spacesInSameUnit = _.sortBy(u.spaces, x => {
                if (!x.leases || x.leases.length === 0) return 1;
                var topLease = x.leases[0];
                return -(topLease.commencementDate || topLease.creationDate);
            });
            _.forEach(spacesInSameUnit, k => {
                k.estimatedExpiryDate = new Date((lastStartDate || k.estimatedExpiryDate).getTime());
                lastStartDate = new Date(k.estimatedStartDate.getTime());
                lastStartDate.setMilliseconds(-1);
            });

            //console.log(spacesInSameUnit);
        });
        _.forEach(_.filter(this.units, unit => unit.spaces.length > 1
            && unit.unitSize
            && (_.reduce(unit.spaces, (sum: number, n) => sum + n.grossSize, 0) > unit.unitSize)), (u, ui) => {
                var spacesInSameUnit = _.sortBy(u.spaces, x => {
                    if (!x.leases || x.leases.length === 0) return 1;
                    var topLease = x.leases[0];
                    return -(topLease.commencementDate || topLease.creationDate);
                });
            });

        //console.log("=======>", this.spaces);
    }
    normalize_jp() {
        this.floors = [];
        this.units = [];
        // reset estimation
        _.forEach(this.floors, f => f.estimatedFloorSize = 0);
        _.forEach(this.units, u => u.estimatedUnitSize = 0);
        _.forEach(this.spaces, s => {
            s.leases = _.sortBy(s.leases, l => -l.commencementDate);
            var currentS = _.find(this.spaces, ts => ts.spaceId === s.spaceId);
            if (!currentS) {
                this.spaces.push(s);
                currentS = s;
            }

            var unallocatedGrossSize = (s.leases && s.leases[0])? s.leases[0].LeaseArea : s.grossSize;
            var unallocatedUnitNumber = s.units.length;
            _.forEach(
                _.sortBy(currentS.units, (ua => -ua.unitSize || 0))
                , (u, i) => {
                    var currentU = _.find(this.units, tu => tu.unitId === u.unitId);
                    if (!currentU) {
                        this.units.push(u);
                        currentU = u;
                        currentU.isProcessed = true;
                        currentU.estimatedUnitSize = 0;
                    } else {
                        if (currentU !== u)
                            currentS.units.push(currentU);
                    }
                    if (currentU.unitSize && currentU.unitSize > 0) {
                        currentU.estimatedUnitSize = currentU.unitSize;
                        unallocatedGrossSize = unallocatedGrossSize - currentU.unitSize;
                    } else {
                        var toAllocate = unallocatedGrossSize / unallocatedUnitNumber;
                        currentU.estimatedUnitSize += toAllocate;
                        unallocatedGrossSize = unallocatedGrossSize - toAllocate;

                    }
                    unallocatedUnitNumber = unallocatedUnitNumber - 1;
                    // if not yet in the unit's space collection add it
                    _.find(currentU.spaces, cs => cs.spaceId === currentS.spaceId) || currentU.spaces.push(currentS);

                    var currentF = _.find(this.floors, tf => tf.floorId === currentU.floor.floorId);
                    if (!currentF) {
                        this.floors.push(currentU.floor);
                        currentF = currentU.floor;
                        currentF.estimatedFloorSize = 0;
                    } else {
                        if (currentF !== currentU.floor) {
                            currentU.floor = currentF;
                        }
                    }
                    // if not yet in the unit's space collection add it
                    if (!_.find(currentF.units, cu => cu.unitId === currentU.unitId)) {
                        currentF.estimatedFloorSize += currentU.unitSize || currentU.estimatedUnitSize;
                        currentF.units.push(currentU);
                    }

                }, this);
            var unitsHandled = _.filter(currentS.units, (u: IUnit) => u.isProcessed);
            currentS.units = unitsHandled;
        }, this);
        this.spaces = _.sortBy(this.spaces, space => _.minBy(space.units, x => x.floor.floorNumber));
        this.maxSizeAmongAllFloor = _.max(_.map(_.values(_.groupBy(this.floors, "floorNumber")), k => _.sumBy(k, (x: any) => x.floorSize && x.floorSize !== 999999 ? x.floorSize : x.estimatedFloorSize)));
        var topFloorAvailabe = _.sortBy(this.floors, (f: IFloor) => (f.estimatedFloorSize > 0 ? 1 : 0) * -f.floorNumber)[0];

        if (topFloorAvailabe != undefined) {
            this.sizeOfTopMostAvailableFloor = topFloorAvailabe.floorSize || topFloorAvailabe.estimatedFloorSize || 0;
        } else {
            this.sizeOfTopMostAvailableFloor = 0;
        }

        this.floorCalculate();



        // process estimated expiry date for spaces
        /* All leased process with (start date || create date) sorted desc
        1st stage
        Perfect CBRE deal
        2015/1 - 2015/12 (create 2015/2) | 2015/1
        2014/1 - 2014/12 (create 2014/2) | 2014/1
        2013/1 - 2013/12 (create 2013/2) | 2013/1
        (Start-end all available)
     
        All 3rd deal
        ? - ? (create 2015/2) | 2015/2
        ? - ? (create 2014/2) | 2014/2
        ? - ? (create 2013/2) | 2013/2
        (take the current (if not, last modified)  as the valid,
     
        Last 3rd deal
        ? - ? (Mod 2015/2) *
        2014/1 - 2014/12 (Mod 2014/2)
        ? - ? (Mod 2013/2)
        (No assertion date, the the current but overriden
     
        Last 3rd deal
        2015/1 - 2015/12 (Mod 2015/2) *
        ? - ? (Mod 2014/2)
        ? - ? (Mod 2013/2)
        Expiry 2015/12
     
        Last mod 3rd deal but known deal not expiry
        ? - ? (Mod 2015/2) *
        2015/1 - 2015/12 (Mod 2014/2)
        ? - ? (Mod 2013/2)
        No expiry
        ===========================
        2nd stage for those no expiry (taking the same unit's starting)
        */

        // link up lease with its space

        // handles those with leases
        _.forEach(_.filter(this.spaces, space => space.leases), (s, si) => {
            // sort by future-to-past
            var sortedLease = _.sortBy(s.leases, l => -Date.parse((l.commencementDate || l.creationDate || new Date(2000, 0, 1)).toString())); // the last fallback just for test purpose, all record should have creationdate
            s.leases = sortedLease;
            _.forEach(s.leases, lease => lease.space = s);
        });
        // determine s.estimatedStartDate and s.estimatedExpiryDate
        // set a default one first
        _.forEach(this.spaces, (s, si) => {
            if (s.leases && s.leases.length > 0) {
                s.estimatedStartDate = s.leases[0].commencementDate || s.leases[0].creationDate || new Date(1900, 0, 31);
                s.estimatedExpiryDate = s.leases[0].expiryDate || new Date(2060, 11, 31);
            } else {
                s.estimatedStartDate = s.creationDate || new Date(1900, 0, 31);
                s.estimatedExpiryDate = new Date(2060, 11, 31); // assume a very long date.
            }
        });
        var lastStartDate: Date = undefined;
        // set s.estimatedStartDate and s.estimatedExpiryDate for those needed ()
        _.forEach(_.filter(this.units, unit => unit.spaces.length > 1
            && unit.unitSize
        ), (u, ui) => {
            var spacesInSameUnit = _.sortBy(u.spaces, x => {
                if (!x.leases || x.leases.length === 0) return 1;
                var topLease = x.leases[0];
                return -(topLease.commencementDate || topLease.creationDate);
            });
            _.forEach(spacesInSameUnit, k => {
                k.estimatedExpiryDate = new Date((lastStartDate || k.estimatedExpiryDate).getTime());
                lastStartDate = new Date(k.estimatedStartDate.getTime());
                lastStartDate.setMilliseconds(-1);
            });

            //console.log(spacesInSameUnit);
        });
        _.forEach(_.filter(this.units, unit => unit.spaces.length > 1
            && unit.unitSize
            && (_.reduce(unit.spaces, (sum: number, n) => sum + n.grossSize, 0) > unit.unitSize)), (u, ui) => {
                var spacesInSameUnit = _.sortBy(u.spaces, x => {
                    if (!x.leases || x.leases.length === 0) return 1;
                    var topLease = x.leases[0];
                    return -(topLease.commencementDate || topLease.creationDate);
                });
            });

        //console.log("=======>", this.spaces);
    }
}
export class Space implements ISpace {
    spaceId: number;
    grossSize: number;
    spaceName: string;
    spaceDescription: string;
    spaceStatus: SpaceStatus;
    possessionStatus: PossessionStatus;
    estimatedStartDate: Date;
    estimatedExpiryDate: Date;
    creationDate: Date;
    securityCleared: boolean;
    floorLandload: string;
    spaceUsageId: number;
    spaceUsage: string;
    spaceOwner: string;
    SpaceLandlord: string;
    spaceStatusText: string;
    spaceDateAvailable: string;
    spaceDateAvailableSG: Date;
    spaceNetEffectiveRent: number;
    baseDate: string;
    spacePossessionTypeText: string;
    spaceStatusId: number;
    possessionTypeId: number;
    units: IUnit[] = [];
    leases: ILease[] = [];

    spaceMemoTypeId: number;
    spaceMemoType: string;
    memoByEmployeeId: number;
    memoByEmployee: string;
    memoDate: moment.Moment;
    memoDetails: string;
    memoIsMultiFloor: boolean;
    isVirtual: boolean;
}
export class Unit implements IUnit {
    unitId: number;
    floor: IFloor;
    unitSize: number;
    estimatedUnitSize: number;
    spaces: ISpace[] = [];
    isProcessed: boolean;
}
export class Floor implements IFloor {
    floorId: number;
    floorNumber: number;
    floorSortOrder: number;
    floorName: string;
    floorSize: number;
    floorSizeAllocated: number=0;
    floorTotalArea: number;
    estimatedFloorSize: number;
    units: IUnit[] = [];
    constructor();
    constructor(floorNumber: number);
    constructor(floorNumber: number, floorName: string);
    constructor(floorNumber: number, floorName: string, country: string);
    constructor(floorNumber?: number, floorName?: string, country?: string);
    constructor(floorNumber?: number, floorName?: string, country?: string, floorTotalArea?: number);
    constructor(floorNumber?: number, floorName?: string, country?: string, floorTotalArea?: number) {
        this.floorId = Math.random() * 65535 * 65535;
        if (country && floorName && country === "sg") {
            this.floorNumber = floorNumber || 0;
            this.floorName = floorName;
            this.floorSortOrder = floorNumber;
            this.floorTotalArea = floorTotalArea;
        } else {
            this.floorNumber = floorNumber || 0;
            if (String(floorNumber).indexOf("M") > -1) {
                this.floorName = floorName;
            } else {
                this.floorName = (floorNumber < 0 ? "B" : "") + Math.abs(floorNumber);
            }
        }
    }
}
export class Lease implements ILease {
    tenantName: string;
    commencementDate: Date;
    exchangeDate: Date;
    confidentialReleaseDate: Date;
    accountName: string;
    expiryDate: Date;
    creationDate: Date;
    updatedDate: Date;
    leaseId: number;
    securityCleared: boolean;
    isLeaseAreaEstimated: boolean;
    isCommencementDateEstimated: boolean;
    isExpiryDateEstimated: boolean;

    LeaseNumber: string;
    LeaseTitle: string;
    LeaseDepartmentTeamId: number;
    IsLeaseThirdParty: boolean
    ThirdPartyAgentId: number;
    ThirdPartyAgentName: string;
    ThirdPartyAgentOthers: string;
    LeaseArea: number;
    LeaseArea_SqM: number;
    LeaseArea_SqF: number;
    LeaseUpdateEmployeeId: number;
    LeaseUpdateEmployee: string;
    LeaseNegEmployee1Id: number;
    LeaseNegEmployee1: string

    LeaseContractTypeId: string
    LeaseContractType: string;
    LeaseIndustryId: string;
    LeaseIndustry: string;

    LeaseRentReviewDate: Date;
    LeaseNetEffectiveRent: number;
    LeaseRent: number;
    LeaseRentPerTypeId: string;
    LeaseRentPerType: string;
    Landlord: string;

    CountryCode: string;
    LeaseType: string;

    space: ISpace;
}
export interface ISpaceMemo {
    SpaceMemoID: number;
    SpaceID: number;
    SpaceMemoTypeID: number;
    SpaceMemoType_ML: string;
    Details: string;
    IsMultiFloor: boolean;
    CreatedBy: string;
    Created: Date;
}
