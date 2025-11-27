(function() {
    const PASSWORD = "9999";

    // This function runs on every protected page load
    function initPasswordProtection() {
        // Blur the content initially
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.classList.add('content-blurred');
        }
        
        // Create and show the password overlay
        createOverlay();
    }

    function createOverlay() {
        // Prevent creating multiple overlays
        if (document.getElementById('password-overlay')) {
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'password-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1050;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: relative;
            background-color: #fff;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            text-align: center;
            width: 90%;
            max-width: 350px;
        `;

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 1.5rem;
            font-weight: 700;
            line-height: 1;
            color: #000;
            text-shadow: 0 1px 0 #fff;
            opacity: 0.5;
            background: transparent;
            border: 0;
            cursor: pointer;
        `;
        closeButton.onclick = function() {
            window.location.href = 'index.html';
        };
        closeButton.onmouseover = function() { this.style.opacity = '1'; };
        closeButton.onmouseout = function() { this.style.opacity = '0.5'; };


        const title = document.createElement('h4');
        title.textContent = 'Yêu cầu truy cập';
        title.style.marginBottom = '1rem';
        title.style.fontWeight = '600';

        const form = document.createElement('form');
        form.onsubmit = function(e) {
            e.preventDefault();
            checkPassword();
        };

        const input = document.createElement('input');
        input.type = 'password';
        input.id = 'password-input';
        input.placeholder = 'Nhập mật khẩu';
        input.autocomplete = 'current-password';
        input.style.cssText = `
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ccc;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
        `;

        const button = document.createElement('button');
        button.type = 'submit';
        button.textContent = 'Xác nhận';
        button.style.cssText = `
            width: 100%;
            padding: 0.75rem;
            border: none;
            border-radius: 8px;
            background-color: var(--accent-color, #007bff);
            color: #fff;
            font-weight: 600;
            cursor: pointer;
        `;

        const errorMsg = document.createElement('p');
        errorMsg.id = 'password-error';
        errorMsg.style.color = 'red';
        errorMsg.style.marginTop = '1rem';
        errorMsg.style.display = 'none';
        errorMsg.textContent = 'Mật khẩu không đúng. Vui lòng thử lại.';
        
        form.appendChild(input);
        form.appendChild(button);
        modal.appendChild(closeButton);
        modal.appendChild(title);
        modal.appendChild(form);
        modal.appendChild(errorMsg);
        overlay.appendChild(modal);

        document.body.appendChild(overlay);
        input.focus();

        // Fade in the overlay
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    }

    function checkPassword() {
        const input = document.getElementById('password-input');
        const errorMsg = document.getElementById('password-error');
        const overlay = document.getElementById('password-overlay');
        const mainContent = document.getElementById('main-content');

        if (input.value === PASSWORD) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                if (mainContent) {
                    mainContent.classList.remove('content-blurred');
                }
            }, 300); // Wait for transition
        } else {
            errorMsg.style.display = 'block';
            input.value = '';
            input.focus();
        }
    }

    // Run on page load
    document.addEventListener('DOMContentLoaded', initPasswordProtection);

})();