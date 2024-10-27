export const useCookies = () => {
    if (typeof document === 'undefined') return {};
  
    const setCookie = (name, value, days) => {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    };
  
    const getCookie = (name) => {
      const cookie = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
      return cookie ? cookie[2] : null;
    };
  
    const deleteCookie = (name) => {
      setCookie(name, '', -1);
    };
  
    return { setCookie, getCookie, deleteCookie };
  };
  