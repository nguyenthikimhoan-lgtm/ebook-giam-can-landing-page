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

  if (sessionStorage.getItem("exit_popup_shown")) {
    hasTriggered = true;
  }

  document.addEventListener("mouseleave", (e) => {
    if (e.clientY < 20 && !hasTriggered) {
      triggerPopup();
    }
  });

  setTimeout(() => {
    if (!hasTriggered) {
      triggerPopup();
    }
  }, 45000);

  function triggerPopup() {
    exitPopup.classList.add("active");
    hasTriggered = true;
    sessionStorage.setItem("exit_popup_shown", "true");
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      exitPopup.classList.remove("active");
    });
  }

  exitPopup.addEventListener("click", (e) => {
    if (e.target === exitPopup) {
      exitPopup.classList.remove("active");
    }
  });

  if (popupForm) {
    popupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("exit-name").value.trim();
      const email = document.getElementById("exit-email").value.trim();

      if (!name || !email) {
        alert("Vui lòng điền đầy đủ Họ tên và Email để nhận sơ đồ tư duy miễn phí!");
        return;
      }

      if (popupBody) {
        popupBody.innerHTML = `
          <div class="popup-success-card" style="text-align: center; padding: 30px 15px;">
            <div style="font-size: 50px; margin-bottom: 15px; color: #10B981;">🎉</div>
            <h3 style="color: #0F5A47; font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 10px;">ĐĂNG KÝ THÀNH CÔNG!</h3>
            <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Sơ đồ tư duy <strong>Giảm Cân Không Bỏ Cuộc™</strong> đã được gửi tự động vào địa chỉ email: <span style="color: #E11D48; font-weight: bold;">${email}</span>.
            </p>
            <p style="color: #6B7280; font-size: 14px;">Hãy kiểm tra hộp thư đến (và cả thư mục Quảng cáo/Spam) của bạn trong vài phút tới nhé!</p>
            <button id="success-close-popup" class="btn-coral" style="margin-top: 20px; padding: 10px 25px; border-radius: 6px; font-weight: bold; border: none; cursor: pointer;">Quay lại trang</button>
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
  const phoneInput = document.getElementById("checkout-phone");
  const memoText = document.getElementById("bank-transfer-memo");
  const qrImage = document.getElementById("qr-image-dynamic");
  
  const summaryPackageName = document.getElementById("summary-package-name");
  const summaryOriginalPrice = document.getElementById("summary-original-price");
  const summaryTotalPrice = document.getElementById("summary-total-price");
  const bankTransferAmount = document.getElementById("bank-transfer-amount");
  const qrPaymentAmount = document.getElementById("qr-payment-amount");
  
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
    let memo = "GC_CHO_SDT";
    if (safePhone) {
      memo = "GC_" + safePhone;
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
      memoText.innerText = "GC_" + safePhone;
    } else {
      memoText.innerText = "GC_CHO_SDT";
    }
    
    updateQR();
  }
  
  // Gắn lắng nghe sự kiện
  packageRadios.forEach(radio => {
    radio.addEventListener("change", updateSummary);
  });
  
  if (phoneInput) {
    phoneInput.addEventListener("input", updateMemo);
  }
  
  // Khởi chạy đồng bộ lần đầu tiên
  updateSummary();
  updateMemo();
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
