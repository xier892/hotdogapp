window.addEventListener('load', () => {
  if (document.documentElement.getAttribute('data-prediction-state') === 'hotdog') {
    party.confetti(document.getElementsByClassName('wrapper')[0], {
      count: party.variation.range(60, 80)
    });

    document.body.addEventListener('mousemove', (event) => {
      throttle(party.sparkles(event, {
        count: party.variation.range(1, 4)
      }), 500);
    });
  }
}, false);

function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function throttledFunction(...args) {
    const context = this;
    function run() {
      func.apply(context, args);
      lastRan = Date.now();
    }
    if (!lastRan) {
      if ('requestAnimationFrame' in window) {
        requestAnimationFrame(run);
      } else {
        run();
      }
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          if ('requestAnimationFrame' in window) {
            requestAnimationFrame(run);
          } else {
            run();
          }
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}
