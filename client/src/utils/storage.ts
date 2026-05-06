const storage = {
  prefix: 'plan:',
  setValue(key: string, value: string) {
    window.localStorage.setItem(
      this.prefix + key,
      value,
    );
  },
  getValue(key: string) {
    return window.localStorage.getItem(this.prefix + key);
  },
  removeKey(key: string) {
    window.localStorage.removeItem(this.prefix + key);
  },
};

export default storage;