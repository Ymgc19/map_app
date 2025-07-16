// 地図初期化（仙台周辺）
const map = L.map('map').setView([38.2688, 140.8721], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 地図クリックで投稿ダイアログ
map.on('click', function (e) {
  const text = prompt("投稿内容を入力してください:");
  if (!text) return;

  const imageUrl = prompt("画像のURLを貼ってください（任意）\n例: https://i.imgur.com/abc123.jpg");
  const content = `<p>${text}</p>` + (imageUrl ? `<img src="${imageUrl}" width="200">` : "");

  L.marker(e.latlng).addTo(map)
    .bindPopup(content)
    .openPopup();
});
