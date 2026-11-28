(() => {
  "use strict";
  const data = window.ARTS_FEST_DATA;
  if (!data) return;
  const groups = data.groups || [];
  const scoring = data.scoring || {1:5,2:3,3:1};
  const stageEvents = data.stageEvents || [];
  const offStageEvents = data.offStageEvents || [];
  const $ = s => document.querySelector(s);
  const finished = events => events.filter(e => e.status === "finished");
  const allEvents = [
    ...stageEvents.map(e => ({...e, category:"stage"})),
    ...offStageEvents.map(e => ({...e, category:"offstage"}))
  ];
  const groupInfo = name => groups.find(g => g.name === name);
  const pointsFor = place => Number(scoring[place] || 0);
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function calculate(events) {
    const rows = groups.map(g => ({...g, points:0, wins:0, podiums:0}));
    finished(events).forEach(event => (event.winners || []).forEach(w => {
      const row = rows.find(r => r.name === w.group);
      if (!row) return;
      row.points += pointsFor(Number(w.place));
      if (Number(w.place) === 1) row.wins++;
      if (Number(w.place) <= 3) row.podiums++;
    }));
    return rows.sort((a,b) => b.points-a.points || b.wins-a.wins || b.podiums-a.podiums);
  }
  const sum = rows => rows.reduce((n,r) => n+r.points,0);
  const setText = (id,value) => { const el=document.getElementById(id); if(el) el.textContent=value; };

  function renderStandings(id, rows) {
    const el=document.getElementById(id); if(!el) return;
    const max=Math.max(1,...rows.map(r=>r.points));
    el.innerHTML=rows.map((r,i)=>`
      <article class="standing-card ${i===0 && r.points>0 ? "leader":""}">
        <div class="standing-topline">
          <span class="standing-rank">${String(i+1).padStart(2,"0")}</span>
          <span class="group-chip" style="--group:${r.color};--group-soft:${r.soft}"><i></i>${escapeHTML(r.name)} Group</span>
          ${i===0 && r.points>0 ? '<span class="leader-tag">LEADING</span>':""}
        </div>
        <div class="standing-score"><strong>${r.points}</strong><span>PTS</span></div>
        <div class="standing-bar"><span style="width:${r.points/max*100}%;--group:${r.color}"></span></div>
        <div class="standing-stats"><span><b>${r.wins}</b> wins</span><span><b>${r.podiums}</b> podiums</span></div>
      </article>`).join("");
  }

  function eventCard(event, category) {
    const done=event.status==="finished";
    const winners=(event.winners||[]).slice().sort((a,b)=>a.place-b.place);
    const medals={1:"1ST",2:"2ND",3:"3RD"};
    return `<article class="result-event">
      <div class="event-main">
        <span class="event-type ${category}">${category==="stage"?"STAGE EVENT":"OFF-STAGE EVENT"}</span>
        <h4>${escapeHTML(event.name)}</h4><span class="event-date">${escapeHTML(event.date||"Date not announced")}</span>
      </div>
      <div class="event-result">
        <span class="event-status ${done?"finished":"upcoming"}">${done?"COMPLETED":"UPCOMING"}</span>
        ${done && winners.length ? `<div class="event-winners">${winners.map(w=>{
          const g=groupInfo(w.group);
          return `<div class="winner-entry">
            <span class="winner-place">${medals[w.place]||("#"+w.place)}</span>
            <div class="winner-details">
              <strong>${escapeHTML(w.name||"Name not entered")}</strong>
              <span>${escapeHTML(w.class||"Class not entered")}</span>
            </div>
            <span class="winner-group" style="--group:${g?.color||"#8993a4"};--group-soft:${g?.soft||"#f0f2f6"}">${escapeHTML(w.group||"Group not entered")}</span>
            <small>+${pointsFor(Number(w.place))} pts</small>
          </div>`;
        }).join("")}</div>`:`<p class="no-results">${done?"No winner details entered yet.":"Results will appear after the event."}</p>`}
      </div>
    </article>`;
  }

  function renderEvents(id, events, category) {
    const el=document.getElementById(id); if(!el) return;
    el.innerHTML=events.length ? events.map(e=>eventCard(e,category)).join("") :
      `<div class="arts-empty"><span>✦</span><strong>No ${category==="stage"?"stage":"off-stage"} events added yet</strong><p>Add event details in <code>arts-data.js</code>.</p></div>`;
  }
  function renderHistory(filter="all") {
    const el=$("#full-history"); if(!el) return;
    const list=allEvents.filter(e=>e.status==="finished"&&(filter==="all"||e.category===filter));
    el.innerHTML=list.length ? list.map(e=>eventCard(e,e.category)).join("") :
      `<div class="arts-empty"><span>✦</span><strong>No completed results yet</strong><p>Completed events will appear here.</p></div>`;
  }
  function render() {
    const sr=calculate(stageEvents), or=calculate(offStageEvents), all=calculate([...stageEvents,...offStageEvents]);
    renderStandings("stage-standings",sr); renderStandings("offstage-standings",or); renderStandings("overall-standings",all);
    renderEvents("stage-events",stageEvents,"stage"); renderEvents("offstage-events",offStageEvents,"offstage"); renderHistory();
    const sd=finished(stageEvents), od=finished(offStageEvents), count=sd.length+od.length;
    setText("stage-event-count",`${sd.length} completed event${sd.length===1?"":"s"}`);
    setText("offstage-event-count",`${od.length} completed event${od.length===1?"":"s"}`);
    setText("overall-event-count",`${count} completed event${count===1?"":"s"}`);
    setText("stage-total",`${sum(sr)} pts`); setText("offstage-total",`${sum(or)} pts`);
    const leader=all[0];
    if(leader&&leader.points>0){setText("champion-name",`${leader.name} Group`);setText("champion-points",`${leader.points} points · ${leader.wins} event wins`);}
    else {setText("champion-name","Awaiting results");setText("champion-points","The overall champion will appear here");}
  }
  document.querySelectorAll(".arts-tab").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".arts-tab").forEach(t=>t.classList.toggle("active",t===btn));
    document.querySelectorAll(".arts-view").forEach(v=>v.classList.remove("active"));
    document.getElementById("view-"+btn.dataset.view)?.classList.add("active");
  }));
  document.querySelectorAll(".history-filter-btn").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".history-filter-btn").forEach(t=>t.classList.toggle("active",t===btn));
    renderHistory(btn.dataset.filter);
  }));
  render();
})();
