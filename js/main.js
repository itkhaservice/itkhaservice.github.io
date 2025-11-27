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

    document.getElementById('sendBtn').addEventListener('click', async function () {
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
