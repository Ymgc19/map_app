const map = L.map('map').setView([35.68, 139.76], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.on('click', function (e) {
  const text = prompt("投稿内容を入力してください:");
  if (!text) return;

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.click();

  input.onchange = () => {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img = `<img src="${reader.result}" width="200"/>`;
      L.marker(e.latlng).addTo(map)
        .bindPopup(`<p>${text}</p>${img}`).openPopup();
    };
    reader.readAsDataURL(file); // ← base64として一時的に読み込む（保存されない）
  };
});
