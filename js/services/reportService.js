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

    // Bỏ qua object đầu tiên theo yêu cầu
    const displayData = data.slice(1);

    let html = `
        <div class="d-flex justify-content-between align-items-center mb-4 mt-5">
            <h3 class="mb-0" style="color: var(--primary-color); font-weight: 700;">TỔNG HỢP DỮ LIỆU PHẦN MỀM CÁC DỰ ÁN CHUNG CƯ</h3>
            <button class="btn btn-success d-flex align-items-center gap-2" onclick="exportReportToExcel()" style="background-color: #108042; border-radius: 8px;">
                <i class="bi bi-file-earmark-excel"></i> Xuất Excel
            </button>
        </div>
        <div class="table-responsive">
            <table id="report-table" class="table table-bordered table-hover align-middle custom-table">
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

    displayData.forEach(item => {
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

// Hàm xuất Excel
function exportReportToExcel() {
    const table = document.getElementById("report-table");
    if (!table) return;

    // Tạo workbook từ table
    const wb = XLSX.utils.table_to_book(table, { sheet: "BaoCaoHeThong" });
    
    // Tạo tên file theo ngày hiện tại
    const date = new Date();
    const fileName = `Bao_Cao_He_Thong_${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}.xlsx`;
    
    // Xuất file
    XLSX.writeFile(wb, fileName);
}

document.addEventListener("DOMContentLoaded", fetchReportData);
