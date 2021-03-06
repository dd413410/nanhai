var BMapGLLib = window.BMapGLLib = BMapGLLib || {};
(function() {
	var c = c || {
		guid: "$BAIDU$"
	};
	(function() {
		window[c.guid] = {};
		c.extend = function(g, e) {
			for (var f in e) {
				if (e.hasOwnProperty(f)) {
					g[f] = e[f]
				}
			}
			return g
		};
		c.lang = c.lang || {};
		c.lang.guid = function() {
			return "TANGRAM__" + (window[c.guid]._counter++).toString(36)
		};
		window[c.guid]._counter = window[c.guid]._counter || 1;
		window[c.guid]._instances = window[c.guid]._instances || {};
		c.lang.Class = function(e) {
			this.guid = e || c.lang.guid();
			window[c.guid]._instances[this.guid] = this
		};
		window[c.guid]._instances = window[c.guid]._instances || {};
		c.lang.isString = function(e) {
			return "[object String]" == Object.prototype.toString.call(e)
		};
		c.lang.isFunction = function(e) {
			return "[object Function]" == Object.prototype.toString.call(e)
		};
		c.lang.Class.prototype.toString = function() {
			return "[object " + (this._className || "Object") + "]"
		};
		c.lang.Class.prototype.dispose = function() {
			delete window[c.guid]._instances[this.guid];
			for (var e in this) {
				if (!c.lang.isFunction(this[e])) {
					delete this[e]
				}
			}
			this.disposed = true
		};
		c.lang.Event = function(e, f) {
			this.type = e;
			this.returnValue = true;
			this.target = f || null;
			this.currentTarget = null
		};
		c.lang.Class.prototype.addEventListener = function(h, g, f) {
			if (!c.lang.isFunction(g)) {
				return
			}!this.__listeners && (this.__listeners = {});
			var e = this.__listeners,
				i;
			if (typeof f == "string" && f) {
				if (/[^\w\-]/.test(f)) {
					throw ("nonstandard key:" + f)
				} else {
					g.hashCode = f;
					i = f
				}
			}
			h.indexOf("on") != 0 && (h = "on" + h);
			typeof e[h] != "object" && (e[h] = {});
			i = i || c.lang.guid();
			g.hashCode = i;
			e[h][i] = g
		};
		c.lang.Class.prototype.removeEventListener = function(g, f) {
			if (c.lang.isFunction(f)) {
				f = f.hashCode
			} else {
				if (!c.lang.isString(f)) {
					return
				}
			}!this.__listeners && (this.__listeners = {});
			g.indexOf("on") != 0 && (g = "on" + g);
			var e = this.__listeners;
			if (!e[g]) {
				return
			}
			e[g][f] && delete e[g][f]
		};
		c.lang.Class.prototype.dispatchEvent = function(h, e) {
			if (c.lang.isString(h)) {
				h = new c.lang.Event(h)
			}!this.__listeners && (this.__listeners = {});
			e = e || {};
			for (var g in e) {
				h[g] = e[g]
			}
			var g, f = this.__listeners,
				j = h.type;
			h.target = h.target || this;
			h.currentTarget = this;
			j.indexOf("on") != 0 && (j = "on" + j);
			c.lang.isFunction(this[j]) && this[j].apply(this, arguments);
			if (typeof f[j] == "object") {
				for (g in f[j]) {
					f[j][g].apply(this, arguments)
				}
			}
			return h.returnValue
		};
		c.lang.inherits = function(k, i, h) {
			var g, j, e = k.prototype,
				f = new Function();
			f.prototype = i.prototype;
			j = k.prototype = new f();
			for (g in e) {
				j[g] = e[g]
			}
			k.prototype.constructor = k;
			k.superClass = i.prototype;
			if ("string" == typeof h) {
				j._className = h
			}
		};
		c.dom = c.dom || {};
		c._g = c.dom._g = function(e) {
			if (c.lang.isString(e)) {
				return document.getElementById(e)
			}
			return e
		};
		c.g = c.dom.g = function(e) {
			if ("string" == typeof e || e instanceof String) {
				return document.getElementById(e)
			} else {
				if (e && e.nodeName && (e.nodeType == 1 || e.nodeType == 9)) {
					return e
				}
			}
			return null
		};
		c.insertHTML = c.dom.insertHTML = function(h, e, g) {
			h = c.dom.g(h);
			var f, i;
			if (h.insertAdjacentHTML) {
				h.insertAdjacentHTML(e, g)
			} else {
				f = h.ownerDocument.createRange();
				e = e.toUpperCase();
				if (e == "AFTERBEGIN" || e == "BEFOREEND") {
					f.selectNodeContents(h);
					f.collapse(e == "AFTERBEGIN")
				} else {
					i = e == "BEFOREBEGIN";
					f[i ? "setStartBefore" : "setEndAfter"](h);
					f.collapse(i)
				}
				f.insertNode(f.createContextualFragment(g))
			}
			return h
		};
		c.ac = c.dom.addClass = function(k, m) {
			k = c.dom.g(k);
			var f = m.split(/\s+/),
				e = k.className,
				j = " " + e + " ",
				h = 0,
				g = f.length;
			for (; h < g; h++) {
				if (j.indexOf(" " + f[h] + " ") < 0) {
					e += (e ? " " : "") + f[h]
				}
			}
			k.className = e;
			return k
		};
		c.event = c.event || {};
		c.event._listeners = c.event._listeners || [];
		c.on = c.event.on = function(f, i, k) {
			i = i.replace(/^on/i, "");
			f = c._g(f);
			var j = function(m) {
					k.call(f, m)
				},
				e = c.event._listeners,
				h = c.event._eventFilter,
				l, g = i;
			i = i.toLowerCase();
			if (h && h[i]) {
				l = h[i](f, i, j);
				g = l.type;
				j = l.listener
			}
			if (f.addEventListener) {
				f.addEventListener(g, j, false)
			} else {
				if (f.attachEvent) {
					f.attachEvent("on" + g, j)
				}
			}
			e[e.length] = [f, i, k, j, g];
			return f
		};
		c.un = c.event.un = function(g, j, f) {
			g = c._g(g);
			j = j.replace(/^on/i, "").toLowerCase();
			var m = c.event._listeners,
				h = m.length,
				i = !f,
				l, k, e;
			while (h--) {
				l = m[h];
				if (l[1] === j && l[0] === g && (i || l[2] === f)) {
					k = l[4];
					e = l[3];
					if (g.removeEventListener) {
						g.removeEventListener(k, e, false)
					} else {
						if (g.detachEvent) {
							g.detachEvent("on" + k, e)
						}
					}
					m.splice(h, 1)
				}
			}
			return g
		};
		c.preventDefault = c.event.preventDefault = function(e) {
			if (e.preventDefault) {
				e.preventDefault()
			} else {
				e.returnValue = false
			}
		}
	})();
	var d = BMapGLLib.DistanceTool = function(f, e) {
		if (!f) {
			return
		}
		this._map = f;
		e = e || {};
		this._opts = c.extend(c.extend(this._opts || {}, {
			tips: "测距",
			followText: "单击确定地点，双击结束",
			unit: "metric",
			lineColor: "#ff6319",
			lineStroke: 2,
			opacity: 0.8,
			lineStyle: "solid",
			cursor: "http://api.map.baidu.com/images/ruler.cur",
			secIcon: null,
			closeIcon: null
		}), e);
		this._followTitle = null;
		this._points = [];
		this._paths = [];
		this._dots = [];
		this._segDistance = [];
		this._overlays = [];
		this._enableMassClear = true, this._units = {
			metric: {
				name: "metric",
				conv: 1,
				incon: 1000,
				u1: "米",
				u2: "公里"
			},
			us: {
				name: "us",
				conv: 3.2808,
				incon: 5279.856,
				u1: "英尺",
				u2: "英里"
			}
		};
		this._isOpen = false;
		this._startFollowText = "单击确定起点";
		this._movingTimerId = null;
		this._styles = {
			"BMapGLLib_diso": "height:17px;width:5px;position:absolute;background:url(http://api.map.baidu.com/images/dis_box_01.gif) no-repeat left top",
			"BMapGLLib_disi": "color:#7a7a7a;position:absolute;left:5px;padding:0 4px 1px 0;line-height:17px;background:url(http://api.map.baidu.com/images/dis_box_01.gif) no-repeat right top",
			"BMapGLLib_disBoxDis": "color:#ff6319;font-weight:bold"
		};
		if (this._opts.lineStroke <= 0) {
			this._opts.lineStroke = 2
		}
		if (this._opts.opacity > 1) {
			this._opts.opacity = 1
		} else {
			if (this._opts.opacity < 0) {
				this._opts.opacity = 0
			}
		}
		if (this._opts.lineStyle != "solid" && this._opts.lineStyle != "dashed") {
			this._opts.lineStyle = "solid"
		}
		if (!this._units[this._opts.unit]) {
			this._opts.unit = "metric"
		}
		this.text = "测距"
	};
	c.lang.inherits(d, c.lang.Class, "DistanceTool");
	d.prototype._bind = function() {
		this._setCursor(this._opts.cursor);
		var f = this;
		c.on(this._map.getContainer(), "mousemove", function(i) {
			if (!f._isOpen) {
				return
			}
			if (!f._followTitle) {
				return
			}
			i = window.event || i;
			var g = i.target || i.srcElement;
			if (g != a.getDom(f._map)) {
				f._followTitle.hide();
				return
			}
			if (!f._mapMoving) {
				f._followTitle.show()
			}
			var h = a.getDrawPoint(i, true);
			f._followTitle.setPosition(h)
		});
		if (this._startFollowText) {
			var e = this._followTitle = new BMapGL.Label(this._startFollowText, {
				offset: new BMapGL.Size(14, 16)
			});
			this._followTitle.setStyles({
				color: "#333",
				borderColor: "#ff0103"
			})
		}
	};
	d.prototype.open = function() {
		if (this._isOpen == true) {
			return true
		}
		if (!!BMapGLLib._toolInUse) {
			return
		}
		this._isOpen = true;
		BMapGLLib._toolInUse = true;
		if (this._mapMoving) {
			delete this._mapMoving
		}
		var h = this;
		if (!this._binded) {
			this._binded = true;
			this._bind();
			this._map.addEventListener("moving", function() {
				h._hideCurrent()
			})
		}
		if (this._followTitle) {
			this._map.addOverlay(this._followTitle);
			this._followTitle.hide()
		}
		var g = function(q) {
			var l = h._map;
			if (!h._isOpen) {
				return
			}
			q = window.event || q;
			var n = a.getDrawPoint(q, true);
			if (!h._isPointValid(n)) {
				return
			}
			h._bind.initX = q.pageX || q.clientX || 0;
			h._bind.initY = q.pageY || q.clientY || 0;
			if (h._points.length > 0) {
				var t = l.pointToPixel(h._points[h._points.length - 1]);
				var m = l.pointToPixel(n);
				var p = Math.sqrt(Math.pow(t.x - m.x, 2) + Math.pow(t.y - m.y, 2));
				if (p < 5) {
					return
				}
			}
			h._bind.x = q.layerX || q.offsetX || 0;
			h._bind.y = q.layerY || q.offsetY || 0;
			h._points.push(n);
			h._addSecPoint(n);
			if (h._paths.length == 0) {
				h._formatTitle(1, h._opts.followText, h._getTotalDistance())
			}
			if (h._paths.length > 0) {
				h._paths[h._paths.length - 1].show();
				h._paths[h._paths.length - 1].setStrokeOpacity(h._opts.opacity)
			}
			var w = new BMapGL.Polyline([n, n], {
				enableMassClear: h._enableMassClear
			});
			h._map.addOverlay(w);
			h._paths.push(w);
			h._overlays.push(w);
			w.setOptions({
				strokeWeight: h._opts.lineStroke,
				strokeColor: h._opts.lineColor,
				strokeOpacity: h._opts.opacity / 2,
				strokeStyle: h._opts.lineStyle
			});
			if (h._mapMoving) {
				w.hide()
			}
			if (h._points.length > 1) {
				var o = h._paths[h._points.length - 2];
				o.setPositionAt(1, n)
			}
			var r = "";
			if (h._points.length > 1) {
				var u = h._setSegDistance(h._points[h._points.length - 2], h._points[h._points.length - 1]);
				var s = h._getTotalDistance();
				r = h._formatDisStr(s)
			} else {
				r = "起点"
			}
			var v = new BMapGL.Label(r, {
				offset: new BMapGL.Size(10, -5),
				enableMassClear: h._enableMassClear
			});
			v.setStyles({
				color: "#333",
				borderColor: "#ff0103"
			});
			h._map.addOverlay(v);
			h._formatSegLabel(v, r);
			h._overlays.push(v);
			n.disLabel = v;
			v.setPosition(n);
			var k = new c.lang.Event("onaddpoint");
			k.point = n;
			k.pixel = h._map.pointToPixel(n);
			k.index = h._points.length - 1;
			k.distance = h._getTotalDistance().toFixed(0);
			h.dispatchEvent(k)
		};
		var f = function(p) {
			if (!h._isOpen) {
				return
			}
			if (h._paths.length > 0) {
				p = window.event || p;
				var l = p.pageX || p.clientX || 0;
				var k = p.pageY || p.clientY || 0;
				if (typeof h._bind.initX == "undefined") {
					h._bind.x = p.layerX || p.offsetX || 0;
					h._bind.y = p.layerY || p.offsetY || 0;
					h._bind.initX = l;
					h._bind.initY = k
				}
				var r = h._bind.x + l - h._bind.initX;
				var q = h._bind.y + k - h._bind.initY;
				var z = h._paths[h._paths.length - 1];
				var m = h._map.pixelToPoint(new BMapGL.Pixel(r, q));
				z.setPositionAt(1, m);
				if (!h._mapMoving) {
					z.show()
				}
				var A = 0;
				var u = 0;
				if (r < 10) {
					A = 8
				} else {
					if (r > h._map.getSize().width - 10) {
						A = -8
					}
				}
				if (q < 10) {
					u = 8
				} else {
					if (q > h._map.getSize().height - 10) {
						u = -8
					}
				}
				if (A != 0 || u != 0) {
					if (!f._movingTimerId) {
						h._mapMoving = true;
						h._map.panBy(A, u, {
							noAnimation: true
						});
						h._movingTimerId = f._movingTimerId = setInterval(function() {
							h._map.panBy(A, u, {
								noAnimation: true
							})
						}, 30);
						z.hide();
						h._followTitle && h._followTitle.hide()
					}
				} else {
					if (f._movingTimerId) {
						clearInterval(f._movingTimerId);
						delete f._movingTimerId;
						delete h._movingTimerId;
						var w = h._paths[h._paths.length - 1];
						var v = h._map.pixelToPoint(new BMapGL.Pixel(r, q));
						if (!w) {
							return
						}
						w.setPositionAt(1, v);
						w.show();
						if (h._followTitle) {
							h._followTitle.setPosition(v);
							h._followTitle.show()
						}
						h._bind.i = 0;
						h._bind.j = 0;
						delete h._mapMoving
					}
				}
				if (h._followTitle) {
					var o = h._getTotalDistance();
					var n = h._map.getDistance(h._points[h._points.length - 1], m);
					h._updateInstDis(h._followTitle, o + n)
				}
			} else {
				if (h._followTitle) {
					h._followTitle.show();
					p = window.event || p;
					var s = p.target || p.srcElement;
					if (s != a.getDom()) {
						h._followTitle.hide()
					}
				}
			}
		};
		var e = function(k) {
			if (!h._isOpen) {
				return
			}
			c.un(a.getDom(h._map), "click", g);
			c.un(document, "mousemove", f);
			c.un(a.getDom(h._map), "dblclick", e);
			c.un(document, "keydown", j);
			c.un(a.getDom(h._map), "mouseup", i);
			setTimeout(function() {
				h.close()
			}, 50)
		};
		var j = function(k) {
			k = window.event || k;
			if (k.keyCode == 27) {
				h._clearCurData();
				setTimeout(function() {
					h.close()
				}, 50)
			}
		};
		var i = function(k) {
			k = window.event || k;
			var l = 0;
			if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
				l = document.documentMode || +RegExp["\x241"]
			}
			if (l && k.button != 1 || k.button == 2) {
				h.close()
			}
		};
		h._initData();
		this._formatTitle();
		a.show(this._map);
		this._setCursor(this._opts.cursor);
		c.on(a.getDom(this._map), "click", g);
		c.on(document, "mousemove", f);
		c.on(a.getDom(this._map), "dblclick", e);
		c.on(document, "keydown", j);
		c.on(a.getDom(this._map), "mouseup", i);
		this.bindFunc = [{
			elem: a.getDom(this._map),
			type: "click",
			func: g
		}, {
			elem: a.getDom(this._map),
			type: "dblclick",
			func: e
		}, {
			elem: document,
			type: "mousemove",
			func: f
		}, {
			elem: document,
			type: "keydown",
			func: j
		}, {
			elem: a.getDom(this._map),
			type: "mouseup",
			func: i
		}];
		return true
	};
	d.prototype._dispatchLastEvent = function() {
		var e = new c.lang.Event("ondrawend");
		e.points = this._points ? this._points.slice(0) : [];
		e.overlays = this._paths ? this._paths.slice(0, this._paths.length - 1) : [];
		e.distance = this._getTotalDistance().toFixed(0);
		this.dispatchEvent(e)
	};
	d.prototype.close = function() {
		if (this._isOpen == false) {
			return
		}
		this._isOpen = false;
		BMapGLLib._toolInUse = false;
		if (this._mapMoving) {
			delete this._mapMoving
		}
		var g = this;
		g._dispatchLastEvent();
		if (g._points.length < 2) {
			g._clearCurData()
		} else {
			g._map.removeOverlay(g._paths[g._paths.length - 1]);
			g._paths[g._paths.length - 1] = null;
			g._paths.length = g._paths.length - 1;
			var h = g._points[g._points.length - 1];
			if (h.disLabel) {
				g._map.removeOverlay(h.disLabel)
			}
			g._processLastOp()
		}
		a.hide();
		for (var f = 0, e = this.bindFunc.length; f < e; f++) {
			c.un(this.bindFunc[f].elem, this.bindFunc[f].type, this.bindFunc[f].func)
		}
		if (g._movingTimerId) {
			clearInterval(g._movingTimerId);
			g._movingTimerId = null
		}
		if (this._followTitle) {
			this._followTitle.hide()
		}
	};
	d.prototype._clearCurData = function() {
		for (var f = 0, e = this._points.length; f < e; f++) {
			if (this._points[f].disLabel) {
				this._map.removeOverlay(this._points[f].disLabel)
			}
		}
		for (var f = 0, e = this._paths.length; f < e; f++) {
			this._map.removeOverlay(this._paths[f])
		}
		for (var f = 0, e = this._dots.length; f < e; f++) {
			this._map.removeOverlay(this._dots[f])
		}
		this._initData()
	};
	d.prototype._initData = function() {
		this._points.length = 0;
		this._paths.length = 0;
		this._segDistance.length = 0;
		this._dots.length = 0
	};
	d.prototype._setSegDistance = function(g, f) {
		if (!g || !f) {
			return
		}
		var e = this._map.getDistance(g, f);
		this._segDistance.push(e);
		return e
	};
	d.prototype._getTotalDistance = function() {
		var g = 0;
		for (var f = 0, e = this._segDistance.length; f < e; f++) {
			g += this._segDistance[f]
		}
		return g
	};
	d.prototype._convertUnit = function(e, f) {
		f = f || "metric";
		if (this._units[f]) {
			return e * this._units[f].conv
		}
		return e
	};
	d.prototype._addSecPoint = function(g) {
		var f = this._opts.secIcon ? this._opts.secIcon : new BMapGL.Icon("//huiyan.baidu.com/cms/images/mapctrls.png", new BMapGL
			.Size(12, 12), {
				imageSize: new BMapGL.Size(37, 442),
				imageOffset: new BMapGL.Size(25, 312),
			});
		var e = new BMapGL.Marker(g, {
			icon: f,
			clickable: false,
			baseZIndex: 3500000,
			zIndexFixed: true,
			enableMassClear: this._enableMassClear
		});
		this._map.addOverlay(e);
		this._dots.push(e)
	};
	d.prototype._formatDisStr = function(h) {
		var f = this._opts.unit;
		var g = this._units[f].u1;
		var e = this._convertUnit(h, f);
		if (e > this._units[f].incon) {
			e = e / this._units[f].incon;
			g = this._units[f].u2;
			e = e.toFixed(1)
		} else {
			e = e.toFixed(0)
		}
		return e + g
	};
	d.prototype._setCursor = function(f) {
		var e = /webkit/.test(navigator.userAgent.toLowerCase()) ? "url(" + f + ") 3 6, crosshair" : "url(" + f +
			"), crosshair";
		a._setCursor(e)
	};
	d.prototype._getCursor = function() {
		return this._opts.cursor
	};
	d.prototype._formatSegLabel = function(e, f) {
		e.setStyle({
			"border": "none",
			"padding": "0"
		});
		e.setContent("<span style='" + this._styles.BMapGLLib_diso + "'><span style='" + this._styles.BMapGLLib_disi + "'>" +
			f + "</span></span>")
	};
	d.prototype._processLastOp = function() {
		var i = this;
		delete i._bind.x;
		delete i._bind.y;
		delete i._bind.initX;
		delete i._bind.initY;
		if (i._paths.length > i._points.length - 1) {
			var g = i._paths.length - 1;
			i._map, removeOverlay(i._paths[g]);
			i._paths[g] = null;
			i._paths.length = g
		}
		var e = {};
		e.points = i._points.slice(0);
		e.paths = i._paths.slice(0);
		e.dots = i._dots.slice(0);
		e.segDis = i._segDistance.slice(0);
		var j = i._map.pointToPixel(e.points[e.points.length - 1]);
		var h = i._map.pointToPixel(e.points[e.points.length - 2]);
		var k = [0, 0];
		var f = [0, 0];
		if (j.y - h.y >= 0) {
			f = [-5, 11]
		} else {
			f = [-5, -35]
		}
		if (j.x - h.x >= 0) {
			k = [14, 0]
		} else {
			k = [-14, 0]
		}
		var n = e.points[e.points.length - 1];
		n.disLabel = new BMapGL.Label("", {
			offset: new BMapGL.Size(-15, -40),
			enableMassClear: i._enableMassClear
		});
		n.disLabel.setStyles({
			color: "#333",
			borderColor: "#ff0103"
		});
		i._map.addOverlay(n.disLabel);
		n.disLabel.setOffset(new BMapGL.Size(f[0], f[1]));
		n.disLabel.setPosition(n);
		i._formatTitle(2, "", "", n.disLabel);
		var m = this._opts.closeIcon ? this._opts.closeIcon : new BMapGL.Icon("//huiyan.baidu.com/cms/images/mapctrls.gif",
			new BMapGL.Size(12, 12), {
				imageSize: new BMapGL.Size(82, 174),
				imageOffset: new BMapGL.Size(0, 14)
			});
		e.closeBtn = new BMapGL.Marker(e.points[e.points.length - 1], {
			icon: m,
			offset: new BMapGL.Size(k[0], k[1]),
			baseZIndex: 3600000,
			enableMassClear: i._enableMassClear
		});
		i._map.addOverlay(e.closeBtn);
		e.closeBtn.setTitle("清除本次测距");
		e.closeBtn.addEventListener("click", function(r) {
			for (var p = 0, o = e.points.length; p < o; p++) {
				this.map.removeOverlay(e.points[p].disLabel);
				e.points[p].disLabel = null
			}
			for (var p = 0, o = e.paths.length; p < o; p++) {
				this.map.removeOverlay(e.paths[p]);
				e.paths[p] = null
			}
			for (var p = 0, o = e.dots.length; p < o; p++) {
				this.map.removeOverlay(e.dots[p]);
				e.dots[p] = null
			}
			this.map.removeOverlay(e.closeBtn);
			e.closeBtn = null;
			b(r);
			var q = new c.lang.Event("onremovepolyline");
			i.dispatchEvent(q)
		});
		i._initData()
	};
	d.prototype._formatTitle = function(g, l, e, i) {
		var h = i || this._followTitle;
		if (!h) {
			return
		}
		h.setStyle({
			"lineHeight": "16px",
			"zIndex": "85",
			"padding": "3px 5px"
		});
		var n = this._startFollowText || "";
		var k = [];
		if (g == 1) {
			h.setOffset(0, 25);
			var m = this._opts.unit;
			var j = this._units[m].u1;
			var f = this._convertUnit(e, m);
			if (f > this._units[m].incon) {
				f = f / this._units[m].incon;
				j = this._units[m].u2;
				f = f.toFixed(1)
			} else {
				f = f.toFixed(0)
			}
			k.push("<span>总长：<span style='" + this._styles.BMapGLLib_disBoxDis + "'>" + f + "</span>" + j + "</span><br />");
			k.push("<span style='color:#7a7a7a'>" + l + "</span>")
		} else {
			if (g == 2) {
				var m = this._opts.unit;
				var j = this._units[m].u1;
				var f = this._convertUnit(this._getTotalDistance(), m);
				if (f > this._units[m].incon) {
					f = f / this._units[m].incon;
					j = this._units[m].u2;
					f = f.toFixed(1)
				} else {
					f = f.toFixed(0)
				}
				k.push("总长：<span style='" + this._styles.BMapGLLib_disBoxDis + "'>" + f + "</span>" + j)
			} else {
				h.setOffset(0, 25);
				k.push(n)
			}
		}
		h.setContent(k.join(""))
	};
	d.prototype._updateInstDis = function(g, e) {
		var f = this._opts.unit;
		var i = this._units[f].u1;
		if (e > this._units[f].incon) {
			e = e / this._units[f].incon;
			i = this._units[f].u2;
			e = e.toFixed(1)
		} else {
			e = e.toFixed(0)
		}
		if (g) {
			var h = [];
			h.push("<span>总长：<span style='" + this._styles.BMapGLLib_disBoxDis + "'>" + e + "</span>" + i + "</span><br />");
			h.push("<span style='color:#7a7a7a'>" + this._opts.followText + "</span>");
			g.setContent(h.join(""))
		}
	};
	d.prototype._hideCurrent = function() {
		if (!this._isOpen) {
			return
		}
		if (this._paths.length > 0) {
			var e = this._paths[this._paths.length - 1];
			e.hide()
		}
		this._followTitle && this._followTitle.hide()
	};
	d.prototype._isPointValid = function(h) {
		if (!h) {
			return false
		}
		var f = this._map.getBounds();
		var e = f.getSouthWest(),
			g = f.getNorthEast();
		if (h.lng < e.lng || h.lng > g.lng || h.lat < e.lat || h.lat > g.lat) {
			return false
		}
		return true
	};
	var a = {
		_map: null,
		_html: "<div style='background:transparent url(http://api.map.baidu.com/images/blank.gif);position:absolute;left:0;top:0;width:100%;height:100%;z-index:1000' unselectable='on'></div>",
		_maskElement: null,
		_cursor: "default",
		_inUse: false,
		show: function(e) {
			if (!this._map) {
				this._map = e
			}
			this._inUse = true;
			if (!this._maskElement) {
				this._createMask(e)
			}
			this._maskElement.style.display = "block"
		},
		_createMask: function(g) {
			this._map = g;
			if (!this._map) {
				return
			}
			c.insertHTML(this._map.getContainer(), "beforeEnd", this._html);
			var f = this._maskElement = this._map.getContainer().lastChild;
			var e = function(h) {
				b(h);
				return c.preventDefault(h)
			};
			c.on(f, "mouseup", function(h) {
				if (h.button == 2) {
					e(h)
				}
			});
			c.on(f, "contextmenu", e);
			f.style.display = "none"
		},
		getDrawPoint: function(h, j) {
			h = window.event || h;
			var f = h.layerX || h.offsetX || 0;
			var i = h.layerY || h.offsetY || 0;
			var g = h.target || h.srcElement;
			if (g != a.getDom(this._map) && j == true) {
				while (g && g != this._map.getContainer()) {
					if (!(g.clientWidth == 0 && g.clientHeight == 0 && g.offsetParent && g.offsetParent.nodeName.toLowerCase() ==
							"td")) {
						f += g.offsetLeft;
						i += g.offsetTop
					}
					g = g.offsetParent
				}
			}
			if (g != a.getDom(this._map) && g != this._map.getContainer()) {
				return
			}
			if (typeof f === "undefined" || typeof i === "undefined") {
				return
			}
			if (isNaN(f) || isNaN(i)) {
				return
			}
			return this._map.pixelToPoint(new BMapGL.Pixel(f, i))
		},
		hide: function() {
			if (!this._map) {
				return
			}
			this._inUse = false;
			if (this._maskElement) {
				this._maskElement.style.display = "none";
				this._map.getContainer().removeChild(this._maskElement);
				this._maskElement = null
			}
		},
		getDom: function(e) {
			if (!this._maskElement) {
				this._createMask(e)
			}
			return this._maskElement
		},
		_setCursor: function(e) {
			this._cursor = e || "default";
			if (this._maskElement) {
				this._maskElement.style.cursor = this._cursor
			}
		}
	};

	function b(f) {
		var f = window.event || f;
		f.stopPropagation ? f.stopPropagation() : f.cancelBubble = true
	}
})();
