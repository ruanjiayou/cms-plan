import { addDays, formatDate } from "date-fns";

export function groupBy(list: any[], field: string) {
  const map: { [key: string]: any } = {};
  list.forEach(v => {
    if (!map[v[field]]) {
      map[v[field]] = [];
    }
    map[v[field]].push(v);
  })
  return map;
}

export function keyBy(list: any[], field: string) {
  const map: { [key: string]: any } = {};
  list.forEach(v => {
    map[v[field]] = v;
  })
  return map;
}