/* ============================================================
   AN in the Studios — Client Portal (front-end prototype)
   Sample data + local state. No backend: approvals persist in
   localStorage so the flow can be demoed end to end.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- Config & sample client ---------------- */
  var CONFIG = {
    passcode: 'MAREN',              // demo passcode (change per client)
    storeKey: 'anits_portal_v1'
  };

  var CLIENT = {
    name: 'Maren House',
    handle: 'marenhouse',
    initials: 'MH',
    category: 'Interior Design Studio',
    bioName: 'Maren House',
    bioLines: ['Considered interiors · London & Cotswolds', 'Residential · editorial · warm minimal'],
    link: 'marenhouse.co.uk',
    followers: 8420,
    following: 312,
    package: {
      tier: 'The Studio',
      focus: 'This month: launch the Cotswolds project story and grow saves with editorial carousels.',
      included: [
        { t: 'Editorial posts & carousels — 12 / month', done: true },
        { t: 'Short-form video from your footage — 4 / month', done: true },
        { t: 'Stories & light community engagement', done: true },
        { t: 'Monthly strategy call', done: false },
        { t: 'Monthly performance report', done: false }
      ]
    }
  };

  /* tones map to placeholder classes */
  var TONE = { stone: '', sage: ' ph--sage', clay: ' ph--clay', taupe: ' ph--taupe', espresso: ' ph--espresso' };

  /* ---------------- Sample content ----------------
     status: pending | approved | scheduled | posted | changes
     (approved/scheduled/posted show in the feed preview) */
  var POSTS = [
    // Posted (past) — carry real metrics
    { id: 'p1', type: 'carousel', tone: 'stone', date: '2026-07-03',
      caption: 'Where the morning light lands. A study in travertine, oak and quiet. #interiordesign #editorialinteriors',
      status: 'posted', m: { likes: 612, reach: 9840, saves: 288, comments: 41 } },
    { id: 'p2', type: 'post', tone: 'sage', date: '2026-07-08',
      caption: 'The green room, finally finished. Plaster walls that change all day. #interiors #londondesign',
      status: 'posted', m: { likes: 548, reach: 8210, saves: 201, comments: 33 } },
    { id: 'p3', type: 'reel', tone: 'taupe', date: '2026-07-12',
      caption: 'A slow walk through the Cotswolds project. Sound on. #reels #interiordesign',
      status: 'posted', m: { likes: 1290, reach: 21400, saves: 512, comments: 88 } },
    { id: 'p4', type: 'carousel', tone: 'clay', date: '2026-07-17',
      caption: 'Five ways we use brass without it shouting. Save this one. #designtips #interiors',
      status: 'posted', m: { likes: 734, reach: 12600, saves: 486, comments: 52 } },
    { id: 'p5', type: 'post', tone: 'espresso', date: '2026-07-22',
      caption: 'Detail: the reeded oak that runs the length of the hall. #craftsmanship #interiordesign',
      status: 'posted', m: { likes: 501, reach: 7890, saves: 173, comments: 27 } },
    { id: 'p6', type: 'reel', tone: 'stone', date: '2026-07-26',
      caption: 'Before and after — the reading corner. Which side are you? #beforeafter #interiors',
      status: 'posted', m: { likes: 968, reach: 17300, saves: 401, comments: 64 } },

    // Approved / scheduled (upcoming) — already in the feed preview
    { id: 'p7', type: 'carousel', tone: 'sage', date: '2026-07-31',
      caption: 'The Cotswolds kitchen, in six frames. #interiordesign #kitchendesign',
      status: 'scheduled', m: { likes: 0, reach: 0, saves: 0, comments: 0 } },
    { id: 'p8', type: 'post', tone: 'clay', date: '2026-08-04',
      caption: 'Colour drenching, done quietly. The clay study. #colourdrenching #interiors',
      status: 'approved', m: { likes: 0, reach: 0, saves: 0, comments: 0 } },

    // Pending your approval
    { id: 'p9', type: 'carousel', tone: 'taupe', date: '2026-08-07',
      caption: 'How we layer a room: a carousel on texture, from linen to travertine. #designtips #editorialinteriors',
      status: 'pending', m: { likes: 0, reach: 0, saves: 0, comments: 0 } },
    { id: 'p10', type: 'reel', tone: 'stone', date: '2026-08-11',
      caption: 'A day in the studio — sourcing stone for the next project. #behindthescenes #reels',
      status: 'pending', m: { likes: 0, reach: 0, saves: 0, comments: 0 } },
    { id: 'p11', type: 'post', tone: 'sage', date: '2026-08-14',
      caption: 'The garden room at golden hour. Sage, oak, and a lot of glass. #interiors #londondesign',
      status: 'pending', m: { likes: 0, reach: 0, saves: 0, comments: 0 } },
    { id: 'p12', type: 'carousel', tone: 'espresso', date: '2026-08-18',
      caption: 'Our process, start to finish — swipe through how a Maren House room comes together. #interiordesignprocess',
      status: 'pending', m: { likes: 0, reach: 0, saves: 0, comments: 0 } }
  ];

  /* weekly performance series (last 8 weeks, ending this week) */
  var WEEKS = [
    { w: 'Jun 2',  reach: 22400, eng: 3.9 },
    { w: 'Jun 9',  reach: 26800, eng: 4.2 },
    { w: 'Jun 16', reach: 24100, eng: 4.0 },
    { w: 'Jun 23', reach: 31200, eng: 4.6 },
    { w: 'Jun 30', reach: 35800, eng: 4.9 },
    { w: 'Jul 7',  reach: 41500, eng: 5.3 },
    { w: 'Jul 14', reach: 52300, eng: 5.8 },
    { w: 'Jul 21', reach: 58900, eng: 6.1 }
  ];

  /* ---------------- State (localStorage) ---------------- */
  var state = load();
  function load() {
    try { return JSON.parse(localStorage.getItem(CONFIG.storeKey)) || { authed: false, overrides: {} }; }
    catch (e) { return { authed: false, overrides: {} }; }
  }
  function save() { try { localStorage.setItem(CONFIG.storeKey, JSON.stringify(state)); } catch (e) {} }

  function statusOf(p) {
    var o = state.overrides[p.id];
    return (o && o.status) ? o.status : p.status;
  }
  function noteOf(p) { var o = state.overrides[p.id]; return o ? o.note : ''; }

  /* ---------------- Utilities ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function parseD(iso) { var a = iso.split('-'); return { y: +a[0], m: +a[1] - 1, d: +a[2] }; }
  function fmtDate(iso) { var p = parseD(iso); return p.d + ' ' + MON[p.m] + ' ' + p.y; }
  function fmtNum(n) {
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
    return '' + n;
  }
  function typeIcon(t) { return t === 'reel' ? '&#9654;' : t === 'carousel' ? '&#9635;' : ''; }
  function phHTML(tone, label) {
    return '<div class="ph' + (TONE[tone] || '') + '">' + (label ? '<span class="ph__label">' + label + '</span>' : '') + '</div>';
  }
  function captionHTML(text) {
    return text.replace(/#(\w+)/g, '<span class="tag">#$1</span>');
  }

  /* ---------------- Login gate ---------------- */
  var gate = $('#gate'), portal = $('#portal');
  function showPortal() {
    gate.classList.add('is-hidden');
    portal.classList.add('is-active');
    renderAll();
  }
  if (state.authed) { showPortal(); }

  $('#gate-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var val = $('#gate-input').value.trim().toUpperCase();
    if (val === CONFIG.passcode) {
      state.authed = true; save();
      $('#gate-error').textContent = '';
      showPortal();
    } else {
      $('#gate-error').textContent = 'That code doesn’t match. Try again, or email hello@aninthestudios.com.';
      $('#gate-input').value = '';
    }
  });

  $('#logout').addEventListener('click', function () {
    state.authed = false; save();
    portal.classList.remove('is-active');
    gate.classList.remove('is-hidden');
    $('#gate-input').value = '';
  });

  /* ---------------- Tabs ---------------- */
  $$('.ptab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var name = tab.getAttribute('data-tab');
      $$('.ptab').forEach(function (t) { t.classList.toggle('is-active', t === tab); });
      $$('.panel').forEach(function (p) { p.classList.toggle('is-active', p.id === 'panel-' + name); });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (name === 'insights') renderInsights(); // (re)draw charts when shown
    });
  });

  /* ---------------- Renderers ---------------- */
  function renderAll() {
    renderOverview();
    renderApprovals();
    renderFeed();
    renderCalendar();
    renderInsights();
    updateBadge();
  }

  function updateBadge() {
    var n = POSTS.filter(function (p) { return statusOf(p) === 'pending'; }).length;
    var badge = $('#approve-badge');
    badge.textContent = n;
    badge.style.display = n ? 'inline-block' : 'none';
  }

  /* ---- Overview ---- */
  function renderOverview() {
    var pending = POSTS.filter(function (p) { return statusOf(p) === 'pending'; }).length;
    var posted = POSTS.filter(function (p) { return statusOf(p) === 'posted'; });
    var reachSum = posted.reduce(function (a, p) { return a + p.m.reach; }, 0);
    var savesSum = posted.reduce(function (a, p) { return a + p.m.saves; }, 0);

    $('#ov-focus').innerHTML = CLIENT.package.focus;
    $('#ov-tier').textContent = CLIENT.package.tier;
    $('#ov-pkg').innerHTML = CLIENT.package.included.map(function (i) {
      return '<li class="' + (i.done ? 'done' : '') + '">' + i.t + '</li>';
    }).join('');

    $('#ov-stats').innerHTML = [
      statTile('Awaiting your approval', pending, pending ? 'Ready when you are' : 'All caught up', pending ? 'down' : 'up'),
      statTile('Posts this month', posted.length, 'On cadence', 'up'),
      statTile('Reach this month', fmtNum(reachSum), '↑ 34% vs last month', 'up'),
      statTile('Saves this month', fmtNum(savesSum), '↑ 28% vs last month', 'up')
    ].join('');
  }
  function statTile(label, value, delta, dir) {
    return '<div class="stat"><div class="stat__label">' + label + '</div>' +
      '<div class="stat__value">' + value + '</div>' +
      '<div class="stat__delta ' + dir + '">' + delta + '</div></div>';
  }

  /* ---- Approvals ---- */
  function renderApprovals() {
    var pending = POSTS.filter(function (p) { return statusOf(p) === 'pending'; });
    var resolved = POSTS.filter(function (p) {
      var s = statusOf(p); var o = state.overrides[p.id];
      return o && (s === 'approved' || s === 'changes');
    });

    var wrap = $('#approvals');
    if (!pending.length) {
      wrap.innerHTML = '<div class="empty-note" style="grid-column:1/-1"><p class="serif-note">Nothing waiting on you right now.</p><p class="caption" style="margin-top:12px">New posts will appear here as I prepare them.</p></div>';
    } else {
      wrap.innerHTML = pending.map(appCard).join('');
    }

    var res = $('#approvals-resolved');
    if (resolved.length) {
      res.style.display = 'block';
      $('#approvals-resolved-list').innerHTML = resolved.map(function (p) {
        var s = statusOf(p);
        return '<div class="appcard"><div class="appcard__media">' + phHTML(p.tone, p.type.toUpperCase()) +
          '</div><div class="appcard__body"><div class="appcard__meta">' + pill(s) +
          '<span class="appcard__date">' + fmtDate(p.date) + '</span></div>' +
          '<div class="appcard__resolved">' + (s === 'approved' ? 'Approved — scheduled to post.' : 'Changes requested.') +
          (noteOf(p) ? '<span class="note">“' + noteOf(p) + '”</span>' : '') +
          '<div style="margin-top:12px"><button class="btn-sm btn-sm--ghost" data-undo="' + p.id + '">Undo</button></div></div></div></div>';
      }).join('');
    } else { res.style.display = 'none'; }

    // wire actions
    $$('[data-approve]', wrap).forEach(function (b) { b.onclick = function () { approve(b.getAttribute('data-approve')); }; });
    $$('[data-changes-toggle]', wrap).forEach(function (b) {
      b.onclick = function () { $('#changes-' + b.getAttribute('data-changes-toggle')).classList.toggle('is-open'); };
    });
    $$('[data-changes-send]', wrap).forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-changes-send');
        requestChanges(id, $('#changes-note-' + id).value.trim());
      };
    });
    $$('[data-open]', wrap).forEach(function (c) { c.onclick = function (e) {
      if (e.target.closest('button')) return; openModal(c.getAttribute('data-open'));
    }; });
    $$('[data-undo]', res).forEach(function (b) { b.onclick = function () { undo(b.getAttribute('data-undo')); }; });
  }

  function appCard(p) {
    return '<div class="appcard">' +
      '<div class="appcard__media" data-open="' + p.id + '" style="cursor:pointer">' +
        phHTML(p.tone, '') +
        '<span class="appcard__type">' + p.type + '</span>' +
      '</div>' +
      '<div class="appcard__body">' +
        '<div class="appcard__meta">' + pill('pending') +
          '<span class="appcard__date">Planned ' + fmtDate(p.date) + '</span></div>' +
        '<p class="appcard__caption">' + captionHTML(p.caption) + '</p>' +
        '<div class="appcard__actions">' +
          '<button class="btn-sm btn-sm--primary" data-approve="' + p.id + '">Approve</button>' +
          '<button class="btn-sm" data-changes-toggle="' + p.id + '">Request changes</button>' +
        '</div>' +
        '<div class="changes-box" id="changes-' + p.id + '">' +
          '<textarea id="changes-note-' + p.id + '" placeholder="What would you like changed? (optional)"></textarea>' +
          '<button class="btn-sm btn-sm--primary" data-changes-send="' + p.id + '">Send request</button>' +
        '</div>' +
      '</div></div>';
  }

  function pill(s) {
    var map = {
      pending: ['pending', 'Awaiting approval'], approved: ['approved', 'Approved'],
      scheduled: ['scheduled', 'Scheduled'], posted: ['posted', 'Posted'], changes: ['changes', 'Changes requested']
    };
    var v = map[s] || ['scheduled', s];
    return '<span class="pill pill--' + v[0] + '"><span class="dot"></span>' + v[1] + '</span>';
  }

  function approve(id) {
    state.overrides[id] = { status: 'approved', note: '' }; save();
    renderApprovals(); renderFeed(); renderCalendar(); updateBadge();
    toast('Approved — it’s in your feed preview and scheduled to post.');
  }
  function requestChanges(id, note) {
    state.overrides[id] = { status: 'changes', note: note }; save();
    renderApprovals(); updateBadge();
    toast('Thanks — I’ll revise and send it back.');
  }
  function undo(id) {
    delete state.overrides[id]; save();
    renderApprovals(); renderFeed(); renderCalendar(); updateBadge();
    toast('Moved back to awaiting approval.');
  }

  /* ---- Instagram feed preview ---- */
  function renderFeed() {
    // profile numbers
    $('#ig-handle').textContent = CLIENT.handle;
    $('#ig-handle2').textContent = CLIENT.handle;
    $('#ig-followers').textContent = fmtNum(CLIENT.followers);
    $('#ig-following').textContent = CLIENT.following;
    $('#ig-avatar').textContent = CLIENT.initials;
    $('#ig-bio').innerHTML =
      '<div class="name">' + CLIENT.bioName + '</div>' +
      '<div class="cat">' + CLIENT.category + '</div>' +
      CLIENT.bioLines.map(function (l) { return '<div>' + l + '</div>'; }).join('') +
      '<div class="link">' + CLIENT.link + '</div>';

    // grid: approved/scheduled/posted, newest first
    var inFeed = POSTS.filter(function (p) {
      var s = statusOf(p); return s === 'posted' || s === 'scheduled' || s === 'approved';
    }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });

    $('#ig-count').textContent = inFeed.length;
    $('#ig-grid').innerHTML = inFeed.map(function (p) {
      var live = statusOf(p) === 'posted';
      return '<div class="ig-cell" data-open="' + p.id + '">' +
        phHTML(p.tone, '') +
        (typeIcon(p.type) ? '<span class="ig-cell__icon">' + typeIcon(p.type) + '</span>' : '') +
        '<div class="ig-cell__hover">' +
          (live ? '<span>&#9829; ' + fmtNum(p.m.likes) + '</span><span>&#128172; ' + p.m.comments + '</span>'
                : '<span style="font-size:11px;letter-spacing:1px;text-transform:uppercase">' + statusOf(p) + '</span>') +
        '</div></div>';
    }).join('');
    $$('#ig-grid .ig-cell').forEach(function (c) { c.onclick = function () { openModal(c.getAttribute('data-open')); }; });

    // side summary
    var upcoming = inFeed.filter(function (p) { return statusOf(p) !== 'posted'; }).length;
    $('#feed-summary').innerHTML =
      '<span class="pill pill--posted"><span class="dot"></span>' + inFeed.filter(function (p) { return statusOf(p) === 'posted'; }).length + ' posted</span> ' +
      '<span class="pill pill--scheduled"><span class="dot"></span>' + upcoming + ' upcoming</span>';
  }

  /* ---- Calendar ---- */
  var calView = { y: 2026, m: 6 }; // July 2026
  function renderCalendar() {
    $('#cal-month').textContent = MONTHS[calView.m] + ' ' + calView.y;
    var first = new Date(Date.UTC(calView.y, calView.m, 1)).getUTCDay(); // 0 Sun
    var offset = (first + 6) % 7; // make Monday first
    var days = new Date(Date.UTC(calView.y, calView.m + 1, 0)).getUTCDate();
    var byDay = {};
    POSTS.forEach(function (p) {
      var d = parseD(p.date);
      if (d.y === calView.y && d.m === calView.m) byDay[d.d] = p;
    });

    var cells = '';
    var dow = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    dow.forEach(function (d) { cells += '<div class="cal-dow">' + d + '</div>'; });
    for (var i = 0; i < offset; i++) cells += '<div class="cal-cell empty"></div>';
    for (var d = 1; d <= days; d++) {
      var p = byDay[d];
      var isToday = (calView.y === 2026 && calView.m === 6 && d === 29);
      cells += '<div class="cal-cell' + (isToday ? ' today' : '') + '">' +
        '<span class="num">' + d + '</span>' +
        (p ? '<div class="cal-post" data-open="' + p.id + '">' + phHTML(p.tone, '') +
             '<span class="cal-post__badge" style="background:' + statusColor(statusOf(p)) + '"></span></div>' : '') +
        '</div>';
    }
    $('#calendar').innerHTML = cells;
    $$('#calendar .cal-post').forEach(function (c) { c.onclick = function () { openModal(c.getAttribute('data-open')); }; });
  }
  function statusColor(s) {
    return s === 'posted' ? '#221B17' : s === 'scheduled' ? '#4A443E' : s === 'approved' ? '#6E7A5B' :
           s === 'pending' ? '#B08637' : '#A6553F';
  }
  $('#cal-prev').addEventListener('click', function () { calView.m--; if (calView.m < 0) { calView.m = 11; calView.y--; } renderCalendar(); });
  $('#cal-next').addEventListener('click', function () { calView.m++; if (calView.m > 11) { calView.m = 0; calView.y++; } renderCalendar(); });

  /* ---- Insights (SVG charts) ---- */
  function renderInsights() {
    var posted = POSTS.filter(function (p) { return statusOf(p) === 'posted'; });
    var totalReach = posted.reduce(function (a, p) { return a + p.m.reach; }, 0);
    var totalSaves = posted.reduce(function (a, p) { return a + p.m.saves; }, 0);
    var totalLikes = posted.reduce(function (a, p) { return a + p.m.likes; }, 0);
    var engRate = WEEKS[WEEKS.length - 1].eng;

    $('#ins-kpis').innerHTML = [
      statTile('Followers', fmtNum(CLIENT.followers), '↑ 412 this month', 'up'),
      statTile('Reach (30 days)', fmtNum(totalReach), '↑ 34% vs last month', 'up'),
      statTile('Engagement rate', engRate + '%', '↑ 1.4 pts vs last month', 'up'),
      statTile('Saves (30 days)', fmtNum(totalSaves), '↑ 28% vs last month', 'up')
    ].join('');

    drawArea($('#chart-reach'), WEEKS.map(function (w) { return { x: w.w, y: w.reach }; }), 'Weekly reach', function (v) { return fmtNum(v); });
    drawLine($('#chart-eng'), WEEKS.map(function (w) { return { x: w.w, y: w.eng }; }), 'Engagement rate', function (v) { return v + '%'; });

    // top posts by reach
    var top = posted.slice().sort(function (a, b) { return b.m.reach - a.m.reach; }).slice(0, 5)
      .map(function (p) { return { label: shortCap(p.caption), value: p.m.reach, sub: p.type }; });
    drawBars($('#chart-top'), top, function (v) { return fmtNum(v); });

    // content mix by type (avg reach)
    var types = ['reel', 'carousel', 'post'];
    var mix = types.map(function (t) {
      var g = posted.filter(function (p) { return p.type === t; });
      var avg = g.length ? Math.round(g.reduce(function (a, p) { return a + p.m.reach; }, 0) / g.length) : 0;
      return { label: t.charAt(0).toUpperCase() + t.slice(1) + 's', value: avg, sub: g.length + ' posts' };
    }).sort(function (a, b) { return b.value - a.value; });
    drawBars($('#chart-mix'), mix, function (v) { return fmtNum(v); });
  }
  function shortCap(c) { var s = c.replace(/#\w+/g, '').trim(); return s.length > 34 ? s.slice(0, 32) + '…' : s; }

  /* --- tiny SVG chart toolkit (single-series, direct-labelled) --- */
  var tip = null;
  function ensureTip() { if (!tip) { tip = document.createElement('div'); tip.className = 'chart-tip'; document.body.appendChild(tip); } return tip; }
  function showTip(x, y, label, val) {
    var t = ensureTip(); t.innerHTML = '<span class="t-label">' + label + '</span><b>' + val + '</b>';
    t.style.left = x + 'px'; t.style.top = y + 'px'; t.style.opacity = '1';
  }
  function hideTip() { if (tip) tip.style.opacity = '0'; }

  function drawArea(el, data, name, fmt) {
    var W = 640, H = 240, pad = { l: 44, r: 16, t: 16, b: 30 };
    var iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    var max = Math.max.apply(null, data.map(function (d) { return d.y; })) * 1.1;
    var xs = function (i) { return pad.l + (data.length === 1 ? iw / 2 : iw * i / (data.length - 1)); };
    var ys = function (v) { return pad.t + ih - (v / max) * ih; };
    var line = data.map(function (d, i) { return (i ? 'L' : 'M') + xs(i) + ' ' + ys(d.y); }).join(' ');
    var area = line + ' L' + xs(data.length - 1) + ' ' + (pad.t + ih) + ' L' + xs(0) + ' ' + (pad.t + ih) + ' Z';
    var grid = '', ticks = 4;
    for (var g = 0; g <= ticks; g++) {
      var gy = pad.t + ih * g / ticks, gv = max * (1 - g / ticks);
      grid += '<line class="grid-line" x1="' + pad.l + '" y1="' + gy + '" x2="' + (W - pad.r) + '" y2="' + gy + '"/>' +
              '<text class="axis-label" x="' + (pad.l - 8) + '" y="' + (gy + 4) + '" text-anchor="end">' + fmt(Math.round(gv)) + '</text>';
    }
    var xlab = data.map(function (d, i) { return '<text class="axis-label" x="' + xs(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + d.x + '</text>'; }).join('');
    var dots = data.map(function (d, i) {
      return '<circle cx="' + xs(i) + '" cy="' + ys(d.y) + '" r="9" fill="transparent" data-i="' + i + '"/>' +
             '<circle cx="' + xs(i) + '" cy="' + ys(d.y) + '" r="3.5" fill="var(--data)"/>';
    }).join('');
    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + name + '">' +
      grid +
      '<path d="' + area + '" fill="var(--data-soft)"/>' +
      '<path d="' + line + '" fill="none" stroke="var(--data)" stroke-width="2"/>' +
      xlab + dots + '</svg>';
    bindHover(el, data, name, fmt, xs, ys);
  }

  function drawLine(el, data, name, fmt) {
    var W = 640, H = 240, pad = { l: 44, r: 16, t: 16, b: 30 };
    var iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    var vals = data.map(function (d) { return d.y; });
    var max = Math.max.apply(null, vals) * 1.15, min = Math.min.apply(null, vals) * 0.85;
    var xs = function (i) { return pad.l + iw * i / (data.length - 1); };
    var ys = function (v) { return pad.t + ih - ((v - min) / (max - min)) * ih; };
    var line = data.map(function (d, i) { return (i ? 'L' : 'M') + xs(i) + ' ' + ys(d.y); }).join(' ');
    var grid = '', ticks = 4;
    for (var g = 0; g <= ticks; g++) {
      var gy = pad.t + ih * g / ticks, gv = min + (max - min) * (1 - g / ticks);
      grid += '<line class="grid-line" x1="' + pad.l + '" y1="' + gy + '" x2="' + (W - pad.r) + '" y2="' + gy + '"/>' +
              '<text class="axis-label" x="' + (pad.l - 8) + '" y="' + (gy + 4) + '" text-anchor="end">' + fmt(gv.toFixed(1)) + '</text>';
    }
    var xlab = data.map(function (d, i) { return '<text class="axis-label" x="' + xs(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + d.x + '</text>'; }).join('');
    var dots = data.map(function (d, i) {
      return '<circle cx="' + xs(i) + '" cy="' + ys(d.y) + '" r="9" fill="transparent" data-i="' + i + '"/>' +
             '<circle cx="' + xs(i) + '" cy="' + ys(d.y) + '" r="3.5" fill="var(--data)"/>';
    }).join('');
    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + name + '">' +
      grid + '<path d="' + line + '" fill="none" stroke="var(--data)" stroke-width="2"/>' + xlab + dots + '</svg>';
    bindHover(el, data, name, fmt, xs, ys);
  }

  function bindHover(el, data, name, fmt, xs, ys) {
    var svg = el.querySelector('svg');
    $$('circle[data-i]', svg).forEach(function (c) {
      c.style.cursor = 'pointer';
      c.addEventListener('mouseenter', function () {
        var i = +c.getAttribute('data-i'); var r = c.getBoundingClientRect();
        showTip(r.left + r.width / 2, r.top + r.height / 2, data[i].x + ' · ' + name, fmt(data[i].y));
      });
      c.addEventListener('mouseleave', hideTip);
    });
  }

  function drawBars(el, items, fmt) {
    var rowH = 46, W = 640, padL = 4, padR = 70, top = 8;
    var H = top * 2 + items.length * rowH;
    var max = Math.max.apply(null, items.map(function (d) { return d.value; })) || 1;
    var barMax = W - padL - padR - 140;
    var rows = items.map(function (d, i) {
      var y = top + i * rowH;
      var w = Math.max(3, (d.value / max) * barMax);
      return '<text class="bar-label" x="' + padL + '" y="' + (y + 16) + '">' + d.label + '</text>' +
        (d.sub ? '<text class="axis-label" x="' + padL + '" y="' + (y + 32) + '">' + d.sub + '</text>' : '') +
        '<rect x="140" y="' + (y + 6) + '" width="' + w + '" height="16" rx="4" fill="var(--data)" data-i="' + i + '"><title>' + fmt(d.value) + '</title></rect>' +
        '<text class="bar-value" x="' + (140 + w + 8) + '" y="' + (y + 19) + '">' + fmt(d.value) + '</text>';
    }).join('');
    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img">' + rows + '</svg>';
  }

  /* ---- Post detail modal ---- */
  var modal = $('#modal');
  function openModal(id) {
    var p = POSTS.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    var s = statusOf(p), live = s === 'posted';
    $('#modal-media').innerHTML = phHTML(p.tone, p.type.toUpperCase());
    $('#modal-handle').textContent = CLIENT.handle;
    $('#modal-av').textContent = CLIENT.initials;
    $('#modal-status').innerHTML = pill(s);
    $('#modal-cap').innerHTML = '<b>' + CLIENT.handle + '</b> ' + captionHTML(p.caption);
    $('#modal-date').textContent = (live ? 'Posted ' : 'Planned ') + fmtDate(p.date);
    $('#modal-metrics').innerHTML = live ? [
      metric(fmtNum(p.m.reach), 'Reach'), metric(fmtNum(p.m.likes), 'Likes'),
      metric(p.m.saves, 'Saves'), metric(p.m.comments, 'Comments'),
      metric(((p.m.likes + p.m.saves + p.m.comments) / p.m.reach * 100).toFixed(1) + '%', 'Engagement'),
      metric(p.type, 'Format')
    ].join('') : '<p class="caption" style="grid-column:1/-1">Performance will appear here once it’s live.</p>';
    modal.classList.add('is-open');
  }
  function metric(v, l) { return '<div class="m"><b>' + v + '</b><span>' + l + '</span></div>'; }
  $('#modal-close').addEventListener('click', closeModal);
  $('#modal-scrim').addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  function closeModal() { modal.classList.remove('is-open'); }

  /* ---- Toast ---- */
  var toastTimer;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('is-show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('is-show'); }, 3200);
  }

  /* ---- Demo reset ---- */
  var reset = $('#reset-demo');
  if (reset) reset.addEventListener('click', function () {
    state.overrides = {}; save(); renderAll(); toast('Demo reset — approvals cleared.');
  });
})();
