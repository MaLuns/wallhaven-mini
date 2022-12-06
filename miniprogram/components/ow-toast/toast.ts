type ToastMessage = string | number;
type ToastContext =
  | WechatMiniprogram.Component.TrivialInstance
  | WechatMiniprogram.Page.TrivialInstance;

interface ToastOptions {
  show?: boolean;
  type?: string;
  mask?: boolean;
  zIndex?: number;
  context?: (() => ToastContext) | ToastContext;
  position?: string;
  duration?: number;
  selector?: string;
  message?: ToastMessage;
  onClose?: () => void;
}

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

function Toast(toastOptions: ToastOptions) {
  let options = {
    ...defaultOptions,
    ...toastOptions
  }

  const context =
    (typeof options.context === 'function'
      ? options.context()
      : options.context) || getContext();
  const toast = context.selectComponent(options.selector);

  if (!toast) return;
  toast.clear = () => {
    toast.setData({
      show: false
    });
  };

  toast.setData(options);
  clearTimeout(toast.timer);

  if (options.duration != null && options.duration > 0) {
    toast.timer = setTimeout(() => {
      toast.clear();
    }, options.duration);
  }

  return toast;

}

const createMethod = (type: string) =>
  (options: ToastOptions | string) => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    Toast({ type, ...options })
  }

Toast.primary = createMethod('primary')
Toast.success = createMethod('success')
Toast.danger = createMethod('danger')
Toast.warning = createMethod('warning')

export default Toast