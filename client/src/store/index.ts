import { useRef } from 'react'
import { startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, subDays, addDays, formatDate, } from 'date-fns'
import storage from '../utils/storage';
import { groupBy } from '../utils'
import { proxy, useSnapshot } from 'valtio'
import { proxyMap } from 'valtio/utils'
import { App } from './App'
import { User } from './User'

export type ITag = {
  id: string;
  name: string;
}
export type IRecord = {
  id: string;
  date: string;
}

export function useLocalProxy<T extends object>(initialState: T) {
  // 保持 proxy 引用不变
  const ref = useRef(proxy(initialState))
  // 订阅变化 - 这会自动触发重新渲染
  const snap = useSnapshot(ref.current)
  return [snap, ref.current]
}

const store = proxy<{
  today: string,
  currentDateTime: Date,
  app: typeof App,
  user: typeof User,
  tags: ITag[],
  dateRecordsMap: Map<string, IRecord[]>,
  months: string[],
  loadLocalRecords: (datetime: Date) => void,
  setRecordsMap: (tags: IRecord[]) => void,
  addDateRecord: (record: IRecord) => void,
  removeDateRecord: (record: IRecord) => void,
  addMonth: () => void,
  subMonth: () => void,
  logout: () => void,
}>({
  app: App,
  user: User,
  tags: [],
  currentDateTime: new Date(),
  today: formatDate(new Date(), 'yyyy-MM-dd'),
  dateRecordsMap: proxyMap(),
  get months() {
    const curr = formatDate(this.currentDateTime, 'yyyy-MM-dd');
    const prev = formatDate(subMonths(this.currentDateTime, 1), 'yyyy-MM-dd')
    const next = formatDate(addMonths(this.currentDateTime, 1), 'yyyy-MM-dd')
    return [prev, curr, next];
  },
  // 从本地操作    
  loadLocalRecords(datetime: Date) {
    const start = startOfMonth(subMonths(datetime, 1));
    const end = endOfMonth(addMonths(datetime, 1))
    const arr = eachDayOfInterval({ start, end });
    for (let i = 0; i < arr.length; i++) {
      const date = formatDate(arr[i] as Date, 'yyyy-MM-dd')
      const value = storage.getValue(date)
      this.dateRecordsMap.set(date, value ? JSON.parse(value) : [])
    }
  },// 记录管理
  setRecordsMap(records: IRecord[]) {
    const map = groupBy(records, 'date');
    const that = this
    Object.keys(map).forEach(function (date) {
      storage.setValue(date, JSON.stringify(map[date]))
      that.dateRecordsMap.set(date, map[date]);
    });
  },
  addDateRecord(record: IRecord) {
    const records = this.dateRecordsMap.get(record.date) || []
    records.push(record)
    storage.setValue(record.date, JSON.stringify(records))
  },
  removeDateRecord(record: IRecord) {
    const records = this.dateRecordsMap.get(record.date)
    if (records) {
      const idx = records.findIndex(r => r.id === record.id)
      if (idx !== -1) {
        records.splice(idx, 1)
      }
      storage.setValue(record.date, JSON.stringify(records))
    }
  },
  // 月份切换
  addMonth() {
    this.currentDateTime = addMonths(new Date(this.currentDateTime), 1)
  },
  subMonth() {
    this.currentDateTime = subMonths(new Date(this.currentDateTime), 1)
  },
  logout() {
    this.user.profile = { nickname: '', avatar: '' };
    this.user.access_token = '';
    this.user.refresh_token = '';
  }
});

export default store;