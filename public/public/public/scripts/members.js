document.addEventListener("DOMContentLoaded", () => {

  // 馬フィルター
  const select = document.getElementById("horseId");
  const items = document.querySelectorAll(".timeline-item");

  select.addEventListener("change", () => {
    const value = select.value;
    items.forEach(item => {
      item.style.display = (!value || item.dataset.horse === value) ? "block" : "none";
    });
  });

  // 画像カルーセル用
  let currentIndex = 0;
  let currentImages = [];

  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  const closeBtn = document.querySelector(".close");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // 画像クリックでモーダル起動
  document.querySelectorAll(".timeline-images").forEach(group => {
    const imgs = Array.from(group.querySelectorAll(".timeline-img"));

    imgs.forEach((img, index) => {
      img.addEventListener("click", () => {
        currentImages = imgs.map(i => i.src);
        currentIndex = index;

        modal.style.display = "block";
        modalImg.src = currentImages[currentIndex];
      });
    });
  });

  // 左矢印（前へ）
  prevBtn.onclick = () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    modalImg.src = currentImages[currentIndex];
  };

  // 右矢印（次へ）
  nextBtn.onclick = () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    modalImg.src = currentImages[currentIndex];
  };

  // 閉じる
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // 背景クリックでも閉じる
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // スワイプ操作
  let startX = 0;

  modalImg.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  modalImg.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      } else {
        currentIndex = (currentIndex + 1) % currentImages.length;
      }
      modalImg.src = currentImages[currentIndex];
    }
  });

});
