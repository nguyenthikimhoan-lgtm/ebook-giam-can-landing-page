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
  
  // CRO Redesign Features
  initModuleAccordions();
  initTestimonialCarousel();
  initFloatingNavigation();
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

  // Detect if mobile/tablet
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

  if (isMobile) {
    // Mobile: trigger popup 20 seconds (20000ms) after visitor lands on the page
    setTimeout(() => {
      if (!hasTriggered) {
        triggerPopup();
      }
    }, 20000);
  } else {
    // Desktop: trigger popup on Exit Intent (mouseleave from top viewport)
    document.addEventListener("mouseleave", (e) => {
      if (e.clientY < 20) {
        if (!hasTriggered) {
          triggerPopup();
        }
      }
    });
  }

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
    popupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("exit-name").value.trim();
      const email = document.getElementById("exit-email").value.trim();

      if (!name || !email) {
        alert("Vui lòng điền đầy đủ Họ tên và Email để nhận tài liệu miễn phí!");
        return;
      }

      // Show loading/spinner state on button
      const submitBtn = popupForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : "NHẬN TÀI LIỆU MIỄN PHÍ NGAY";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "ĐANG GỬI THÔNG TIN...";
        submitBtn.style.opacity = "0.7";
      }

      const webAppUrl = "https://script.google.com/macros/s/AKfycbz-OBa3zpEU7OFTm7cn7hWkexV-mHEnr2MISUSce6vk7leN8FTtHzoxaCkljrgbvnTO/exec";

      try {
        await fetch(webAppUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify({
            type: "lead_magnet",
            name: name,
            email: email
          })
        });

        console.log("Lead submitted");

        // Fire Meta Pixel Lead Event (Prevent duplicate firing with sessionStorage)
        if (typeof fbq === 'function') {
          if (!sessionStorage.getItem('lead_submitted_meta_pixel')) {
            fbq('track', 'Lead');
            sessionStorage.setItem('lead_submitted_meta_pixel', 'true');
            console.log("Meta Pixel Lead tracked successfully");
          }
        }

        // Record successful submission (30 days block)
        localStorage.setItem("exit_popup_submitted_time", String(Date.now()));

        if (popupBody) {
          popupBody.innerHTML = `
            <button class="close-exit-btn" id="success-close-x-btn" aria-label="Đóng popup">&times;</button>
            <div class="popup-success-card" style="text-align: center; padding: 40px 24px;">
              <div style="font-size: 55px; margin-bottom: 20px; color: #10B981; animation: gift-bounce 2s infinite;">🎉</div>
              <h3 style="color: #0F5A47; font-family: 'Playfair Display', serif; font-size: 26px; font-weight: bold; margin-bottom: 16px; line-height: 1.3; letter-spacing: 0.5px;">ĐĂNG KÝ THÀNH CÔNG!</h3>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 12px; font-weight: 500;">
                Tài liệu <strong>7 Sai Lầm Khiến Phụ Nữ Sau 30 Tuổi Càng Ăn Kiêng Càng Béo</strong> đã được gửi vào email: <span style="color: #E11D48; font-weight: bold;">${email}</span>.
              </p>
              <p style="color: #6B7280; font-size: 14px; line-height: 1.5; margin-bottom: 30px;">
                Vui lòng kiểm tra Hộp thư đến, Quảng cáo hoặc Spam để đọc tài liệu.
              </p>
              <button id="success-close-popup" class="btn-coral" style="padding: 12px 35px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer; display: inline-block; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; transition: transform 0.2s, background-color 0.2s;">QUAY LẠI TRANG CHỦ</button>
            </div>
          `;

          // Both QUAY LẠI TRANG CHỦ and the "x" button on the success screen close the popup
          const closeSuccess = () => {
            exitPopup.classList.remove("active");
          };

          document.getElementById("success-close-popup").addEventListener("click", closeSuccess);
          document.getElementById("success-close-x-btn").addEventListener("click", closeSuccess);
        }
      } catch (error) {
        console.error("Error saving lead capture popup details:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại hoặc liên hệ Zalo hỗ trợ.");

        // Restore button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          submitBtn.style.opacity = "";
        }
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

  const checkoutSection = document.getElementById("checkout-section");

  const handleScroll = () => {
    if (window.innerWidth < 768) {
      const heroSection = document.querySelector(".hero-section");
      const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
      const checkoutOffset = checkoutSection ? checkoutSection.offsetTop : Infinity;
      
      // Hiển thị nếu cuộn qua Hero nhưng chưa đến phần đăng ký (cách 300px)
      if (window.scrollY > heroHeight && window.scrollY < checkoutOffset - 300) {
        stickyCta.classList.add("active");
      } else {
        stickyCta.classList.remove("active");
      }
    } else {
      stickyCta.classList.remove("active");
    }
  };

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);
  handleScroll();
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
      
      // Fire Meta Pixel InitiateCheckout Event
      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout');
        console.log("Meta Pixel InitiateCheckout tracked from scroll CTA click");
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
  
  const boxPackage = document.getElementById("checkout-box-package");
  const boxSummary = document.getElementById("checkout-box-summary");
  const boxAction = document.getElementById("checkout-box-action");
  
  // Tối ưu hóa UX Form trên Mobile: Tự động cuộn ô nhập liệu đang chọn lên 1/3 phía trên màn hình
  // Đồng thời hỗ trợ phím "Enter" / "Next" trên bàn phím ảo để tự động chuyển sang ô tiếp theo mượt mà
  const formInputs = [nameInput, phoneInput, emailInput];
  formInputs.forEach((input, index) => {
    if (!input) return;

    input.addEventListener("focus", () => {
      if (window.innerWidth < 768) {
        // Đợi 350ms để bàn phím ảo di động mở ra hoàn toàn và điều chỉnh viewport
        setTimeout(() => {
          const rect = input.getBoundingClientRect();
          const absoluteTop = window.scrollY + rect.top;
          // Đặt ô nhập liệu hoạt động ở khoảng 25% chiều cao màn hình hiển thị (1/3 phía trên)
          const targetY = absoluteTop - (window.innerHeight * 0.25);
          
          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: "smooth"
          });
        }, 350);
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const nextInput = formInputs[index + 1];
        if (nextInput) {
          nextInput.focus();
        } else {
          // Nếu là ô cuối cùng (Email), tắt tập trung để ẩn bàn phím ảo đi
          input.blur();
          // Cuộn mượt mà đến khối chọn gói sản phẩm vừa được mở khóa để hướng dẫn hành động tiếp theo
          const packageBox = document.getElementById("checkout-box-package");
          if (packageBox) {
            setTimeout(() => {
              packageBox.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
          }
        }
      }
    });
  });
  
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
      if (boxSummary) boxSummary.style.display = "block";
      if (boxAction) boxAction.style.display = "block";
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
  const warningBox = document.getElementById("checkout-warning-box");

  // Elements for QR Modal
  const paymentModal = document.getElementById("payment-qr-modal");
  const closePaymentModal = document.getElementById("close-payment-modal");
  const btnSuccessClose = document.getElementById("btn-success-close-modal");
  const btnDownloadQR = document.getElementById("btn-download-qr");
  const btnCopyAmount = document.getElementById("btn-copy-amount");
  const btnCopyMemo = document.getElementById("btn-copy-memo");

  let countdownInterval = null;
  let statusPollingInterval = null;

  function showPaymentModal(memo) {
    if (paymentModal) paymentModal.classList.add("active");
    
    // Hide sticky CTA
    const stickyCta = document.getElementById("mobile-sticky-cta");
    if (stickyCta) {
      stickyCta.style.setProperty("display", "none", "important");
    }
    
    startPaymentCountdown(memo);
  }

  function hidePaymentModal() {
    if (paymentModal) paymentModal.classList.remove("active");
    
    // Restore sticky CTA
    const stickyCta = document.getElementById("mobile-sticky-cta");
    if (stickyCta) {
      stickyCta.style.display = "";
    }
    
    if (countdownInterval) clearInterval(countdownInterval);
    if (statusPollingInterval) clearInterval(statusPollingInterval);
  }

  if (closePaymentModal) {
    closePaymentModal.addEventListener("click", hidePaymentModal);
  }
  if (btnSuccessClose) {
    btnSuccessClose.addEventListener("click", () => {
      hidePaymentModal();
      resetCheckoutForm();
    });
  }

  if (btnCopyAmount) {
    btnCopyAmount.addEventListener("click", () => {
      let selectedRadio = document.querySelector('input[name="checkout-package"]:checked');
      let amount = "599000";
      if (selectedRadio) {
        amount = selectedRadio.getAttribute("data-price") || "599000";
      }
      copyText(amount, btnCopyAmount);
    });
  }

  if (btnCopyMemo) {
    btnCopyMemo.addEventListener("click", () => {
      let rawPhone = phoneInput ? phoneInput.value.trim() : "";
      let safePhone = rawPhone.replace(/[^0-9]/g, "");
      let memo = safePhone ? "GC" + safePhone : "GCCHOSDT";
      copyText(memo, btnCopyMemo);
    });
  }

  async function downloadQR() {
    if (!qrImage || !qrImage.src) return;
    
    const originalText = btnDownloadQR ? btnDownloadQR.innerHTML : "📥 TẢI MÃ QR VỀ MÁY";
    if (btnDownloadQR) {
      btnDownloadQR.disabled = true;
      btnDownloadQR.innerHTML = "⌛ ĐANG TẢI...";
    }

    try {
      const response = await fetch(qrImage.src);
      if (!response.ok) throw new Error("Network response error");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "VietQR-Giam-Can-Khong-Bo-Cuoc.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.warn("Failed to download via Blob CORS, fallback to open in new tab:", error);
      window.open(qrImage.src, "_blank");
    } finally {
      if (btnDownloadQR) {
        btnDownloadQR.disabled = false;
        btnDownloadQR.innerHTML = originalText;
      }
    }
  }

  if (btnDownloadQR) {
    btnDownloadQR.addEventListener("click", downloadQR);
  }

  function resetCheckoutForm() {
    if (nameInput) nameInput.value = "";
    if (phoneInput) phoneInput.value = "";
    if (emailInput) emailInput.value = "";
    packageRadios.forEach(radio => radio.checked = false);
    updateSummary();
    updateMemo();
    updateProgressiveCheckout();
  }

  if (checkoutForm && btnSubmit) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Fire Meta Pixel InitiateCheckout Event
      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout');
        console.log("Meta Pixel InitiateCheckout tracked from checkout form submit");
      }

      // Hiển thị trạng thái Loading trên nút bấm, ẩn thông báo cảnh báo cũ
      if (spinner) spinner.style.display = "inline-block";
      btnSubmit.classList.add("btn-disabled-checkout");
      btnSubmit.disabled = true;
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
        // Lưu thành công -> Mở modal thanh toán
        showPaymentModal(memo);
      })
      .catch(error => {
        console.error("Error saving to Google Sheets:", error);
        
        // Nếu lưu thất bại, hiển thị cảnh báo nhưng vẫn cho phép khách thanh toán để tăng CRO
        if (warningBox) {
          warningBox.innerHTML = `⚠️ <strong>Lưu ý:</strong> Thông tin đăng ký chưa được lưu tự động. Vui lòng hoàn tất chuyển khoản và liên hệ Zalo để kích hoạt ngay.`;
          warningBox.style.display = "block";
        }
        
        showPaymentModal(memo);
      })
      .finally(() => {
        // Khôi phục trạng thái nút bấm
        if (spinner) spinner.style.display = "none";
        btnSubmit.classList.remove("btn-disabled-checkout");
        btnSubmit.disabled = false;
      });
    });
  }

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

    // Track Meta Pixel Purchase Event
    if (typeof fbq === 'function') {
      const purchaseKey = 'purchase_tracked_meta_pixel';
      if (!sessionStorage.getItem(purchaseKey)) {
        let selectedRadio = document.querySelector('input[name="checkout-package"]:checked');
        let amount = 599000; // default value
        if (selectedRadio) {
          amount = parseInt(selectedRadio.getAttribute("data-price")) || 599000;
        }
        fbq('track', 'Purchase', {
          value: amount,
          currency: 'VND'
        });
        sessionStorage.setItem(purchaseKey, 'true');
        console.log("Meta Pixel Purchase tracked successfully, value:", amount);
      }
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
      hidePaymentModal();
      resetCheckoutForm();
      
      // Cuộn mượt về đầu phần đăng ký
      const target = document.getElementById("checkout-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
}

// ==========================================
// 8. ĐIỀU KHIỂN ACCORDION CHO CÁC MODULES
// ==========================================
function initModuleAccordions() {
  const triggers = document.querySelectorAll(".module-accordion-trigger");
  triggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const contentId = trigger.getAttribute("data-target");
      const content = document.getElementById(contentId);
      const icon = trigger.querySelector(".module-accordion-icon");
      
      if (!content) return;
      
      // Toggle active classes
      content.classList.toggle("active");
      trigger.classList.toggle("active");
      
      if (content.classList.contains("active")) {
        content.style.maxHeight = content.scrollHeight + "px";
        if (icon) icon.innerText = "▲";
      } else {
        content.style.maxHeight = null;
        if (icon) icon.innerText = "▼";
      }
    });
  });
}

// ==========================================
// 9. SWIPE CAROUSEL CHO TESTIMONIALS
// ==========================================
function initTestimonialCarousel() {
  const track = document.querySelector(".testimonial-carousel-track");
  const dots = document.querySelectorAll(".indicator-dot");
  if (!track) return;

  // Cập nhật indicator dots khi scroll ngang
  track.addEventListener("scroll", () => {
    const slideWidth = track.clientWidth;
    const scrollLeft = track.scrollLeft;
    const activeIndex = Math.round(scrollLeft / slideWidth);
    
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  });

  // Click vào các dot để scroll mượt tới slide tương ứng
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const slideIndex = parseInt(dot.getAttribute("data-slide"), 10);
      const slideWidth = track.clientWidth;
      track.scrollTo({
        left: slideIndex * slideWidth,
        behavior: "smooth"
      });
    });
  });
}

// ==========================================
// 10. ĐIỀU KHIỂN FLOATING SHORTCUTS & MENU TOC
// ==========================================
function initFloatingNavigation() {
  const btnToc = document.getElementById("btn-toc");
  const tocDrawer = document.getElementById("toc-drawer-overlay");
  const closeToc = document.getElementById("close-toc-drawer");
  const btnScrollTop = document.getElementById("btn-scroll-top");
  const btnScrollCheckout = document.getElementById("btn-scroll-checkout");
  const tocLinks = document.querySelectorAll(".toc-list a");

  if (btnToc && tocDrawer) {
    btnToc.addEventListener("click", () => {
      tocDrawer.classList.add("active");
    });
  }

  if (closeToc && tocDrawer) {
    closeToc.addEventListener("click", () => {
      tocDrawer.classList.remove("active");
    });
  }

  if (tocDrawer) {
    tocDrawer.addEventListener("click", (e) => {
      if (e.target === tocDrawer) {
        tocDrawer.classList.remove("active");
      }
    });
  }

  tocLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (tocDrawer) {
        tocDrawer.classList.remove("active");
      }
    });
  });

  if (btnScrollTop) {
    btnScrollTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (btnScrollCheckout) {
    btnScrollCheckout.addEventListener("click", () => {
      const checkout = document.getElementById("checkout-section");
      if (checkout) {
        checkout.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // Ẩn/hiện toàn bộ container shortcuts dựa trên điều kiện hiển thị CTA
  const navContainer = document.querySelector(".floating-nav-container");
  const itemScrollTop = document.getElementById("floating-item-top");

  function handleScrollVisibility() {
    const scrollY = window.scrollY;
    const isMobile = window.innerWidth < 768;
    
    const heroSection = document.querySelector(".hero-section");
    const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
    
    const checkoutSection = document.getElementById("checkout-section");
    const checkoutOffset = checkoutSection ? checkoutSection.offsetTop : Infinity;
    
    // Hiển thị nếu cuộn qua Hero nhưng chưa đến phần đăng ký (cách 300px)
    let shouldShowContainer = (scrollY > heroHeight && scrollY < checkoutOffset - 300);

    // Sync directly with the mobile sticky CTA state if it's hidden (e.g. inside payment modal)
    if (isMobile) {
      const stickyCta = document.getElementById("mobile-sticky-cta");
      if (stickyCta && (stickyCta.style.display === "none" || stickyCta.style.getPropertyValue("display") === "none")) {
        shouldShowContainer = false;
      }
    }

    if (navContainer) {
      if (shouldShowContainer) {
        navContainer.classList.add("active");
      } else {
        navContainer.classList.remove("active");
      }
    }

    if (itemScrollTop) {
      const deepScroll = scrollY > window.innerHeight * 3;
      if (shouldShowContainer && deepScroll) {
        itemScrollTop.style.display = "flex";
      } else {
        itemScrollTop.style.display = "none";
      }
    }
  }

  window.addEventListener("scroll", handleScrollVisibility);
  window.addEventListener("resize", handleScrollVisibility);
  handleScrollVisibility(); // Chạy kiểm tra ban đầu khi tải trang
}

// ==========================================
// 11. HÀM SAO CHÉP TEXT CHO TOÀN BỘ TRANG (ROBUST FALLBACK COPY)
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
      btn.innerText = "ĐA COPY";
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
