async function fetchReportData() {
    const url = "https://raw.githubusercontent.com/itkhaservice/run-auto-weekend/main/report.json";
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Không thể tải dữ liệu báo cáo");
        const data = await response.json();
        renderReportTable(data);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        document.getElementById("report-container").innerHTML = `<div class="alert alert-danger">Lỗi: ${error.message}</div>`;
    }
}

function calculateDaysDiff(dateStr) {
    if (!dateStr || dateStr === 'N/A') return 'N/A';
    try {
        const parts = dateStr.split('/');
        if (parts.length !== 3) return 'N/A';
        
        // Định dạng DD/MM/YYYY
        const latestDate = new Date(parts[2], parts[1] - 1, parts[0]);
        const today = new Date();
        
        // Đưa về 0h để tính toán chính xác số ngày
        latestDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        const diffTime = today - latestDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays >= 0 ? `${diffDays} ngày` : 'N/A';
    } catch (e) {
        return 'N/A';
    }
}

function renderReportTable(data) {
    const container = document.getElementById("report-container");
    if (!container) return;

    let html = `
        <div class="table-responsive mt-5">
            <h3 class="text-center mb-4" style="color: var(--primary-color);">TỔNG HỢP TRẠNG THÁI HỆ THỐNG</h3>
            <table class="table table-bordered table-hover align-middle custom-table">
                <thead class="table-success">
                    <tr>
                        <th>Dự án</th>
                        <th class="text-center">Tổng căn hộ</th>
                        <th class="text-center">Cư dân App</th>
                        <th class="text-center">Căn hộ App</th>
                        <th class="text-center">Tin tức</th>
                        <th class="text-center">Thông báo</th>
                        <th class="text-center">Ngày mới nhất</th>
                        <th class="text-center">Tới nay</th>
                        <th class="text-center">Tháng báo phí</th>
                    </tr>
                </thead>
                <tbody>
    `;

    data.forEach(item => {
        const daysDiff = calculateDaysDiff(item["Ngày mới nhất"]);
        // Lấy dữ liệu với fallback nếu tên cột thay đổi
        const cuDanApp = item["Tổng cư dân sử dụng APP"] ?? item["Cư dân dùng APP"] ?? 0;
        const canHoApp = item["Tổng số căn hộ sử dụng APP"] ?? item["Căn hộ dùng APP"] ?? 0;
        const tongCanHo = item["Tổng căn hộ"] ?? 0;

        html += `
            <tr>
                <td class="fw-bold">${item["Dự án"]}</td>
                <td class="text-center">${tongCanHo}</td>
                <td class="text-center">${cuDanApp}</td>
                <td class="text-center">${canHoApp}</td>
                <td class="text-center">${item["Tin tức"] || 0}</td>
                <td class="text-center">${item["Thông báo"] || 0}</td>
                <td class="text-center">${item["Ngày mới nhất"] || 'N/A'}</td>
                <td class="text-center fw-bold ${daysDiff.includes('0 ngày') ? 'text-success' : 'text-danger'}">${daysDiff}</td>
                <td class="text-center text-primary fw-bold">${item["Báo phí"] || 'N/A'}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", fetchReportData);
