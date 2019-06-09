function ShowRap(res) {
  let mPhotoUrl = document.getElementById("mPhotoUrl");
  mPhotoUrl.src = res.data.photoUrl;

  let mName = document.getElementById("mName");
  mName.innerText = res.data.name;

  let mRating = document.getElementById("mRating");
  mRating.innerText = res.data.rating;

  let mDirector = document.getElementById("mDirector");
  mDirector.innerText = res.data.director;

  let mActor = document.getElementById("mActor");
  mActor.innerText = res.data.actor;

  let mGenre = document.getElementById("mGenre");
  mGenre.innerText = res.data.genre;

  let mIntroduce = document.getElementById("mIntroduce");
  mIntroduce.innerText = res.data.introduce;
}

async function ShowTicket(baseurl, id, id2, id3, tbody) {
  let cDate = document.getElementById("cDate");

  let res = await fetch(
    baseurl +
      "/api/movies/" +
      id +
      "/theaters/" +
      id2 +
      "/ticket_types/" +
      id3 +
      "?date=" +
      cDate.value
  );
  res = await res.json();
  if (res.data.length === 0) {
    return;
  }

  let tr = document.createElement("tr");
  tbody.appendChild(tr);

  let td1 = document.createElement("td");
  tr.appendChild(td1);
  res2 = await fetch(baseurl + "/api/ticket_types/" + id3);
  res2 = await res2.json();
  td1.innerText = res2.data.name;

  let td2 = document.createElement("td");
  tr.appendChild(td2);

  for (let i = 0; i < res.data.length; i += 1) {
    let btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-primary mr-2 mb-2 btn-normal";
    btn.innerText = res.data[i].time;
    td2.appendChild(btn);
  }
}

async function ShowTheater(baseurl, id, id2) {
  let res = await fetch(baseurl + "/api/count/ticket_types");
  res = await res.json();
  if (res.data === null) {
    return;
  }
  TICKET_TYPE_NUM = res.data;

  let root_div = document.getElementById("theater");

  let div = document.createElement("div");
  div.className = "container my-3 py-3 theater-secret";

  let row = document.createElement("div");
  row.className = "row";
  div.appendChild(row);

  let space = document.createElement("div");
  space.className = "col-md-1";
  row.appendChild(space);

  let div_col = document.createElement("div");
  div_col.className = "col-md-10 wrap-normal";
  row.appendChild(div_col);

  let span = document.createElement("span");
  span.className = "float-left wrap-inside-normal";
  div_col.appendChild(span);

  let spanV = document.createElement("span");
  spanV.className = "vertical-line mx-2";
  span.appendChild(spanV);

  let spanName = document.createElement("span");
  spanName.className = "h5 font-weight-bold mr-2";
  span.appendChild(spanName);

  res = await fetch(baseurl + "/api/theaters" + "/" + id2);
  res = await res.json();
  if (res.data === null) {
    return;
  }
  spanName.innerText = res.data.name;

  let table = document.createElement("table");
  table.className = "table table-borderless m-3";
  div_col.appendChild(table);

  let tbody = document.createElement("tbody");
  table.appendChild(tbody);

  for (let id3 = 1; id3 <= TICKET_TYPE_NUM; id3 += 1) {
    await ShowTicket(baseurl, id, id2, id3, tbody);
  }

  // if only inside has data
  if (tbody.innerHTML !== "") {
    root_div.appendChild(div);
  }
}

async function ShowTheaters(baseurl, id1) {
  res = await fetch(baseurl + "/api/count/theaters");
  res = await res.json();
  THEATER_NUM = res.data;

  for (let id2 = 1; id2 <= THEATER_NUM; id2 += 1) {
    await ShowTheater(baseurl, id1, id2);
  }
}

function HideTheaters() {
  theater = document.getElementById("theater");
  theater.innerHTML = "";
}

window.addEventListener("load", async function() {
  let baseurl = location.protocol + "//" + location.host;
  let id = location.href.split("/")[4];

  let res = await fetch(baseurl + "/api/movies" + "/" + id);
  res = await res.json();
  if (res.data === null) {
    return;
  }

  await ShowRap(res);

  let cDate = document.getElementById("cDate");
  cDate.valueAsDate = new Date();
  await ShowTheaters(baseurl, id);

  cDate.addEventListener("change", async () => {
    if (!cDate.value) {
      await HideTheaters();
      return;
    }
    await HideTheaters();
    await ShowTheaters(baseurl, id);
  });
});
