/*
  RUWWAD ARTS FEST 2026–27 — EDIT THIS FILE FOR RESULTS.

  Stage and Off-Stage events are entered separately.
  Every winner should include:
  - name: student's name
  - group: Red / Green / Blue / White
  - class: student's class (e.g. 1 BA Afzal-Ul-Ulama)

  Default points: 1st = 5, 2nd = 3, 3rd = 1.
*/
window.ARTS_FEST_DATA = {
  groups: [
    { name: "Red", color: "#ef5350", soft: "#fff0ef" },
    { name: "Green", color: "#21a675", soft: "#eaf8f1" },
    { name: "Blue", color: "#3978e8", soft: "#edf3ff" },
    { name: "White", color: "#8490a5", soft: "#f0f2f6" }
  ],
  scoring: { 1: 5, 2: 3, 3: 1 },

  // Only add programmes that belong to STAGE EVENTS here.
  stageEvents: [
    /*
    {
      name: "Mappilappattu",
      status: "finished",
      date: "2026-12-10",
      winners: [
        { place: 1, name: "Student Name", group: "Blue", class: "1 BA" },
        { place: 2, name: "Student Name", group: "Red", class: "2 BCom" },
        { place: 3, name: "Student Name", group: "Green", class: "1 BCom" }
      ]
    }
    */
  ],

  // Only add programmes that belong to OFF-STAGE EVENTS here.
  offStageEvents: [
    /*
    {
      name: "Poster Designing",
      status: "finished",
      date: "2026-12-10",
      winners: [
        { place: 1, name: "Student Name", group: "White", class: "3 BA" },
        { place: 2, name: "Student Name", group: "Blue", class: "2 BA" },
        { place: 3, name: "Student Name", group: "Red", class: "1 BCom" }
      ]
    }
    */
  ]
};
