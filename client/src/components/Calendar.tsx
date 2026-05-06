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
  MealBlock,
  MealLabel,
  MealDishes,
  DishTag,
} from '../styles/MealPlanner'

const OneDish = ({ item }: { item: IRecord }) => {
  return (
    <DishTag
      className={`dish-tag`}
    >
      {item.date}
    </DishTag>
  )
}

const Grids42 = ({ month, today, setSelectedDate }: { month: string, today: string, setSelectedDate: (date: string) => void }) => {
  const state = useSnapshot(store)
  const date = new Date(month);
  const monthStart = startOfMonth(date);
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
          className={`${!sameMonth ? outside : ''} ${date === today ? 'today' : ''}`}
          onClick={() => {
            if (sameMonth) {
              if (!state.dateRecordsMap.get(date)) {
                store.dateRecordsMap.set(date, [])
              }
              setSelectedDate(date)
            }
          }}
        >
          <DayNumber>{format(day, 'd')}</DayNumber>
          <MealBlock>
            <MealDishes>
              {records.map(v => (
                <OneDish item={v} key={v.id} />
              ))}
            </MealDishes>
          </MealBlock>
        </CalendarDay>
      )
    })}
  </CalendarDays>
}

const CacheGrid = memo(({ month, today, setSelectedDate }: { month: string, today: string, setSelectedDate: (date: string) => void }) => {
  return <Grids42 month={month} today={today} setSelectedDate={setSelectedDate} />
}, (prev, next) => {
  return prev.month === next.month
})

const Calendar = () => {
  const state = useSnapshot(store)
  const [selectedDate, setSelectedDate] = useState('')
  const swiperRef = useRef(null);
  useEffect(() => {
    loadDateRecords()
    // 获取本月所需数据(本月+前后7天)
    getRecordsByDate(formatDate(state.currentDateTime, 'yyyy-MM')).then(list => {
      store.setRecordsMap(list!)
    })
  }, [state.currentDateTime])

  const loadDateRecords = async () => {
    store.loadLocalRecords(state.currentDateTime)
    // 计算本月部分数据的重复菜品
    // state.calc_repeat(state.currentDateTime)
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
            if (evt.swipeDirection === 'prev') {
              store.subMonth()
            } else {
              store.addMonth()
            }
            evt.slideTo(1, 0);
          }}
        >
          {state.months.map(month => (
            <SwiperSlide key={month} id={month}>
              <CacheGrid month={month} today={state.today} setSelectedDate={setSelectedDate} />
            </SwiperSlide>
          ))}
        </Swiper>
      </CalendarGrid>
    </Main>
  )
}
export default Calendar