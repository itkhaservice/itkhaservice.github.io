// Logic Quay số may mắn (LUCKY SPIN)
document.addEventListener("DOMContentLoaded", () => {
  const number1 = document.getElementById("number1");
  const number2 = document.getElementById("number2");
  const number3 = document.getElementById("number3");
  const resultList = document.getElementById("result-list");
  const spinButtons = document.querySelectorAll(".spin-small");
  const manualSpinButton = document.querySelector(".manual-spin-button button");
  const priceElement = document.querySelector(".price");
  let selectedPrize = null;
  let spinsLeft = 0;
  
  // Lưu trạng thái từng giải thưởng
  const prizeStatus = {};

  // Modal hiển thị thông báo
  const modal = document.getElementById("notification-modal");
  const modalMessage = document.getElementById("modal-message");
  const closeModalButton = document.getElementById("close-modal");

  if(closeModalButton) {
    closeModalButton.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
  }

  function showModal(message) {
    if (modalMessage) {
        modalMessage.textContent = message;
        modal.classList.remove("hidden");
    }
  }

  // Cập nhật trạng thái giải thưởng được chọn
  function updateSelectedPrize(prize, count) {
    if (!prizeStatus[prize]) {
      prizeStatus[prize] = { spinsLeft: count, isCompleted: false };
    }
    selectedPrize = prize;
    spinsLeft = prizeStatus[prize].spinsLeft;
    if(priceElement) {
        priceElement.textContent = `Đã chọn: ${prize}. Số lần quay: ${spinsLeft}`;
    }
  }

  // Kiểm tra xem giải có còn lượt quay không
  function checkSpinAvailability() {
    if (!selectedPrize) {
      showModal("Vui lòng chọn một giải trước khi bấm quay!");
      return false;
    }
    if (prizeStatus[selectedPrize]?.isCompleted) {
      showModal(`${selectedPrize} đã hoàn tất quay. Vui lòng chọn giải khác!`);
      return false;
    }
    if (spinsLeft <= 0) {
      showModal(
        `Số lần quay cho ${selectedPrize} đã hết. Vui lòng chọn giải khác!`
      );
      return false;
    }
    return true;
  }

  // Tạo hiệu ứng quay số
  function animateNumbers(stopIndex) {
    return setInterval(() => {
      if (number1 && stopIndex < 1) number1.textContent = Math.floor(Math.random() * 10);
      if (number2 && stopIndex < 2) number2.textContent = Math.floor(Math.random() * 10);
      if (number3 && stopIndex < 3) number3.textContent = Math.floor(Math.random() * 10);
    }, 50);
  }

  // Hiển thị thông báo chúc mừng
  function showCongratulationsMessage(luckyNumber) {
    const modal = document.getElementById("congratulationsModal");
    const luckyNumberDisplay = document.getElementById("lucky-number-display");
    if(modal && luckyNumberDisplay) {
        luckyNumberDisplay.textContent = luckyNumber;
        modal.style.display = "block";

        setTimeout(() => {
          modal.style.display = "none";
        }, 5000);
    }
  }

  function playAudio() {
    const audioPlayer = document.getElementById("audio-player");
    if(audioPlayer) {
        audioPlayer.play();
        setTimeout(() => {
          audioPlayer.pause();
          audioPlayer.currentTime = 0;
        }, 3000);
    }
  }

  // Hàm chặn hành động mặc định của phím Enter
  function preventEnterKey(event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  // Hiển thị số may mắn và cập nhật trạng thái
  function displayLuckyNumber() {
    if(!number1 || !number2 || !number3) return;

    const luckyNumber = String(Math.floor(Math.random() * 491)).padStart(
      3,
      "0"
    );
    changeBackgroundColorWhite(number1);
    changeBackgroundColorWhite(number2);
    changeBackgroundColorWhite(number3);
    const [digit1, digit2, digit3] = luckyNumber;

    let interval = animateNumbers(0);

    setTimeout(() => {
      if(manualSpinButton) {
        manualSpinButton.disabled = true;
        manualSpinButton.style.backgroundColor = "#ccc";
        manualSpinButton.style.cursor = "not-allowed";
      }

      clearInterval(interval);
      number1.textContent = digit1;
      const audioPlayer1 = document.getElementById("audio-player1");
      if(audioPlayer1) audioPlayer1.play();
      changeBackgroundColor(number1);
      interval = animateNumbers(1);

      setTimeout(() => {
        clearInterval(interval);
        number2.textContent = digit2;
        if(audioPlayer1) audioPlayer1.play();
        changeBackgroundColor(number2);
        interval = animateNumbers(2);

        setTimeout(() => {
          clearInterval(interval);
          number3.textContent = digit3;
          if(audioPlayer1) changeBackgroundColor(number3);
          audioPlayer1.play();

          const prizeMapping = {
            "Giải đặc biệt": "one",
            "Giải nhất": "two",
            "Giải nhì": "three",
            "Giải ba": "four",
            "Giải khuyến khích": "five",
            "Giải phụ": "six",
          };
          const prizeCode = prizeMapping[selectedPrize];
          let resultItem = document.querySelector(`#result-${prizeCode}`);
          if (!resultItem) {
            resultItem = document.createElement("li");
            resultItem.id = `result-${prizeCode}`;
            resultItem.innerHTML = `<strong>${selectedPrize}: </strong><span class="lucky-numbers" style="color: #FFD700;"></span>`;
            if(resultList) resultList.appendChild(resultItem);
          }
          const luckyNumbersSpan = resultItem.querySelector(".lucky-numbers");
          luckyNumbersSpan.textContent += luckyNumbersSpan.textContent
            ? `, ${luckyNumber}`
            : luckyNumber;

          setTimeout(() => {
            showCongratulationsMessage(luckyNumber);
            playAudio();
          }, 1000);

          if(manualSpinButton) {
            manualSpinButton.disabled = false;
            manualSpinButton.style.backgroundColor = "yellow";
            manualSpinButton.style.cursor = "pointer";
          }

          spinsLeft--;
          prizeStatus[selectedPrize].spinsLeft = spinsLeft;

          if (spinsLeft === 0) {
            prizeStatus[selectedPrize].isCompleted = true;
            priceElement.textContent = `${selectedPrize} đã hoàn tất quay số!`;
          } else {
            priceElement.textContent = `Đã chọn: ${selectedPrize}. Còn lại: ${spinsLeft}`;
          }
        }, 1000);
      }, 1000);
    }, 1000);
  }

  // Xử lý quay/dừng
  let isSpinning = false;
  let spinningInterval;
  function handleSpinToggle() {
    if (!checkSpinAvailability()) return;
    if (!isSpinning) {
      isSpinning = true;
      manualSpinButton.textContent = "Dừng";
      spinningInterval = setInterval(() => {
        if(number1) number1.textContent = Math.floor(Math.random() * 10);
        if(number2) number2.textContent = Math.floor(Math.random() * 10);
        if(number3) number3.textContent = Math.floor(Math.random() * 10);
      }, 50);
    } else {
      isSpinning = false;
      manualSpinButton.textContent = "Quay";
      clearInterval(spinningInterval);
      displayLuckyNumber();
    }
  }

  if(manualSpinButton) {
    manualSpinButton.addEventListener("click", handleSpinToggle);
  }

  if(spinButtons) {
      spinButtons.forEach((button) => {
        const prize = button.getAttribute("data-prize");
        const count = parseInt(button.getAttribute("data-count"), 10);
        button.addEventListener("click", () => {
          const audioPlayer1 = document.getElementById("audio-player1");
          if(audioPlayer1) audioPlayer1.play();
          if (prizeStatus[prize]?.isCompleted) {
            showModal(`${prize} đã hoàn tất quay. Vui lòng chọn giải khác!`);
            return;
          }
          updateSelectedPrize(prize, count);
        });
        button.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
          }
        });
      });
  }
});

function changeBackgroundColor(element) {
  element.style.backgroundColor = "#FFD700";
}

function changeBackgroundColorWhite(element) {
  element.style.backgroundColor = "#fff";
}
