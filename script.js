document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. KHỞI TẠO & PHÂN PHỐI LẮNG NGHE SỰ KIỆN
  // ==========================================
  initFAQs();
  initVideoTestimonials();
  initExitIntent();
  initStickyMobileCTA();
  initSmoothScroll();      // Khởi tạo cuộn mượt và pre-select package cho các nút CTA
  initCheckoutSection();   // Khởi tạo logic tính toán đơn hàng & copy tại form checkout nhúng
});

// ==========================================
// 2. ĐIỀU KHIỂN ACCORDION FAQ
// ==========================================
function initFAQs() {
  const faqHeaders = document.querySelectorAll(".faq-header");
  faqHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const body = item.querySelector(".faq-body");
      const icon = header.querySelector(".faq-icon");
      
      const allItems = document.querySelectorAll(".faq-item");
      allItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active");
          otherItem.querySelector(".faq-body").style.maxHeight = null;
          otherItem.querySelector(".faq-icon").style.transform = "rotate(0deg)";
        }
      });

      item.classList.toggle("active");
      if (item.classList.contains("active")) {
        body.style.maxHeight = body.scrollHeight + "px";
        icon.style.transform = "rotate(180deg)";
      } else {
        body.style.maxHeight = null;
        icon.style.transform = "rotate(0deg)";
      }
    });
  });
}

// ==========================================
// 3. KIỂM SOÁT VIDEO TESTIMONIALS
// ==========================================
function initVideoTestimonials() {
  const videos = document.querySelectorAll(".testimonial-video");
  
  videos.forEach(video => {
    video.muted = true;
    video.play().catch(err => {
      console.log("Autoplay blocked or waiting for user interaction: ", err);
    });

    const overlay = video.parentElement.querySelector(".video-overlay");
    const unmuteBtn = video.parentElement.querySelector(".unmute-badge");

    const toggleVideoState = () => {
      if (video.muted) {
        video.muted = false;
        video.currentTime = 0;
        video.play();
        if (overlay) overlay.style.opacity = "0";
        if (unmuteBtn) {
          unmuteBtn.innerHTML = '🔊 Đang bật tiếng';
          unmuteBtn.classList.add("playing");
        }
      } else {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }
    };

    if (overlay) {
      overlay.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleVideoState();
      });
    }

    video.addEventListener("click", toggleVideoState);
  });
}

// ==========================================
// 4. POPUP GIỮ CHÂN KHI THOÁT TRANG
// ==========================================
function initExitIntent() {
  const exitPopup = document.getElementById("exit-intent-popup");
  const closeBtn = document.getElementById("close-exit-popup");
  const popupForm = document.getElementById("exit-popup-form");
  const popupBody = document.querySelector(".exit-popup-content-box");

  if (!exitPopup) return;

  let hasTriggered = false;

  function isPopupAllowed() {
    // Show popup only once per session
    if (sessionStorage.getItem("exit_popup_session_shown")) {
      return false;
    }

    // If user closes popup, do not show again for 24 hours using localStorage
    const closedTime = localStorage.getItem("exit_popup_closed_time");
    if (closedTime) {
      const elapsed = Date.now() - parseInt(closedTime, 10);
      if (elapsed < 24 * 60 * 60 * 1000) {
        return false;
      }
    }

    // If user submits popup successfully, do not show again for 30 days using localStorage
    const submittedTime = localStorage.getItem("exit_popup_submitted_time");
    if (submittedTime) {
      const elapsed = Date.now() - parseInt(submittedTime, 10);
      if (elapsed < 30 * 24 * 60 * 60 * 1000) {
        return false;
      }
    }

    return true;
  }

  function triggerPopup() {
    if (hasTriggered || !isPopupAllowed()) return;
    exitPopup.classList.add("active");
    hasTriggered = true;
    sessionStorage.setItem("exit_popup_session_shown", "true");
  }

  function closePopup() {
    exitPopup.classList.remove("active");
    // Save closed time block of 24 hours to localStorage
    localStorage.setItem("exit_popup_closed_time", String(Date.now()));
  }

  const isMobile = window.innerWidth < 768;

  // Desktop exit intent
  if (!isMobile) {
    document.addEventListener("mouseleave", (e) => {
      if (e.clientY < 20 && !hasTriggered) {
        triggerPopup();
      }
    });
  }

  // Timeout triggers:
  // Desktop: 45 seconds on page
  // Mobile: 60 seconds on page
  const delayMs = isMobile ? 60000 : 45000;
  setTimeout(() => {
    if (!hasTriggered) {
      triggerPopup();
    }
  }, delayMs);

  // Scroll triggers:
  // Desktop: 55% scroll of the page
  // Mobile: 60% scroll of the page
  window.addEventListener("scroll", () => {
    if (hasTriggered) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight <= 0) return;

    const scrollPercent = (scrollTop / docHeight) * 100;
    const scrollThreshold = isMobile ? 60 : 55;

    if (scrollPercent >= scrollThreshold) {
      triggerPopup();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closePopup();
    });
  }

  exitPopup.addEventListener("click", (e) => {
    if (e.target === exitPopup) {
      closePopup();
    }
  });

  if (popupForm) {
    popupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("exit-name").value.trim();
      const email = document.getElementById("exit-email").value.trim();

      if (!name || !email) {
        alert("Vui lòng điền đầy đủ Họ tên và Email để nhận tài liệu miễn phí!");
        return;
      }

      // Record successful submission (30 days block)
      localStorage.setItem("exit_popup_submitted_time", String(Date.now()));

      const driveLink = "https://drive.google.com/file/d/1ICk-C0edjf0hYQ_k9Xt5Cr7xqpJDfnOO/view?usp=sharing";

      if (popupBody) {
        popupBody.innerHTML = `
          <div class="popup-success-card" style="text-align: center; padding: 25px 15px;">
            <div style="font-size: 50px; margin-bottom: 12px; color: #10B981;">🎉</div>
            <h3 style="color: #0F5A47; font-family: 'Playfair Display', serif; font-size: 22px; margin-bottom: 10px; line-height: 1.3;">ĐĂNG KÝ THÀNH CÔNG!</h3>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 15px;">
              Đăng ký thành công! Tài liệu <strong>7 Sai Lầm Khiến Phụ Nữ Sau 30 Tuổi Càng Ăn Kiêng Càng Béo</strong> đã được gửi vào địa chỉ email: <span style="color: #E11D48; font-weight: bold;">${email}</span>.
            </p>
            
            <div style="background-color: #F3F4F6; border-radius: 8px; padding: 15px; margin-bottom: 20px; text-align: left; font-size: 13px; color: #4B5563; line-height: 1.5; border-left: 4px solid var(--color-primary);">
              <div style="font-weight: 700; color: #111827; margin-bottom: 5px; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px;">📧 Bản xem trước Email đã gửi:</div>
              <span style="font-weight: 600; color: #111827;">Tiêu đề:</span> 🎁 Tài liệu miễn phí: 7 Sai Lầm Khiến Phụ Nữ Sau 30 Tuổi Càng Ăn Kiêng Càng Béo<br>
              <span style="font-weight: 600; color: #111827;">Nội dung:</span><br>
              Chào ${name},<br>
              Cảm ơn bạn đã đăng ký nhận tài liệu miễn phí.<br>
              Bạn có thể tải tài liệu tại đây:<br>
              <a href="${driveLink}" target="_blank" style="color: var(--color-accent); font-weight: bold; text-decoration: underline;">${driveLink}</a><br><br>
              Sau khi đọc xong, bạn sẽ hiểu vì sao nhiều phụ nữ sau 30 tuổi càng ăn kiêng càng dễ tăng cân, mệt mỏi và bỏ cuộc giữa chừng.<br><br>
              Thân mến,<br>
              Hạnh Healthy
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <a href="${driveLink}" target="_blank" class="btn-coral" style="padding: 10px 20px; border-radius: 6px; font-weight: bold; text-decoration: none; display: inline-block;">TẢI TÀI LIỆU NGAY (DRIVE)</a>
              <button id="success-close-popup" class="btn-coral" style="padding: 10px 20px; border-radius: 6px; font-weight: bold; border: none; cursor: pointer; background-color: #9CA3AF;">Quay lại trang</button>
            </div>
          </div>
        `;

        document.getElementById("success-close-popup").addEventListener("click", () => {
          exitPopup.classList.remove("active");
        });
      }
    });
  }
}

// ==========================================
// 5. STICKY MOBILE CTA BAR (Bottom float)
// ==========================================
function initStickyMobileCTA() {
  const stickyCta = document.getElementById("mobile-sticky-cta");
  if (!stickyCta) return;

  window.addEventListener("scroll", () => {
    if (window.innerWidth < 768) {
      const heroSection = document.querySelector(".hero-section");
      const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
      
      if (window.scrollY > heroHeight) {
        stickyCta.classList.add("active");
      } else {
        stickyCta.classList.remove("active");
      }
    } else {
      stickyCta.classList.remove("active");
    }
  });
}

// ==========================================
// 6. CUỘN MƯỢT & CHỌN NHANH GÓI (SMOOTH SCROLL & PACKAGE PRE-SELECT)
// ==========================================
function initSmoothScroll() {
  const scrollButtons = document.querySelectorAll(".scroll-to-checkout");
  scrollButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      
      const packageCode = button.getAttribute("data-package");
      if (packageCode) {
        const radio = document.querySelector(`input[name="checkout-package"][value="${packageCode}"]`);
        if (radio) {
          radio.checked = true;
          // Phát hỏa sự kiện change để cập nhật lại tóm tắt đơn hàng ngay lập tức
          radio.dispatchEvent(new Event("change"));
        }
      }
      
      const target = document.getElementById("checkout-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// ==========================================
// 7. TÍNH TOÁN ĐƠN HÀNG FORM NHÚNG (INTERACTIVE EMBEDDED CHECKOUT)
// ==========================================
function initCheckoutSection() {
  const packageRadios = document.querySelectorAll('input[name="checkout-package"]');
  const nameInput = document.getElementById("checkout-name");
  const phoneInput = document.getElementById("checkout-phone");
  const emailInput = document.getElementById("checkout-email");
  const memoText = document.getElementById("bank-transfer-memo");
  const qrImage = document.getElementById("qr-image-dynamic");
  
  const summaryPackageName = document.getElementById("summary-package-name");
  const summaryOriginalPrice = document.getElementById("summary-original-price");
  const summaryTotalPrice = document.getElementById("summary-total-price");
  const bankTransferAmount = document.getElementById("bank-transfer-amount");
  const qrPaymentAmount = document.getElementById("qr-payment-amount");
  
  const boxPackage = document.getElementById("checkout-box-package");
  const boxSummary = document.getElementById("checkout-box-summary");
  const boxAction = document.getElementById("checkout-box-action");
  const checkoutGrid = document.querySelector(".checkout-grid-premium");
  
  const originalPrices = {
    starter: "800.000đ",
    complete: "1.200.000đ",
    vip: "2.000.000đ"
  };
  
  function updateQR() {
    if (!qrImage) return;
    
    let selectedRadio = document.querySelector('input[name="checkout-package"]:checked');
    let amount = "599000"; // default
    if (selectedRadio) {
      amount = selectedRadio.getAttribute("data-price") || "599000";
    }
    
    let rawPhone = phoneInput ? phoneInput.value.trim() : "";
    let safePhone = rawPhone.replace(/[^0-9]/g, "");
    let memo = "GCCHOSDT";
    if (safePhone) {
      memo = "GC" + safePhone;
    }
    
    // Tạo URL động của VietQR
    const url = `https://img.vietqr.io/image/BIDV-96247246868-compact2.png?amount=${amount}&addInfo=${memo}&accountName=NGUYEN%20THI%20KIM%20HOAN`;
    qrImage.src = url;
  }
  
  function updateSummary() {
    let selectedRadio = document.querySelector('input[name="checkout-package"]:checked');
    if (!selectedRadio) return;
    
    const val = selectedRadio.value;
    const price = selectedRadio.getAttribute("data-price");
    const label = selectedRadio.getAttribute("data-label");
    
    // Format hiển thị số tiền sang đơn vị vi-VN
    const formattedPrice = parseInt(price).toLocaleString("vi-VN") + "đ";
    
    // Cập nhật lên tóm tắt thông tin và hóa đơn thanh toán
    if (summaryPackageName) summaryPackageName.innerText = label;
    if (summaryTotalPrice) summaryTotalPrice.innerText = formattedPrice;
    if (bankTransferAmount) bankTransferAmount.innerText = formattedPrice;
    if (qrPaymentAmount) qrPaymentAmount.innerText = formattedPrice;
    if (summaryOriginalPrice && originalPrices[val]) {
      summaryOriginalPrice.innerText = originalPrices[val];
    }
    
    updateQR();
  }
  
  function updateMemo() {
    if (!phoneInput || !memoText) return;
    let rawPhone = phoneInput.value.trim();
    let safePhone = rawPhone.replace(/[^0-9]/g, ""); // Chỉ giữ lại số chữ số
    if (safePhone) {
      memoText.innerText = "GC" + safePhone;
    } else {
      memoText.innerText = "GCCHOSDT";
    }
    
    updateQR();
  }
  
  function updateProgressiveCheckout() {
    if (!nameInput || !phoneInput || !emailInput) return;
    
    const nameFilled = nameInput.value.trim() !== "";
    const phoneFilled = phoneInput.value.trim() !== "";
    const emailFilled = emailInput.value.trim() !== "";
    const emailValid = emailInput.checkValidity();
    
    if (nameFilled && phoneFilled && emailFilled && emailValid) {
      if (boxPackage) boxPackage.style.display = "block";
      
      const selectedRadio = document.querySelector('input[name="checkout-package"]:checked');
      if (selectedRadio) {
        if (boxSummary) boxSummary.style.display = "block";
        if (boxAction) boxAction.style.display = "block";
      } else {
        if (boxSummary) boxSummary.style.display = "none";
        if (boxAction) boxAction.style.display = "none";
      }
    } else {
      if (boxPackage) boxPackage.style.display = "none";
      if (boxSummary) boxSummary.style.display = "none";
      if (boxAction) boxAction.style.display = "none";
    }
  }
  
  // Gắn lắng nghe sự kiện
  packageRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      updateSummary();
      updateProgressiveCheckout();
    });
  });
  
  if (nameInput) {
    nameInput.addEventListener("input", updateProgressiveCheckout);
  }
  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      updateMemo();
      updateProgressiveCheckout();
    });
  }
  if (emailInput) {
    emailInput.addEventListener("input", updateProgressiveCheckout);
  }
  
  // Khởi chạy đồng bộ lần đầu tiên
  updateSummary();
  updateMemo();
  updateProgressiveCheckout();

  // Xử lý nộp form đăng ký để lưu vào Google Sheets
  const checkoutForm = document.getElementById("checkout-form-embedded");
  const btnSubmit = document.getElementById("btn-submit-checkout");
  const spinner = document.getElementById("spinner-checkout");
  const successBox = document.getElementById("checkout-success-box");
  const warningBox = document.getElementById("checkout-warning-box");

  if (checkoutForm && btnSubmit) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Hiển thị trạng thái Loading trên nút bấm, ẩn các hộp thông báo cũ
      if (spinner) spinner.style.display = "inline-block";
      btnSubmit.classList.add("btn-disabled-checkout");
      btnSubmit.disabled = true;
      if (successBox) successBox.style.display = "none";
      if (warningBox) warningBox.style.display = "none";

      // Thu thập thông tin từ form
      const name = nameInput ? nameInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      
      const selectedRadio = document.querySelector('input[name="checkout-package"]:checked');
      const packageLabel = selectedRadio ? selectedRadio.getAttribute("data-label") : "Gói Lộ Trình Hoàn Chỉnh 90 Ngày";
      const amount = selectedRadio ? selectedRadio.getAttribute("data-price") : "599000";
      
      const safePhone = phone.replace(/[^0-9]/g, "");
      const memo = safePhone ? "GC" + safePhone : "GCCHOSDT";

      // Thiết lập payload đúng yêu cầu
      const payload = {
        name: name,
        phone: phone,
        email: email,
        package: packageLabel,
        amount: parseInt(amount),
        memo: memo,
        status: "PENDING",
        sent: "NO"
      };

      const webAppUrl = "https://script.google.com/macros/s/AKfycbxVNUvVcDL666mlpWz9WDgBdvh_NtV_CwNLac-hDLnEdQa9kU9XPJBtxGZhfQjWStamVg/exec";

      // Gửi dữ liệu tới Google Sheets qua fetch POST
      fetch(webAppUrl, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8" // Sử dụng text/plain tránh lỗi CORS preflight OPTIONS
        },
        body: JSON.stringify(payload)
      })
      .then(() => {
        // Lưu thành công -> Mở khóa hiển thị phần thanh toán VietQR
        if (checkoutGrid) {
          checkoutGrid.classList.remove("payment-hidden");
        }
        
        // Hiển thị hộp thông báo thành công
        if (successBox) {
          successBox.innerHTML = `✅ <strong>Thành công:</strong> Thông tin đăng ký đã được lưu. Vui lòng quét mã QR để hoàn tất thanh toán.`;
          successBox.style.display = "block";
        }
        if (warningBox) {
          warningBox.style.display = "none";
        }
        
        // Cuộn tới phần thanh toán VietQR
        const paymentBlock = document.querySelector(".payment-block-premium");
        if (paymentBlock) {
          paymentBlock.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        // Bắt đầu đếm ngược 5 phút và kiểm tra thanh toán
        startPaymentCountdown(memo);
      })
      .catch(error => {
        console.error("Error saving to Google Sheets:", error);
        
        // Nếu lưu thất bại, vẫn hiển thị mã QR để khách thanh toán
        if (checkoutGrid) {
          checkoutGrid.classList.remove("payment-hidden");
        }
        
        // Hiển thị hộp thông báo lỗi nhỏ
        if (warningBox) {
          warningBox.innerHTML = `⚠️ <strong>Lưu ý:</strong> Thông tin đăng ký chưa được lưu. Vui lòng kiểm tra lại kết nối hoặc liên hệ Zalo hỗ trợ.`;
          warningBox.style.display = "block";
        }
        if (successBox) {
          successBox.style.display = "none";
        }
        
        // Cuộn tới phần thanh toán VietQR
        const paymentBlock = document.querySelector(".payment-block-premium");
        if (paymentBlock) {
          paymentBlock.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        // Vẫn bắt đầu đếm ngược 5 phút và kiểm tra thanh toán để nhất quán trải nghiệm
        startPaymentCountdown(memo);
      })
      .finally(() => {
        // Khôi phục trạng thái nút bấm
        if (spinner) spinner.style.display = "none";
        btnSubmit.classList.remove("btn-disabled-checkout");
        btnSubmit.disabled = false;
      });
    });
  }

  // ==========================================
  // ĐẾM NGƯỢC THANH TOÁN & KIỂM TRA TRẠNG THÁI
  // ==========================================
  let countdownInterval = null;
  let statusPollingInterval = null;

  function startPaymentCountdown(memo) {
    if (countdownInterval) clearInterval(countdownInterval);
    if (statusPollingInterval) clearInterval(statusPollingInterval);

    const qrActiveState = document.getElementById("payment-qr-active-state");
    const successState = document.getElementById("payment-success-state");
    const expiredState = document.getElementById("payment-expired-state");
    const timerDisplay = document.getElementById("payment-timer");

    if (qrActiveState) qrActiveState.style.display = "block";
    if (successState) successState.style.display = "none";
    if (expiredState) expiredState.style.display = "none";

    let totalSeconds = 5 * 60; // 5 phút
    if (timerDisplay) {
      timerDisplay.innerText = "05:00";
    }

    countdownInterval = setInterval(() => {
      totalSeconds--;

      if (totalSeconds <= 0) {
        clearInterval(countdownInterval);
        clearInterval(statusPollingInterval);
        if (timerDisplay) timerDisplay.innerText = "00:00";
        showExpiredState();
        return;
      }

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(seconds).padStart(2, "0");

      if (timerDisplay) {
        timerDisplay.innerText = `${formattedMinutes}:${formattedSeconds}`;
      }
    }, 1000);

    // Bắt đầu kiểm tra trạng thái thanh toán từ Google Sheets mỗi 10 giây
    startStatusPolling(memo);
  }

  function startStatusPolling(memo) {
    const webAppUrl = "https://script.google.com/macros/s/AKfycbxVNUvVcDL666mlpWz9WDgBdvh_NtV_CwNLac-hDLnEdQa9kU9XPJBtxGZhfQjWStamVg/exec";

    statusPollingInterval = setInterval(() => {
      fetch(`${webAppUrl}?memo=${encodeURIComponent(memo)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          console.log("Polling payment status response:", data);
          let status = "";
          if (data && typeof data === "object") {
            status = data.status || (data.data && data.data.status) || data.result || "";
          } else if (typeof data === "string") {
            status = data;
          }

          if (status && status.toUpperCase() === "PAID") {
            showSuccessState();
          }
        })
        .catch(error => {
          console.warn("Lỗi khi kiểm tra trạng thái thanh toán:", error);
        });
    }, 10000); // Mỗi 10 giây
  }

  function showSuccessState() {
    if (countdownInterval) clearInterval(countdownInterval);
    if (statusPollingInterval) clearInterval(statusPollingInterval);

    const qrActiveState = document.getElementById("payment-qr-active-state");
    const successState = document.getElementById("payment-success-state");
    const expiredState = document.getElementById("payment-expired-state");

    if (qrActiveState) qrActiveState.style.display = "none";
    if (successState) successState.style.display = "block";
    if (expiredState) expiredState.style.display = "none";

    // Disable nút thanh toán chính
    if (btnSubmit) {
      btnSubmit.classList.add("btn-disabled-checkout");
      btnSubmit.disabled = true;
      const btnSpan = btnSubmit.querySelector("span");
      if (btnSpan) btnSpan.innerText = "ĐÃ THANH TOÁN THÀNH CÔNG";
    }
  }

  function showExpiredState() {
    if (countdownInterval) clearInterval(countdownInterval);
    if (statusPollingInterval) clearInterval(statusPollingInterval);

    const qrActiveState = document.getElementById("payment-qr-active-state");
    const successState = document.getElementById("payment-success-state");
    const expiredState = document.getElementById("payment-expired-state");

    if (qrActiveState) qrActiveState.style.display = "none";
    if (successState) successState.style.display = "none";
    if (expiredState) expiredState.style.display = "block";
  }

  // Xử lý nút "Tạo lại mã thanh toán"
  const btnRestart = document.getElementById("btn-restart-payment");
  if (btnRestart) {
    btnRestart.addEventListener("click", () => {
      if (countdownInterval) clearInterval(countdownInterval);
      if (statusPollingInterval) clearInterval(statusPollingInterval);

      // Ẩn cột thanh toán bên phải
      if (checkoutGrid) {
        checkoutGrid.classList.add("payment-hidden");
      }

      // Kích hoạt lại nút nộp đơn
      if (btnSubmit) {
        btnSubmit.classList.remove("btn-disabled-checkout");
        btnSubmit.disabled = false;
        const btnSpan = btnSubmit.querySelector("span");
        if (btnSpan) btnSpan.innerText = "THANH TOÁN ĐƠN HÀNG";
      }

      if (successBox) successBox.style.display = "none";
      if (warningBox) warningBox.style.display = "none";

      // Reset các trường thông tin và wizard bước chọn gói
      const checkedRadio = document.querySelector('input[name="checkout-package"]:checked');
      if (checkedRadio) {
        checkedRadio.checked = false;
      }

      if (nameInput) nameInput.value = "";
      if (phoneInput) phoneInput.value = "";
      if (emailInput) emailInput.value = "";

      updateProgressiveCheckout();
      updateMemo();
      updateSummary();

      const qrActiveState = document.getElementById("payment-qr-active-state");
      const successState = document.getElementById("payment-success-state");
      const expiredState = document.getElementById("payment-expired-state");

      if (qrActiveState) qrActiveState.style.display = "block";
      if (successState) successState.style.display = "none";
      if (expiredState) expiredState.style.display = "none";

      // Cuộn mượt về đầu phần đăng ký
      const target = document.getElementById("checkout-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
}


// ==========================================
// 8. HÀM SAO CHÉP TEXT CHO TOÀN BỘ TRANG (ROBUST FALLBACK COPY)
// ==========================================
function copyText(text, btn) {
  // Phương án dự phòng cho trình duyệt bị sandbox (như trình duyệt di động Facebook)
  const fallbackCopy = (str) => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    const success = document.execCommand('copy');
    document.body.removeChild(el);
    return success;
  };

  const executeCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    } else {
      if (fallbackCopy(text)) {
        return Promise.resolve();
      } else {
        return Promise.reject(new Error("Fallback copy failed"));
      }
    }
  };

  executeCopy()
    .then(() => {
      const originalText = btn.innerText;
      btn.innerText = "ĐÃ COPY";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.innerText = originalText;
        btn.classList.remove("copied");
      }, 1500);
    })
    .catch(err => {
      console.error("Copy failed: ", err);
    });
}

// Xuất ra global window để onclick trong HTML có thể tương tác
window.copyText = copyText;
