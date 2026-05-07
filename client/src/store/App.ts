import { addMonths, formatDate, subMonths } from 'date-fns';
import { proxy } from 'valtio'
import { proxyMap } from 'valtio/utils';

export const App = proxy({
  baseURL: '',
  currentDateTime: new Date(),
  selectedDate: '',
  today: formatDate(new Date(), 'yyyy-MM-dd'),
  get months() {
    const curr = formatDate(this.currentDateTime, 'yyyy-MM-dd');
    const prev = formatDate(subMonths(this.currentDateTime, 1), 'yyyy-MM-dd')
    const next = formatDate(addMonths(this.currentDateTime, 1), 'yyyy-MM-dd')
    return [prev, curr, next];
  },
  // 月份切换
  addMonth() {
    this.currentDateTime = addMonths(new Date(this.currentDateTime), 1)
  },
  subMonth() {
    this.currentDateTime = subMonths(new Date(this.currentDateTime), 1)
  },
  setSelectedDate(date: string) {
    this.selectedDate = date;
  }
})