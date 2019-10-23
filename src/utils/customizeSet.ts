class CustomizeSet {
  private dataStore: Set<string>
  constructor(options?: { dataStore: Set<string> | string[] }) {
    this.dataStore = options && options.dataStore ? new Set(options.dataStore): new Set()
  }
  add(data: string | string[] | CustomizeSet): number {
    if (data instanceof CustomizeSet) {
      data.getArr().forEach(val => this.add(val))
    } else if (data instanceof Array) {
      data.forEach(val => this.add(val))
    } else {
      this.dataStore.add(data)
    }
    return this.size()
  }
  remove(data: string): boolean {
    return this.dataStore.delete(data)
  }
  get(): Set<string> {
    return this.dataStore
  }
  getArr(): string[] {
    return Array.from(this.get())
  }
  size(): number {
    return this.dataStore.size
  }
  // 是否属于该集合成员
  contains(data: string): boolean {
    return this.dataStore.has(data)
  }
  // 交集
  // union(set: Set<string> | string[]): string[] {
  //   let tempSet: CustomizeSet = new CustomizeSet()
  //   tempSet.add(this.dataStore)
  //   tempSet.add(set)
  //   return Array.from(tempSet.get())
  // }
  union(set: CustomizeSet) {
    let tempSet: CustomizeSet = new CustomizeSet()
    tempSet.add(this)
    tempSet.add(set)
    return tempSet
  }
  // 并集
  // intersect(set: Set<string> | string[]): string[] {
  //   return Array.from(set).reduce((prev: string[], val) => {
  //     if(this.contains(val)) {
  //       prev.push(val)
  //     }
  //     return prev
  //   }, [])
  // }
  intersect(set: CustomizeSet) {
    let tempSet: CustomizeSet = new CustomizeSet()
    set.getArr().forEach(val => {
      if(this.contains(val)) {
        tempSet.add(val)
      }
    })
    return tempSet
  }
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
  difference(set: CustomizeSet) {
    let tempSet: CustomizeSet = new CustomizeSet()
    set.getArr().forEach(val => {
      if(!this.contains(val)) {
        tempSet.add(val)
      }
    })
    return tempSet
  }
  // 子集
  // subset(set: Set<string> | string[]): boolean {
  //   return Array.from(set).every(val => this.contains(val))
  // }
  subset(set: CustomizeSet): boolean {
    return set.getArr().every(val => this.contains(val))
  }
}

export default CustomizeSet