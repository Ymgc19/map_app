const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    location.href = "login.html";
  } else {
    const map = L.map('map').setView([35.68, 139.76], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // 投稿読み込み
    firebase.firestore().collection("posts").get().then(snapshot => {
      snapshot.forEach(doc => {
        const d = doc.data();
        L.marker([d.lat, d.lng]).addTo(map)
          .bindPopup(`<p>${d.text}</p><img src="${d.imageUrl}" width="200" />`);
      });
    });

    // 投稿作成
    map.on('click', e => {
      const text = prompt("投稿内容:");
      if (!text) return;
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        const file = input.files[0];
        const ref = firebase.storage().ref(`images/${file.name}`);
        await ref.put(file);
        const url = await ref.getDownloadURL();
        await firebase.firestore().collection("posts").add({
          uid: user.uid,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          text,
          imageUrl: url,
          createdAt: new Date()
        });
        location.reload();
      };
      input.click();
    });
  }
});

function logout() {
  firebase.auth().signOut().then(() => location.href = "login.html");
}
