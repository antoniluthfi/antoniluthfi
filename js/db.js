let dbPromised = idb.open("football", 1, function(upgradeDb) {
    var objectStore = upgradeDb.createObjectStore('teams', {
        keyPath: 'id'
    });
    // objectStore.createIndex('teamName', 'teamName', { unique: false });
});

function addToFavorite(data) {
    dbPromised
        .then(db => {
            let tx = db.transaction('teams', 'readwrite');
            let store = tx.objectStore('teams');
            let dataFavorite = {
                id: data.id,
                name: data.name,
                crestUrl: data.crestUrl
            }
            console.log(data);
            store.put(dataFavorite);
            return tx.complete;
        })
        .then(() => {
            console.log("Tim berhasil di simpan ke daftar Favorit.");
            let message = `${data.name} berhasil ditambahkan ke daftar favorit`;

            if (Notification.permission === "granted") {
                M.Toast({ html: message });
                showNotification(message);
            } else {
                console.log('fitur notifikasi tidak diijinkan');
            }
        })
        .catch(err => {
            console.log(err)
        });
}

const deleteFromFavorite = (data) => {
    dbPromised
        .then(db => {
            let tx = db.transaction('teams', 'readwrite');
            let store = tx.objectStore('teams');

            store.delete(data.id);
            return tx.complete;
        })
        .then(() => {
            let message = `${data.name} dihapus dari daftar favorit`;

            if (Notification.permission === "granted") {
                M.Toast({ html: message });
                showNotification(message);
            } else {
                console.log('fitur notifikasi tidak diijinkan');
            }
        })
        .catch(err => {
            console.log(err)
        });
}

const getFavorite = () => {
    return new Promise((resolve, reject) => {
        dbPromised
            .then(db => {
                let tx = db.transaction('teams', "readonly");
                let store = tx.objectStore('teams');
                return store.getAll();
            })
            .then(data => {
                resolve(data);
            });
    });
}

const checkTheData = (id) => {
    return new Promise((resolve, reject) => {
      dbPromised
        .then(db => {
            let tx = db.transaction('teams', 'readwrite');
            let store = tx.objectStore('teams');
            return store.get(id);
        })
        .then(data => {
            if(data != undefined) resolve(true)
            else reject(false);
        });
    });
}

const showNotification = (body) => {
    const title = 'Favorite Team';
    const options = {
        'body': `${body}`,
        'icon': '../images/soccer-ball-grass-icon256x256.png',
        'badge': '../images/soccer-ball-grass-icon256x256.png'
    }
    if(Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, options);
        });
    } else {
        console.error('Fitur Notifikasi Tidak Diijinkan.');
    }
}