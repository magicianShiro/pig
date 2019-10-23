"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomizeSet = /** @class */ (function () {
    function CustomizeSet(options) {
        this.dataStore = options && options.dataStore ? new Set(options.dataStore) : new Set();
    }
    CustomizeSet.prototype.add = function (data) {
        var _this = this;
        if (data instanceof CustomizeSet) {
            data.getArr().forEach(function (val) { return _this.add(val); });
        }
        else if (data instanceof Array) {
            data.forEach(function (val) { return _this.add(val); });
        }
        else {
            this.dataStore.add(data);
        }
        return this.size();
    };
    CustomizeSet.prototype.remove = function (data) {
        return this.dataStore.delete(data);
    };
    CustomizeSet.prototype.get = function () {
        return this.dataStore;
    };
    CustomizeSet.prototype.getArr = function () {
        return Array.from(this.get());
    };
    CustomizeSet.prototype.size = function () {
        return this.dataStore.size;
    };
    // 是否属于该集合成员
    CustomizeSet.prototype.contains = function (data) {
        return this.dataStore.has(data);
    };
    // 交集
    // union(set: Set<string> | string[]): string[] {
    //   let tempSet: CustomizeSet = new CustomizeSet()
    //   tempSet.add(this.dataStore)
    //   tempSet.add(set)
    //   return Array.from(tempSet.get())
    // }
    CustomizeSet.prototype.union = function (set) {
        var tempSet = new CustomizeSet();
        tempSet.add(this);
        tempSet.add(set);
        return tempSet;
    };
    // 并集
    // intersect(set: Set<string> | string[]): string[] {
    //   return Array.from(set).reduce((prev: string[], val) => {
    //     if(this.contains(val)) {
    //       prev.push(val)
    //     }
    //     return prev
    //   }, [])
    // }
    CustomizeSet.prototype.intersect = function (set) {
        var _this = this;
        var tempSet = new CustomizeSet();
        set.getArr().forEach(function (val) {
            if (_this.contains(val)) {
                tempSet.add(val);
            }
        });
        return tempSet;
    };
    // 补集
    // difference(set: string[] | CustomizeSet): string[] {
    //   let arr: string[] = Array.isArray(set) ? set : set.getArr()
    //   return arr.reduce((prev: string[], val) => {
    //     if(!this.contains(val)) {
    //       prev.push(val)
    //     }
    //     return prev
    //   }, [])
    // }
    CustomizeSet.prototype.difference = function (set) {
        var _this = this;
        var tempSet = new CustomizeSet();
        set.getArr().forEach(function (val) {
            if (!_this.contains(val)) {
                tempSet.add(val);
            }
        });
        return tempSet;
    };
    // 子集
    // subset(set: Set<string> | string[]): boolean {
    //   return Array.from(set).every(val => this.contains(val))
    // }
    CustomizeSet.prototype.subset = function (set) {
        var _this = this;
        return set.getArr().every(function (val) { return _this.contains(val); });
    };
    return CustomizeSet;
}());
exports.default = CustomizeSet;
