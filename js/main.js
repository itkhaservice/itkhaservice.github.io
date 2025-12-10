document.addEventListener("DOMContentLoaded", function() {
  function closeAllSelect(except) {
    const items = document.querySelectorAll(".select-items");
    const selected = document.querySelectorAll(".select-selected");
    for (let i = 0; i < selected.length; i++) {
      if (selected[i] !== except) {
        selected[i].classList.remove("select-arrow-active");
        items[i].classList.add("select-hide");
      }
    }
  }

  document.querySelectorAll(".custom-select-wrapper").forEach(wrapper => {
    const nativeSelect = wrapper.querySelector("select");
    const selectedDiv = wrapper.querySelector(".select-selected");
    const itemsDiv = wrapper.querySelector(".select-items");

    if (!nativeSelect || !selectedDiv || !itemsDiv) return;

    for (const option of nativeSelect.options) {
      const item = document.createElement("DIV");
      item.innerHTML = option.innerHTML;
      if (option.selected) {
        item.classList.add("same-as-selected");
        selectedDiv.innerHTML = option.innerHTML;
      }

      item.addEventListener("click", function() {
        const currentSelected = itemsDiv.querySelector(".same-as-selected");
        if (currentSelected) {
          currentSelected.classList.remove("same-as-selected");
        }
        this.classList.add("same-as-selected");

        nativeSelect.value = option.value;
        nativeSelect.dispatchEvent(new Event('change'));

        selectedDiv.innerHTML = this.innerHTML;
        itemsDiv.classList.add("select-hide");
        selectedDiv.classList.remove("select-arrow-active");
      });
      itemsDiv.appendChild(item);
    }

    selectedDiv.addEventListener("click", function(e) {
      e.stopPropagation();
      closeAllSelect(this);
      itemsDiv.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  });

  document.addEventListener("click", closeAllSelect);
});

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyCg4xq3QxjSbZTpuCj8HCAjyj0xe_BsQXZzZgRmHuEM0BQ9jFW7Y1OkSITlmqGrjiE/exec";
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
  sendBtn.addEventListener('click', async function () {
    const project = document.getElementById('project').value.trim();
    const fileInput = document.getElementById('file');
    const msg = document.getElementById('msg');

    msg.style.color = 'red'; // Default to red for errors
    msg.textContent = ''; // Clear previous message

    // --- Start Validation ---
    if (!project) {
      msg.textContent = 'Vui lòng chọn dự án.';
      return;
    }
    if (!fileInput.files || fileInput.files.length === 0) {
      msg.textContent = 'Vui lòng chọn file.';
      return;
    }
    if (fileInput.files.length > 1) {
      msg.textContent = 'Chỉ được phép gửi 1 file mỗi lần.';
      return;
    }

    const file = fileInput.files[0];

    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    const allowedExtensions = ['xls', 'xlsx', 'xlsm'];

    if (!allowedExtensions.includes(fileExtension)) {
      msg.textContent = 'Lỗi: Chỉ chấp nhận tệp tin Excel (.xls, .xlsx, .xlsm).';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      msg.textContent = 'Lỗi: Kích thước tệp tin không được vượt quá 100MB.';
      return;
    }
    // --- End Validation ---

    const reader = new FileReader();
    reader.onload = async function(e) {
      const base64Data = e.target.result.split(',')[1];

      const formData = new FormData();
      formData.append('project', project);
      formData.append('fileName', file.name);
      formData.append('fileBlob', base64Data);

      msg.textContent = 'Đang gửi...';
      msg.style.color = 'green'; // Green for "Đang gửi..."

      try {
        const res = await fetch(WEB_APP_URL, { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok && data.status === "ok") {
          msg.style.color = 'green';
          msg.textContent = 'Gửi thành công!';
          fileInput.value = "";
        } else {
          msg.style.color = 'red';
          msg.textContent = 'Lỗi: ' + (data.message || JSON.stringify(data));
        }
      } catch(err) {
        msg.style.color = 'red';
        msg.textContent = 'Lỗi mạng hoặc server: ' + err.message;
      }
    };
    reader.readAsDataURL(file);
  });
}

// Image Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
  const imageModal = document.getElementById('imageModal');
  if (imageModal) {
    const modalImage = document.getElementById('modalImage');
    const imageModalLabel = document.getElementById('modalImageLabel');
    
    // Set image src and alt when modal is opened
    imageModal.addEventListener('show.bs.modal', function (event) {
      const button = event.relatedTarget; // Button that triggered the modal
      const imageUrl = button.getAttribute('data-image-full');
      const imageAlt = button.getAttribute('alt');
      
      modalImage.src = imageUrl;
      imageModalLabel.textContent = imageAlt;
      
      // Ensure image is reset to default state (no transform)
      modalImage.style.transform = 'none';
      modalImage.style.cursor = 'default';
    });

    // Reset transform on modal close to ensure next image opens correctly
    imageModal.addEventListener('hidden.bs.modal', function () {
      modalImage.style.transform = 'none';
      modalImage.style.cursor = 'default';
    });
  }
});

// Highlight and center for all anchor links
document.addEventListener('DOMContentLoaded', function() {
  const anchorLinks = document.querySelectorAll('.container a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Don't intercept bootstrap components
      if (e.target.closest('[data-bs-toggle="modal"]')) {
        return;
      }
      
      e.preventDefault(); // Prevent default jump
      
      const targetId = this.getAttribute('href');
      
      try {
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Calculate the position to scroll to
          const elementRect = targetElement.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);

          // Scroll to the calculated position
          window.scrollTo({
              top: middle,
              behavior: 'smooth'
          });

          // Update the URL hash without jumping
          if(history.pushState) {
            history.pushState(null, null, targetId);
          } else {
            location.hash = targetId;
          }

          // Remove highlight from any other highlighted element first
          document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
          
          // Add highlight class to the new target
          targetElement.classList.add('highlight');

          // Remove the class after the animation completes
          setTimeout(() => {
            targetElement.classList.remove('highlight');
          }, 2000); // Must match animation duration in CSS
        }
      } catch (err) {
        console.error("Error scrolling to target:", targetId, err);
      }
    });
  });
});

// Back to Menu button visibility
document.addEventListener('DOMContentLoaded', function() {
  const backToMenuBtn = document.getElementById('back-to-menu');
  const scrollThreshold = 300; // Show button after scrolling 300px

  if (backToMenuBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > scrollThreshold) {
        backToMenuBtn.classList.add('show');
      } else {
        backToMenuBtn.classList.remove('show');
      }
    });
  }
});

// Copy to Clipboard Functionality
document.addEventListener('DOMContentLoaded', function() {
  const copyButtons = document.querySelectorAll('.code-copy-block .copy-button');

  copyButtons.forEach(copyButton => {
    const codeToCopyElement = copyButton.previousElementSibling; // The <code> tag
    
    if (codeToCopyElement && codeToCopyElement.classList.contains('copyable-code-string')) {
      copyButton.addEventListener('click', async function() {
        const textToCopy = codeToCopyElement.textContent || codeToCopyElement.innerText;

        try {
          await navigator.clipboard.writeText(textToCopy);
          const originalText = copyButton.textContent;
          copyButton.textContent = 'Đã sao chép!';
          setTimeout(() => {
            copyButton.textContent = originalText;
          }, 2000); // Revert after 2 seconds
        } catch (err) {
          console.error('Không thể sao chép văn bản: ', err);
          // Fallback for older browsers or non-secure contexts
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed'; // Avoid scrolling to bottom
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand('copy');
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Đã sao chép!';
            setTimeout(() => {
              copyButton.textContent = originalText;
            }, 2000);
          } catch (execErr) {
            console.error('Fallback: Không thể sao chép văn bản', execErr);
            alert('Không thể sao chép tự động. Vui lòng sao chép thủ công: ' + textToCopy);
          } finally {
            document.body.removeChild(textArea);
          }
        }
      });
    }
  });
});