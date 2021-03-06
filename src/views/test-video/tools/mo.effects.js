!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define([], t)
    : 'object' == typeof exports
    ? (exports.MoEffects = t())
    : (e.MoEffects = t());
})(window, function () {
  return (function (e) {
    var t = {};
    function n(a) {
      if (t[a]) return t[a].exports;
      var r = (t[a] = { i: a, l: !1, exports: {} });
      return e[a].call(r.exports, r, r.exports, n), (r.l = !0), r.exports;
    }
    return (
      (n.m = e),
      (n.c = t),
      (n.d = function (e, t, a) {
        n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: a });
      }),
      (n.r = function (e) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(e, '__esModule', { value: !0 });
      }),
      (n.t = function (e, t) {
        if ((1 & t && (e = n(e)), 8 & t)) return e;
        if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
        var a = Object.create(null);
        if ((n.r(a), Object.defineProperty(a, 'default', { enumerable: !0, value: e }), 2 & t && 'string' != typeof e))
          for (var r in e)
            n.d(
              a,
              r,
              function (t) {
                return e[t];
              }.bind(null, r)
            );
        return a;
      }),
      (n.n = function (e) {
        var t =
          e && e.__esModule
            ? function () {
                return e.default;
              }
            : function () {
                return e;
              };
        return n.d(t, 'a', t), t;
      }),
      (n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (n.p = ''),
      n((n.s = 2))
    );
  })([
    function (e, t, n) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      var a = n(1);
      (t.engine = function (e, t, n, r) {
        void 0 === n && (n = a.Tween.linear);
        var i,
          o = performance.now(),
          c = function () {
            return (i = requestAnimationFrame(u));
          };
        c.cancel = function () {
          i && cancelAnimationFrame(i);
        };
        var u = function (a) {
          var i = (a - o) / t;
          if (i < 0) return c();
          if (i > 1) e(1), r && r(), c.cancel();
          else {
            var u = n(i);
            e(u), c();
          }
        };
        return c;
      }),
        (t.default = t.engine);
    },
    function (e, t, n) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      var a = (function () {
        function e() {}
        return (
          (e.linear = function (e) {
            return e;
          }),
          (e.quadraticIn = function (e) {
            return e * e;
          }),
          (e.quadraticOut = function (e) {
            return e * (2 - e);
          }),
          (e.quadraticInOut = function (e) {
            return (e *= 2) < 1 ? e * e * 0.5 : -0.5 * (--e * (e - 2) - 1);
          }),
          (e.cubicIn = function (e) {
            return e * e * e;
          }),
          (e.cubicOut = function (e) {
            return --e * e * e + 1;
          }),
          (e.cubicInOut = function (e) {
            return (e *= 2) < 1 ? 0.5 * e * e * e : 0.5 * ((e -= 2) * e * e + 2);
          }),
          (e.quarticIn = function (e) {
            return e * e * e * e;
          }),
          (e.quarticOut = function (e) {
            return 1 - --e * e * e * e;
          }),
          (e.quarticInOut = function (e) {
            return (e *= 2) < 1 ? 0.5 * e * e * e * e : -0.5 * ((e -= 2) * e * e * e - 2);
          }),
          (e.circularIn = function (e) {
            return 1 - Math.sqrt(1 - e * e);
          }),
          (e.circularOut = function (e) {
            return Math.sqrt(1 - --e * e);
          }),
          (e.circularInOut = function (e) {
            return (e *= 2) < 1 ? -0.5 * (Math.sqrt(1 - e * e) - 1) : 0.5 * (Math.sqrt(1 - (e -= 2) * e) + 1);
          }),
          (e.elasticIn = function (e) {
            return 0 === e ? 0 : 1 === e ? 1 : -Math.pow(2, 10 * (e - 1)) * Math.sin(5 * (e - 1.1) * Math.PI);
          }),
          (e.elasticOut = function (e) {
            return 0 === e ? 0 : 1 === e ? 1 : Math.pow(2, -10 * e) * Math.sin(5 * (e - 0.1) * Math.PI) + 1;
          }),
          (e.elasticInOut = function (e) {
            return 0 === e
              ? 0
              : 1 === e
              ? 1
              : (e *= 2) < 1
              ? -0.5 * Math.pow(2, 10 * (e - 1)) * Math.sin(5 * (e - 1.1) * Math.PI)
              : 0.5 * Math.pow(2, -10 * (e - 1)) * Math.sin(5 * (e - 1.1) * Math.PI) + 1;
          }),
          (e.bounceIn = function (t) {
            return 1 - e.bounceOut(1 - t);
          }),
          (e.bounceOut = function (e) {
            return e < 1 / 2.75
              ? 7.5625 * e * e
              : e < 2 / 2.75
              ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75
              : e < 2.5 / 2.75
              ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375
              : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375;
          }),
          (e.bounceInOut = function (t) {
            return t < 0.5 ? 0.5 * e.bounceIn(2 * t) : 0.5 * e.bounceOut(2 * t - 1) + 0.5;
          }),
          e
        );
      })();
      (t.Tween = a), (t.default = a);
    },
    function (e, t, n) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      var a = n(0),
        r = n(1),
        i = n(3),
        o = [
          'PullInUp',
          'PullInDown',
          'PullInLeft',
          'PullInRight',
          'ZoomIn',
          'ZommInX',
          'ZoomInY',
          'SlideInUp',
          'SlideInDown',
          'SlideInLeft',
          'SlideInRight',
          'PressInUp',
          'PressInDown',
          'PressInLeft',
          'PressInRight',
          'PressInX',
          'PressInY',
          'UncoverFromTop',
          'UncoverFromBottom',
          'ShutterX',
          'ShutterY',
          'ZoomFullScreen',
          'Wheel',
          'Tooth',
          'FadeIn',
          'FadeOut',
          'StackInTop',
          'StackInBottom',
          'StackInLeft',
          'StackInRight',
          'TopLaser',
          'BottomLaser',
          'RightLaser',
          'LeftLaser'
        ],
        c = { type: 'FadeIn', duration: 0, width: 500, height: 500, easing: r.default.linear },
        u = new Map(),
        l = (function () {
          function e() {}
          return (
            (e.animate = function (e, t, n) {
              void 0 === n && (n = c);
              var a,
                l = (function (e, t, n, a) {
                  void 0 === t && (t = e.offsetWidth),
                    void 0 === n && (n = e.offsetHeight),
                    (a.width = t),
                    (a.height = n);
                  var r = e.__effect_wrap__;
                  return (
                    r || ((r = e.__effect_wrap__ = document.createElement('figure')), e.appendChild(r)),
                    (r.style.cssText +=
                      'display:block;width:' +
                      t +
                      'px;height:' +
                      n +
                      'px;position:relative;margin:0;padding:0;overflow:hidden;'),
                    (r.innerHTML = ''),
                    r
                  );
                })(e, (n = Object.assign({}, c, n)).width, n.height, n);
              l.__playing__ && l.__cancel__ && l.__cancel__(),
                ((a = t),
                new Promise(function (e) {
                  if ((u.has(a) && e(u.get(a)), 'string' == typeof a)) {
                    var t = new Image();
                    (t.crossOrigin = ''),
                      (t.src = a),
                      (t.onload = function () {
                        u.set(a, this), e(this);
                      }),
                      (t.onerror = function () {
                        return e(null);
                      });
                  } else if (a instanceof File) {
                    var n = new FileReader();
                    n.readAsDataURL(a),
                      (n.onload = function (t) {
                        var n = new Image();
                        (n.src = t.target.result), u.set(a, n), e(n);
                      });
                  } else u.set(a, a), e(a);
                })).then(function (e) {
                  return (function (e, t, n) {
                    var a = n.type,
                      c = n.width,
                      u = n.height,
                      l = n.duration,
                      s = n.easing;
                    ('Random' !== a && o.includes(a)) || (a = o[Math.floor(Math.random() * o.length)]);
                    var f,
                      d = {
                        $el: e,
                        img: t,
                        width: c,
                        height: u,
                        duration: l,
                        type: a,
                        easing: 'string' == typeof s && r.default[s] ? r.default[s] : r.default.linear
                      };
                    switch (a) {
                      case 'PullInUp':
                      case 'PullInDown':
                      case 'PullInLeft':
                      case 'PullInRight':
                      case 'ZoomIn':
                      case 'ZommInX':
                      case 'ZoomInY':
                      case 'SlideInUp':
                      case 'SlideInDown':
                      case 'SlideInLeft':
                      case 'SlideInRight':
                      case 'PressInUp':
                      case 'PressInDown':
                      case 'PressInLeft':
                      case 'PressInRight':
                      case 'PressInX':
                      case 'PressInY':
                        f = i.animatePullAndSlider(d);
                        break;
                      case 'UncoverFromTop':
                      case 'UncoverFromBottom':
                        f = i.animateUncover(d);
                        break;
                      case 'ShutterX':
                      case 'ShutterY':
                        f = i.animateShutter(d);
                        break;
                      case 'ZoomFullScreen':
                        f = i.animateZoomFullScreen(d);
                        break;
                      case 'Wheel':
                        f = i.animateWheel(d);
                        break;
                      case 'Tooth':
                        f = i.animateTooth(d);
                        break;
                      case 'FadeIn':
                      case 'FadeOut':
                        f = i.animateFade(d);
                        break;
                      case 'StackInTop':
                      case 'StackInBottom':
                      case 'StackInLeft':
                      case 'StackInRight':
                      case 'TopLaser':
                      case 'BottomLaser':
                      case 'RightLaser':
                      case 'LeftLaser':
                        f = i.animateStackIn(d);
                    }
                    f && (f(), (e.__cancel__ = f.cancel));
                  })(l, e, n);
                });
            }),
            (e.destroy = function () {
              u.clear();
            }),
            (e.engine = a.engine),
            (e.Tween = r.default),
            e
          );
        })();
      (t.Effect = l), (t.default = l);
    },
    function (e, t, n) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      var a = n(0),
        r = window.devicePixelRatio || 1,
        i = (30 * r) | 0,
        o = (4e4 / r) | 0,
        c = function (e, t) {
          var n = r / 1;
          return { RW: (e * n) | 0, RH: (t * n) | 0 };
        },
        u = function (e, t, n) {
          var a = document.createElement('canvas'),
            r = c(e, t),
            i = r.RW,
            o = r.RH;
          ((a.width = i), (a.height = o), (a.style.width = e + 'px'), (a.style.height = t + 'px'), n) &&
            a.getContext('2d').drawImage(n, 0, 0, i, o);
          return a;
        };
      t.fillCanvasBeforePlay = function (e, t, n, a) {
        var r = u(t, n, a);
        return (e.innerHTML = ''), e.appendChild(r), (e.__playing__ = !0), r;
      };
      var l = function (e, t, n, a) {
        var r,
          i = 'left top';
        switch (e) {
          case 'PullInUp':
            (r = 'left bottom'), (i = 'scale(1, ' + t + ')');
            break;
          case 'PullInDown':
            (r = 'left top'), (i = 'scale(1, ' + t + ')');
            break;
          case 'PullInLeft':
            (r = 'right top'), (i = 'scale(' + t + ', 1)');
            break;
          case 'PullInRight':
            (r = 'left top'), (i = 'scale(' + t + ', 1)');
            break;
          case 'ZoomIn':
            (r = 'center center'), (i = 'scale(' + t + ')');
            break;
          case 'ZommInX':
            (r = 'center center'), (i = 'scale(' + t + ', 1)');
            break;
          case 'ZoomInY':
            (r = 'center center'), (i = 'scale(1, ' + t + ')');
            break;
          case 'SlideInUp':
            (r = 'left top'), (i = 'translate(0, ' + (1 - t) * a + 'px)');
            break;
          case 'SlideInDown':
            (r = 'left top'), (i = 'translate(0, ' + -1 * (1 - t) * a + 'px)');
            break;
          case 'SlideInRight':
            (r = 'left top'), (i = 'translate(' + -1 * (1 - t) * n + 'px, 0)');
            break;
          case 'SlideInLeft':
            (r = 'left top'), (i = 'translate(' + (1 - t) * n + 'px, 0)');
            break;
          case 'PressInUp':
            (r = 'top left'), (i = 'scale(1, ' + (1 + 15 * (1 - t)) + ')');
            break;
          case 'PressInDown':
            (r = 'bottom left'), (i = 'scale(1, ' + (1 + 15 * (1 - t)) + ')');
            break;
          case 'PressInLeft':
            (r = 'top left'), (i = 'scale(' + (1 + 15 * (1 - t)) + ', 1)');
            break;
          case 'PressInRight':
            (r = 'top right'), (i = 'scale(' + (1 + 15 * (1 - t)) + ', 1)');
            break;
          case 'PressInX':
            (r = 'center center'), (i = 'scale(' + (1 + 15 * (1 - t)) + ', 1)');
            break;
          case 'PressInY':
            (r = 'center center'), (i = 'scale(1, ' + (1 + 15 * (1 - t)) + ')');
        }
        return 'transform-origin:' + r + '; transform:' + i + ';';
      };
      (t.animatePullAndSlider = function (e) {
        var n = e.$el,
          r = e.width,
          i = e.height,
          o = e.img,
          c = e.duration,
          u = e.easing,
          s = e.type,
          f = t.fillCanvasBeforePlay(n, r, i, o);
        f.style.cssText += l(s, 0, r, i);
        return a.engine(
          function (e) {
            return (f.style.cssText += l(s, e, r, i));
          },
          c,
          u,
          function () {
            return (n.__playing__ = !1);
          }
        );
      }),
        (t.animateFade = function (e) {
          var n = e.$el,
            r = e.width,
            i = e.height,
            o = e.img,
            c = e.duration,
            u = e.easing,
            l = e.type,
            s = t.fillCanvasBeforePlay(n, r, i, o),
            f = 'FadeIn' === l;
          s.style.opacity = f ? '0' : '1';
          return a.engine(
            function (e) {
              return (s.style.opacity = f ? '' + e : '' + (1 - e));
            },
            c,
            u,
            function () {
              (s.style.opacity = ''), (n.__playing__ = !1);
            }
          );
        }),
        (t.animateShutter = function (e) {
          var n = e.$el,
            r = e.width,
            i = e.height,
            o = e.img,
            l = e.duration,
            s = e.easing,
            f = e.type,
            d = t.fillCanvasBeforePlay(n, r, i).getContext('2d'),
            g = u(r, i, o),
            h = g.getContext('2d'),
            p = c(r, i),
            I = p.RW,
            m = p.RH,
            v = 'ShutterX' === f,
            _ = Math.ceil((v ? m : I) / 16);
          return a.engine(
            function (e) {
              d.clearRect(0, 0, I, m);
              for (var t = 0; t < 16; t++) {
                var n = t * _,
                  a = e * _,
                  r = v ? 0 : n,
                  i = v ? n : 0,
                  o = v ? I : a,
                  c = v ? a : m;
                if (a >= 1) {
                  var u = h.getImageData(r, i, o, c);
                  d.putImageData(u, r, i);
                }
              }
            },
            l,
            s,
            function () {
              (g = null), (h = null), (n.__playing__ = !1);
            }
          );
        }),
        (t.animateUncover = function (e) {
          var n = e.$el,
            r = e.width,
            o = e.height,
            l = e.img,
            s = e.duration,
            f = e.easing,
            d = e.type,
            g = t.fillCanvasBeforePlay(n, r, o, l).getContext('2d'),
            h = u(r, o, l),
            p = h.getContext('2d'),
            I = u(r, o),
            m = I.getContext('2d'),
            v = c(r, o),
            _ = v.RW,
            b = v.RH,
            y = (function (e, t) {
              for (var n = 0, a = e.height; n < a; n++)
                for (var r = 0, i = e.width; r < i; r++)
                  (t.data[n * i * 4 + 4 * r + 0] = e.data[(a - n) * i * 4 + 4 * r + 0]),
                    (t.data[n * i * 4 + 4 * r + 1] = e.data[(a - n) * i * 4 + 4 * r + 1]),
                    (t.data[n * i * 4 + 4 * r + 2] = e.data[(a - n) * i * 4 + 4 * r + 2]),
                    (t.data[n * i * 4 + 4 * r + 3] = e.data[(a - n) * i * 4 + 4 * r + 3]);
              return t;
            })(p.getImageData(0, 0, _, b), p.getImageData(0, 0, _, b));
          m.putImageData(y, 0, 0);
          var P = 'UncoverFromTop' === d;
          return a.engine(
            function (e) {
              g.clearRect(0, 0, _, b);
              var t = e * b,
                n = P ? b - t - i : t + i;
              n = Math.max(0, Math.min(n, b - i));
              var a = m.getImageData(0, n, _, i);
              if ((g.putImageData(a, 0, P ? t - 1 : b - t - i + 1), t >= 1)) {
                var r = p.getImageData(0, P ? 0 : b - t, _, t);
                g.putImageData(r, 0, P ? 0 : b - t + 1);
              }
            },
            s,
            f,
            function () {
              (h = null), (p = null), (I = null), (m = null), (n.__playing__ = !1);
            }
          );
        }),
        (t.animateWheel = function (e) {
          var n = e.$el,
            r = e.width,
            i = e.height,
            o = e.img,
            l = e.duration,
            s = e.easing,
            f = t.fillCanvasBeforePlay(n, r, i).getContext('2d'),
            d = u(r, i, o),
            g = f.createPattern(d, 'no-repeat'),
            h = c(r, i),
            p = h.RW,
            I = h.RH,
            m = Math.sqrt(Math.pow(p, 2) + Math.pow(I, 2)) / 2;
          f.fillStyle = g;
          var v = 2 * Math.PI,
            _ = Math.PI / -2;
          return a.engine(
            function (e) {
              f.clearRect(0, 0, p, I), f.beginPath(), f.moveTo(p / 2, I / 2);
              var t = v * e - Math.PI / 2;
              f.arc(p / 2, I / 2, m, _, t, !1), f.fill();
            },
            l,
            s,
            function () {
              (d = null), (n.__playing__ = !1);
            }
          );
        }),
        (t.animateTooth = function (e) {
          var n = e.$el,
            r = e.width,
            i = e.height,
            o = e.img,
            l = e.duration,
            s = e.easing,
            f = t.fillCanvasBeforePlay(n, r, i).getContext('2d'),
            d = u(r, i, o),
            g = d.getContext('2d'),
            h = c(r, i),
            p = h.RW,
            I = h.RH,
            m = Math.ceil(p / 8);
          return a.engine(
            function (e) {
              if ((f.clearRect(0, 0, p, I), 0 !== e))
                for (var t = 0; t < 8; t++) {
                  var n = t * m,
                    a = e * I;
                  if (!(a < 1)) {
                    var r = void 0,
                      i = void 0;
                    t % 2 == 0 ? ((r = 0), (i = I - a)) : ((r = I - a), (i = 0));
                    var o = g.getImageData(n, r, m, a);
                    f.putImageData(o, n, i);
                  }
                }
            },
            l,
            s,
            function () {
              (d = null), (g = null), (n.__playing__ = !1);
            }
          );
        }),
        (t.animateZoomFullScreen = function (e) {
          var n = e.$el,
            r = e.width,
            i = e.height,
            o = e.img,
            l = e.duration,
            s = e.easing,
            f = t.fillCanvasBeforePlay(n, r, i).getContext('2d'),
            d = u(r, i, o),
            g = d.getContext('2d'),
            h = c(r, i),
            p = h.RW,
            I = h.RH,
            m = p / 2;
          return a.engine(
            function (e) {
              f.clearRect(0, 0, p, I);
              var t = e * m,
                n = I * e;
              if (!(n < 1)) {
                var a = m,
                  r = I - n,
                  i = g.getImageData(p - t, 0, t + 1, n + 1);
                f.putImageData(i, a, r);
                var o = m - e * m,
                  c = I - n,
                  u = g.getImageData(0, 0, t + 1, n + 1);
                f.putImageData(u, o, c);
              }
            },
            l,
            s,
            function () {
              (d = null), (g = null), (n.__playing__ = !1);
            }
          );
        }),
        (t.animateStackIn = function (e) {
          var n = e.$el,
            r = e.width,
            i = e.height,
            l = e.img,
            s = e.duration,
            f = e.easing,
            d = e.type,
            g = t.fillCanvasBeforePlay(n, r, i).getContext('2d'),
            h = c(r, i),
            p = h.RW,
            I = h.RH,
            m = r,
            v = i;
          switch (d) {
            case 'StackInTop':
            case 'StackInBottom':
              v = 4 * I;
              break;
            case 'TopLaser':
            case 'BottomLaser':
              v = 60 * I;
              break;
            case 'StackInLeft':
            case 'StackInRight':
              m = 4 * p;
              break;
            case 'LeftLaser':
            case 'RightLaser':
              m = 60 * p;
          }
          (m = Math.min(o, m)), (v = Math.min(o, v));
          var _ = u(m, v, l),
            b = _.getContext('2d'),
            y = c(m, v);
          (m = y.RW), (v = y.RH);
          var P = m > p,
            w = v > I;
          return a.engine(
            function (e) {
              var t, n, a, r, i, o, c, u;
              g.clearRect(0, 0, p, I);
              var l = !1,
                s = !1;
              if (0 !== e) {
                switch (d) {
                  case 'StackInLeft':
                  case 'RightLaser':
                    (a = m * e), (c = p * e), (r = v), (u = I), (t = 0), (n = 0), (i = 0), (o = 0), (l = !0);
                    break;
                  case 'StackInRight':
                  case 'LeftLaser':
                    (r = v), (u = I), (t = m - (a = m * e)), (n = 0), (i = p - (c = p * e)), (o = 0);
                    break;
                  case 'StackInTop':
                  case 'BottomLaser':
                    (a = m), (c = p), (r = v * e), (u = I * e), (t = 0), (n = 0), (i = 0), (o = 0), (s = !0);
                    break;
                  case 'StackInBottom':
                  case 'TopLaser':
                    (a = m), (c = p), (t = 0), (n = v - (r = v * e)), (i = 0), (o = I - (u = I * e));
                }
                if ((g.drawImage(_, t, n, a, r, i, o, c, u), P)) {
                  var f = m - a,
                    h = l ? m - f : 0,
                    y = l ? c : i - t,
                    S = b.getImageData(h, 0, f + 1, I);
                  g.putImageData(S, y, 0);
                } else if (w) {
                  var k = v - r,
                    R = s ? v - k : 0,
                    M = s ? u : o - n;
                  S = b.getImageData(0, R, p, k + 1);
                  g.putImageData(S, 0, M);
                }
              }
            },
            s,
            f,
            function () {
              (_ = null), (b = null), (n.__playing__ = !1);
            }
          );
        });
    }
  ]).default;
});
