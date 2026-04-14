document.addEventListener("DOMContentLoaded", function () {
  // --- Close All Select ---
  function closeAllSelect(except) {
    const items = document.querySelectorAll(".select-items");
    const selected = document.querySelectorAll(".select-selected");
    for (let i = 0; i < selected.length; i++) {
      if (selected[i] !== except) {
        if (selected[i]) selected[i].classList.remove("select-arrow-active");
        if (items[i]) items[i].classList.add("select-hide");
      }
    }
  }
  document.addEventListener("click", closeAllSelect);

  // --- Custom Select Wrapper Initialization ---
  document.querySelectorAll(".custom-select-wrapper").forEach((wrapper) => {
    const select = wrapper.querySelector("select");
    const selected = wrapper.querySelector(".select-selected");
    const itemsContainer = wrapper.querySelector(".select-items");

    if (!select || !selected || !itemsContainer) return;

    // Clear existing items if any
    itemsContainer.innerHTML = "";

    // Create new items from select options
    Array.from(select.options).forEach((option, index) => {
      if (index === 0 && option.value === "") return; // Skip placeholder if it's the first option

      const itemDiv = document.createElement("div");
      itemDiv.textContent = option.textContent;
      
      // If this option is currently selected in the real select
      if (option.selected) {
          selected.textContent = option.textContent;
      }

      itemDiv.addEventListener("click", function (e) {
        e.stopPropagation();
        selected.textContent = this.textContent;
        select.selectedIndex = Array.from(select.options).findIndex(opt => opt.textContent === this.textContent);
        
        // Trigger change event on original select
        select.dispatchEvent(new Event("change"));
        
        closeAllSelect();
      });
      itemsContainer.appendChild(itemDiv);
    });

    selected.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllSelect(this);
      itemsContainer.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  });

  // --- Image Modal Swipe Handling ---
  function applyMouseSwipe(carouselEl) {
    if (!carouselEl) return;
    let startX = 0;
    let isDragging = false;

    carouselEl.addEventListener("mousedown", (e) => {
      startX = e.pageX;
      isDragging = true;
    });

    carouselEl.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const diff = e.pageX - startX;
      if (Math.abs(diff) > 50) {
        const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
        if (diff > 0) {
          carousel.prev();
        } else {
          carousel.next();
        }
        isDragging = false;
      }
    });

    carouselEl.addEventListener("mouseup", () => {
      isDragging = false;
    });

    carouselEl.addEventListener("mouseleave", () => {
      isDragging = false;
    });
  }

  // --- Image Modal Setup ---
  const imageModal = document.getElementById("imageModal");
  if (imageModal) {
    imageModal.addEventListener("shown.bs.modal", function () {
      const modalCarouselEl = document.getElementById("modalCarousel");
      if (modalCarouselEl) {
        applyMouseSwipe(modalCarouselEl);
      }
    });
  }

  // --- Music Player Setup ---
  let musicPlaylist = [];
  let currentAudio = null;
  let lastSongIndex = -1;

  fetch("musics/playlist.json")
    .then((res) => {
      if (!res.ok) throw new Error("Cannot load playlist");
      return res.json();
    })
    .then((data) => {
      musicPlaylist = data.map((song) => `musics/${song}`);
    })
    .catch((err) => console.error("Load playlist error:", err));

  function stopCurrentSong() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
  }

  function playRandomSong() {
    if (musicPlaylist.length === 0) return;
    stopCurrentSong();
    let index;
    do {
      index = Math.floor(Math.random() * musicPlaylist.length);
    } while (musicPlaylist.length > 1 && index === lastSongIndex);
    lastSongIndex = index;
    currentAudio = new Audio(musicPlaylist[index]);
    currentAudio.volume = 0.8;
    currentAudio.play().catch((err) => console.warn("Autoplay blocked:", err));
    currentAudio.onended = playRandomSong;
  }

  document.addEventListener("click", (event) => {
    const shuffleBtn = event.target.closest("#shuffle-music-btn");
    if (shuffleBtn) {
      document.querySelectorAll("audio").forEach((audioEl) => {
        audioEl.pause();
        audioEl.currentTime = 0;
      });
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      playRandomSong();
    }
  });
});
