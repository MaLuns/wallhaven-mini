let queue = [];

const defaultOptions = {
  type: 'primary',
  mask: false,
  message: '',
  show: true,
  zIndex: 1000,
  duration: 2000,
  selector: '#toast',
};

function getContext() {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
}

function Toast(toastOptions = {}) {
  let options = {
    ...defaultOptions,
    ...toastOptions
  }
  const context = options.context;
  const toast = context.selectComponent(options.selector);

  if (!toast) return;
  toast.clear = () => {
    toast.setData({
      show: false
    });
  };

  queue.push(toast);
  toast.setData(options);
  clearTimeout(toast.timer);

  if (options.duration != null && options.duration > 0) {
    toast.timer = setTimeout(() => {
      toast.clear();
      queue = queue.filter((item) => item !== toast);
    }, options.duration);
  }

  return toast;

}

const createMethod = (type) => (options = {}) => Toast({
  type,
  ...options
})


Toast.primary = createMethod('primary')
Toast.success = createMethod('success')
Toast.danger = createMethod('danger')
Toast.warning = createMethod('warning')

module.exports = Toast