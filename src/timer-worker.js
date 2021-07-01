const timerId = setInterval(() => startTimer(), 1000);
return () => clearInterval(timerId);
