const base_url = "https://api.football-data.org/v2/";
const token = 'c618b0c7249d47d4977af3b85cd51fcc';
const liga = [
  ['Champions League', 2001, 'championsLeague', '/images/1.jpg'],
  ['Liga Spanyol', 2003, 'bundesLiga', '/images/2.jpg'],
  ['Liga Jerman', 2014, 'ligaBelanda', '/images/3.jpg'],
  ['Liga Inggris', 2021, 'primeraDivision', '/images/4.jpg'],
  ['Liga Belanda', 2002, 'laLiga', '/images/5.jpg'],
  ['Liga Prancis', 2015, 'ligaPrancis', '/images/6.jpg']
];

const urlLiga = {
  2001: `${base_url}competitions/${liga[0][1]}/standings`,
  2002: `${base_url}competitions/${liga[1][1]}/standings`,
  2003: `${base_url}competitions/${liga[2][1]}/standings`,
  2021: `${base_url}competitions/${liga[3][1]}/standings`,
  2014: `${base_url}competitions/${liga[4][1]}/standings`,
  2015: `${base_url}competitions/${liga[5][1]}/standings`
}
const urlTeamDetail = `${base_url}teams/`

// fungsi memuat liga di home
const getLiga = () => {
  let ligaHTML = '';
  liga.forEach(liga => {
    ligaHTML += `
    <div class="card-grid-space">
      <a class="card-2" href="#liga?id=${liga[1]}" style="--bg-img: url(${liga[3]})">
      <div>
        <h1>${liga[0]}</h1>
        <p>Menampilkan Klasemen ${liga[0]}</p>
      <div class="tags">
        <div class="tag">${liga[0]}</div>
      </div>
      </div>
      </a>
    </div>
    `;
  })
  document.getElementById('cards-wrapper').innerHTML = ligaHTML;
}

const fetchApi = url => {
  return fetch(url, {
      method: 'get',
      mode: 'cors',
      headers: {
        'X-Auth-Token': token
      }
    })
    .then(status)
    .then(json)
    .catch(error);
}

// Blok kode yang akan di panggil jika fetch berhasil
const status = (response) => {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
const json = (response) => {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
const error = (error) => {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
const getStandings = (id) => {
  console.log(id)
  league = urlLiga[id];
  console.log(league)
  if ("caches" in window) {
    caches.match(league).then(response => {
      if (response) {
        response.json().then(data => {
          showStandings(data);
        });
      }
    });
  }

  fetchApi(league).then(data => {
    showStandings(data);
  })
}

const getTeam = (id) => {
  let url = urlTeamDetail + id;
  if ("caches" in window) {
    caches.match(url).then(response => {
      if (response) {
        response.json().then(data => {
          showTeam(data);
          buttonAction(data);
        });
      }
    });
  }

  fetchApi(url).then(data => {
    showTeam(data);
    buttonAction(data);
  })
}

const showStandings = (data) => {
  let standingsHTML = '';
  let str = JSON.stringify(data).replace(/http:/g, 'https:');
  data = JSON.parse(str);
  data.standings[0].table.forEach(teamData => {
    standingsHTML += `
      <div class="card visible-1">
        <div class="card-content">
          <div class="row" style="margin-bottom:0">
            <div class="col s12 m5 center">
              <img style="width:60%" src="${teamData.team.crestUrl}" alt="${teamData.team.name}" onError="this.onerror=null; this.src='/images/default.png';" class="responsive-img" style="margin-right: 20px; margin-bottom: -6px; width: 22px; height: 22px;">
            </div>
            <div class="col s12 m7">
              <h4><a href="#team?id=${teamData.team.id}"><b>${teamData.position}. ${teamData.team.name}</b></a></h4>
              <table>
                <tr>
                  <th>Play</th>
                  <th>Win</th>
                  <th>Draw</th>
                  <th>Lose</th>
                  <th>Points</th>
                </tr>
                <tr>
                  <td>${teamData.playedGames}</td>
                  <td>${teamData.won}</td>
                  <td>${teamData.draw}</td>
                  <td>${teamData.lost}</td>
                  <td>${teamData.points}</td>  
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>`;
    })
  document.getElementById('table-wrapper').innerHTML = standingsHTML;
}


const showTeam = (data) => {
  let teamHTML = '';

  teamHTML += `
    <div class="card tambahan">
      <h5><b>${data.name}(${data.tla || '-'})</b></h5>
      <img style="width:60%" src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="${data.name}" onError="this.onerror=null; this.src='/images/default.png';" class="responsive-img center"><br>
      <br>
      <table class="striped" style="margin-bottom: 10px;">
        <tr>
          <th>Country</th>
          <td>${data.area.name}</td>
        </tr>
        <tr>
          <th>Founded</th>
          <td>In ${data.founded}</td>
        </tr>
        <tr>
          <th>Team Color</th>
          <td>${data.clubColors}</td>
        </tr>
        <tr>
          <th>Stadium</th>
          <td>${data.venue} <a target="_blank" href="https://www.google.com/search?q=${data.venue}"><i class="material-icons">open_in_new</i></a></td>
        </tr>
        <tr>
          <th>Official Website</th>
          <td><a href="${data.website}" target="_blank">${data.website}</a></td>
        </tr>
      </table>
      <center>
        <button class="btn red waves-effect waves-light" id="btnDelete"><i class="material-icons left">delete</i>Delete From Favorite</button>
        <button class="btn indigo waves-effect waves-light" id="btnSave"><i class="material-icons left">add</i>Add To Favorite</button>
      </center>
    </div>
    `;
  teamHTML += `
      <div class="card">
        <h3>Player List</h3>
        <table class="centered #ffff white striped responsive-table" width="500">
          <thead class="indigo lighten-4">
            <tr>
              <th>Shirt</th>
              <th>Name</th>
              <th>Pos</th>
              <th>Nat</th>
            </tr>
          </thead>
          </tbody>
    `;
  data.squad.forEach(teamData => {
    teamHTML += `
      <tr>
        <td>${teamData.shirtNumber || '-'}</td>
        <td>${teamData.name}</td>
        <td>${teamData.position || '-'}</td>
        <td>${teamData.nationality || '-'}</td>
      </tr>
    `;
  });
  teamHTML += '</tbody></table></div>'
  document.getElementById('team-wrapper').innerHTML = teamHTML;
}

const getFavoriteTeam = () => {
  let dbTeamData = getFavorite();
  dbTeamData.then(data => {
    let teamBodyHtml = '';
    if (data.length > 0) {
      data.forEach(teamData => {
        teamBodyHtml += `
        <div class="tambahan-2">
          <div class="row" style="margin-bottom:0">
            <div class="col s12">
              <img style="width:50%" src="${teamData.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="${teamData.name}" onError="this.onerror=null; this.src='/images/default.png';" class="responsive-img" style="margin-right: 20px; margin-bottom: -6px; width: 22px; height: 22px;">
              <h4 class="text"><a href="#team?id=${teamData.id}"><b>${teamData.name}</b></a></h4>  
            </div>
          </div>
        </div>`;
      });
    } else {
      teamBodyHtml = '<h6>Belum ada tim favorit ditambahkan</h6>';
    }
    document.getElementById("favoriteBody").innerHTML = teamBodyHtml;
  });
}

const buttonAction = (data) => {
  let btnSave = document.getElementById("btnSave");
  let btnDelete = document.getElementById("btnDelete");

  checkTheData(data.id).then(() => {
    btnSave.style.display = "none";
    btnDelete.style.display = "block";
  }).catch(() => {
    btnSave.style.display = "block";
    btnDelete.style.display = "none";
  });

  btnSave.onclick = () => {
    addToFavorite(data);
    M.toast({html: `${data.name} berhasil ditambahkan ke Favorite!`});
    btnSave.style.display = "none";
    btnDelete.style.display = "block";
    if (Notification.permission === 'granted') {
			navigator.serviceWorker.ready.then(function(registration) {
				registration.showNotification(`${data.name} berhasil ditambahkan ke Favorite!`);
      });
    }
  };

  btnDelete.onclick = () => {
    deleteFromFavorite(data);
    M.toast({html: `${data.name} berhasil dihapus dari Favorite!`});
    btnSave.style.display = "block";
    btnDelete.style.display = "none";
  }
}