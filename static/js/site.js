// Footer scene: an ASCII swell over a kelp bed, with salmon swimming through.
// Static when reduced motion is preferred.
(function () {
  var el = document.querySelector(".wave");
  if (!el) return;
  var levels = "_.-~^";
  var ROWS = 6; // row 0 surface, rows 1..4 water, row 5 seafloor
  var FLOOR = ROWS - 1;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Deterministic pseudo-random so the scene doesn't reshuffle on resize.
  function rand(n) {
    var x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function measure() {
    var probe = document.createElement("span");
    probe.textContent = "0";
    el.appendChild(probe);
    var ch = probe.getBoundingClientRect().width || 8;
    el.removeChild(probe);
    return Math.max(16, Math.floor(el.clientWidth / ch));
  }

  var cols, stalks, floor, salmon;
  function layout() {
    cols = measure();

    stalks = [];
    for (var c = 3 + Math.floor(rand(1) * 4), i = 0; c < cols - 2; i++) {
      stalks.push({
        col: c,
        height: 2 + Math.floor(rand(i + 7) * (FLOOR - 2)), // 2..4 rows tall
        phase: rand(i + 13) * Math.PI * 2,
      });
      c += 6 + Math.floor(rand(i + 29) * 9);
    }

    floor = "";
    for (var f = 0; f < cols; f++) {
      var r = rand(f + 101);
      floor += r < 0.08 ? "." : r < 0.14 ? "," : r < 0.18 ? "o" : "_";
    }

    // Keep existing fish across resizes; just add or drop to fit the width.
    salmon = salmon || [];
    var count = Math.max(1, Math.round(cols / 35));
    while (salmon.length < count) {
      var n = salmon.length;
      var y = 1 + rand(n + 41) * (FLOOR - 2);
      salmon.push({
        x: rand(n + 53) * (cols - 4),
        y: y,
        targetY: y,
        vx: rand(n + 43) < 0.5 ? 1 : -1,
        dir: rand(n + 43) < 0.5 ? 1 : -1,
        speed: 1.5 + rand(n + 47) * 1.5,
        nextTurn: 2 + rand(n + 59) * 4,
      });
    }
    salmon.length = count;
    salmon.forEach(function (f) { f.x = Math.min(f.x, cols - 4); });
  }

  // Wander: cruise, drift between depths, and now and then double back.
  // Turns ease through zero speed so they read as a fish turning around.
  function swim(dt) {
    salmon.forEach(function (f) {
      f.nextTurn -= dt;
      if (f.nextTurn <= 0) {
        if (Math.random() < 0.45) f.dir = -f.dir;
        f.targetY = 1 + Math.random() * (FLOOR - 2);
        f.nextTurn = 2 + Math.random() * 5;
      }
      if (f.x < 1) f.dir = 1;
      if (f.x > cols - 4) f.dir = -1;

      f.vx += (f.dir * f.speed - f.vx) * Math.min(1, dt * 1.5);
      f.x += f.vx * dt;
      f.y += (f.targetY - f.y) * Math.min(1, dt * 0.8);
    });
  }

  function render(t) {
    var grid = [], cls = [];
    for (var r = 0; r < ROWS; r++) {
      grid.push(new Array(cols).fill(" "));
      cls.push(new Array(cols).fill(""));
    }

    function put(r, c, ch, k) {
      if (c < 0 || c >= cols) return;
      grid[r][c] = ch;
      cls[r][c] = k;
    }
    function putStr(r, c, str, k) {
      for (var i = 0; i < str.length; i++) put(r, c + i, str[i], k);
    }

    for (var i = 0; i < cols; i++) {
      var y = Math.sin(i * 0.28 + t) * 0.6 + Math.sin(i * 0.11 - t * 0.6) * 0.4;
      grid[0][i] = levels[Math.round(((y + 1) / 2) * (levels.length - 1))];
      grid[FLOOR][i] = floor[i];
      cls[FLOOR][i] = "f";
    }

    stalks.forEach(function (s) {
      // Sway grows toward the tip; d is height above the floor.
      function offset(d) {
        return Math.sin(t * 0.7 + s.phase + d * 0.6) * (d / FLOOR) * 1.6;
      }
      var prev = offset(0);
      for (var d = 0; d < s.height; d++) {
        var off = offset(d), lean = off - prev;
        put(FLOOR - 1 - d, s.col + Math.round(off), lean > 0.2 ? "/" : lean < -0.2 ? "\\" : "|", "k");
        prev = off;
      }
      var tipRow = FLOOR - 1 - s.height, tipCol = s.col + Math.round(offset(s.height));
      put(tipRow, tipCol, "o", "k");
      if (tipRow === 0) {
        // Blades trail downstream from the surface bulb.
        var dir = offset(s.height) >= 0 ? 1 : -1;
        put(0, tipCol + dir, "~", "k");
        put(0, tipCol + dir * 2, "~", "k");
      }
    });

    salmon.forEach(function (f) {
      var row = Math.min(FLOOR - 1, Math.max(1, Math.round(f.y)));
      putStr(row, Math.round(f.x), f.vx >= 0 ? "><>" : "<><", "s");
    });


    function esc(ch) {
      return ch === "<" ? "&lt;" : ch === ">" ? "&gt;" : ch === "&" ? "&amp;" : ch;
    }
    el.innerHTML = grid.map(function (row, r) {
      var out = "";
      for (var c = 0; c < cols; c++) {
        var ch = esc(row[c]);
        out += cls[r][c] ? '<span class="' + cls[r][c] + '">' + ch + "</span>" : ch;
      }
      return out;
    }).join("\n");
  }

  layout();
  var t0 = 0;
  window.addEventListener("resize", function () { layout(); render(t0); });
  if (reduce) { render(0); return; }

  var last = 0;
  function tick(now) {
    if (now - last > 120) {
      var t = now / 900;
      swim(Math.min(t - t0, 0.5)); // cap the step after a backgrounded tab
      t0 = t;
      render(t0);
      last = now;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
