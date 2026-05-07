import { proxy } from 'valtio'

export const User = proxy({
  profile: {
    nickname: '',
    avatar: '',
  },
  access_token: '',
  refresh_token: '',
  get isLogin() {
    return this.access_token !== '' && this.profile !== null
  },
  logout() {
    this.profile = { nickname: '', avatar: '' };
    this.access_token = '';
    this.refresh_token = '';
  }
})