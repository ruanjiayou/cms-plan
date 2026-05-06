import React, { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import { CalendarDays } from 'lucide-react'
import { getAccessToken, getRecordsByDate, getProfile, getTags } from './apis/'
import { formatDate } from 'date-fns'
import UserStatus from './components/UserStatus'
import { useSnapshot } from 'valtio'
import store from './store'
import { AlignAside } from './styles/common'
import LogoSVG from './asserts/logo.svg?react';
import { Wrap, AppHeader, HeaderContent, AppMain, Logo, TabNavigation, TabButton } from './styles/App'

export default () => {
  const state = useSnapshot(store)
  const [activeTab, setActiveTab] = useState('planner')

  useEffect(() => {
    const search = new URLSearchParams(window.location.search)
    const refresh_token = search.get('refresh_token')
    if (refresh_token) {
      store.user.refresh_token = (refresh_token)
      window.location.replace(window.location.origin + window.location.pathname)
    }
    const init = async () => {
      if (store.user.refresh_token && !store.user.access_token) {
        try {
          const tokens = await getAccessToken(store.user.refresh_token)
          if (tokens) {
            store.user.access_token = (tokens.access_token)
            store.user.refresh_token = (tokens.refresh_token)
          }
        } catch (e) {

        }
      }
      if (store.user.access_token && !store.user.profile) {
        const result = await getProfile();
        store.user.profile = (result.info)
      }

      const tags = await getTags()
      store.tags = tags!;
    };
    init()
  }, [])
  return (
    <Wrap>
      <AppHeader>
        <HeaderContent className={AlignAside}>
          <Logo>
            <LogoSVG style={{ width: 30, height: 30 }} />
            <h1>计划</h1>
          </Logo>

          <TabNavigation>
            <TabButton
              className={activeTab === 'planner' ? 'active' : ''}
              onClick={() => setActiveTab('planner')}
            >
              <CalendarDays size={18} /> {formatDate(store.currentDateTime, 'yyyy-MM')}
            </TabButton>
          </TabNavigation>

          <UserStatus />
        </HeaderContent>
      </AppHeader>

      <AppMain>
        <Calendar />
      </AppMain>
    </Wrap>
  )
};