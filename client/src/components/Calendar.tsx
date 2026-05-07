import React, { useState, useEffect, useRef, memo } from 'react'
import { format, subDays, addDays, isSameMonth, formatDate, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, addMonths, } from 'date-fns'
import { getRecordsByDate, } from '../apis'

import { useSnapshot } from 'valtio'
import { Swiper, SwiperSlide } from 'swiper/react';
import store, { type IRecord, type ITag } from '../store'

import {
  Main,
  CalendarDays,
  CalendarDay,
  CalendarGrid,
  Weekdays,
  Weekday,
  outside,
  DayNumber,
  RecordBlock,
  RecordLabel,
  RecordItem,
  RecordTitle,
} from '../styles/Calendar'

const One = ({ item }: { item: IRecord }) => {
  return (
    <RecordTitle
      className={`dish-tag`}
    >
      {item.date}
    </RecordTitle>
  )
}

const Grids42 = ({ month, }: { month: string, }) => {
  const state = useSnapshot(store)
  const datetime = new Date(month);
  const monthStart = startOfMonth(datetime);
  const start_of42 = subDays(monthStart, (monthStart.getDay() === 0 ? 7 : monthStart.getDay()) - 1);
  const end_of42 = addDays(start_of42, 41);
  const days = eachDayOfInterval({ start: start_of42, end: end_of42 })
  return <CalendarDays>
    {days.map(day => {
      const date = format(day, 'yyyy-MM-dd')
      const records = state.dateRecordsMap.get(date) || [];
      const sameMonth = isSameMonth(day, month)

      return (
        <CalendarDay
          key={date}
          className={`${!sameMonth ? outside : ''} ${date === state.app.today ? 'today' : ''} ${date === state.app.selectedDate ? 'active' : ''}`}
          onClick={() => {
            store.app.setSelectedDate(date)
            if (!sameMonth) {
              datetime.getTime() > day.getTime() ? store.app.subMonth() : store.app.addMonth()
            }
          }}
        >
          <DayNumber>{format(day, 'd')}</DayNumber>
          <RecordBlock>
            <RecordItem>
              {records.map(v => (
                <One item={v} key={v.id} />
              ))}
            </RecordItem>
          </RecordBlock>
        </CalendarDay>
      )
    })}
  </CalendarDays>
}

// const CacheGrid = memo(({ month, }: { month: string, }) => {
//   return <Grids42 month={month} />
// }, (prev, next) => {
//   return prev.month === next.month
// })

const Calendar = () => {
  const appState = useSnapshot(store.app)
  const swiperRef = useRef(null);
  useEffect(() => {
    loadDateRecords()
    // 获取本月所需数据(本月+前后7天)
    getRecordsByDate(formatDate(appState.currentDateTime, 'yyyy-MM')).then(list => {
      store.setRecordsMap(list!)
    })
  }, [appState.currentDateTime])

  const loadDateRecords = async () => {
    store.loadLocalRecords(appState.currentDateTime)
  }

  const onChange = () => {

  }
  return (
    <Main>
      <CalendarGrid>
        <Weekdays>
          {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => (
            <Weekday key={day}>{day}</Weekday>
          ))}
        </Weekdays>
        <Swiper
          initialSlide={1} // 默认显示第二个
          modules={[]}
          ref={swiperRef}
          style={{ width: '100%' }}
          spaceBetween={50}
          slidesPerView={1}
          onTransitionEnd={(evt) => {
            if (evt.activeIndex === 1) {
              return;
            }
            evt.swipeDirection === 'prev' ? store.app.subMonth() : store.app.addMonth()
            evt.slideTo(1, 0);
          }}
        >
          {appState.months.map(month => (
            <SwiperSlide key={month} id={month}>
              <Grids42 month={month} />
            </SwiperSlide>
          ))}
        </Swiper>
      </CalendarGrid>
    </Main>
  )
}
export default Calendar