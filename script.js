function handleKeyDown(event) {
    const searchButton = document.querySelector("button");

    if (event.key === "Enter") {
        searchButton.classList.add("hover-effect");
        searchStudent();
        event.preventDefault();

        setTimeout(() => {
            searchButton.classList.remove("hover-effect");
        }, 500);
    }
}

function searchStudent() {
    const studentID = document.getElementById("studentID").value;

    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRWF5N8fp7duynPm66AJuTJfT5r-rXcB1fqO1klXomU0ZK6I7h7Y8urPdX9vpJeLlUqAqbro6pfXfN1/pub?gid=0&single=true&output=csv';

    document.getElementById("loadingOverlay").style.visibility = "visible";

    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            const studentData = processCSVData(data, studentID);

            if (studentData) {
                displayStudentInfo(studentData);
            } else {
                displayNoActivityMessage();
            }

            document.getElementById("loadingOverlay").style.visibility = "hidden";
        })
        .catch(error => {
            console.error(error);
            alert("Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.");
            document.getElementById("loadingOverlay").style.visibility = "hidden";
        });
}

function isValidStudentID(studentID) {
    // Kiểm tra xem studentID có giá trị hợp lệ hay không
    return studentID.trim().length > 0;
}

function processCSVData(data, studentID) {
    const rows = data.split('\n');
    for (let i = 1; i < rows.length; i++) {
        const rowData = rows[i].split(',');
        if (rowData[2] === studentID) {
            const studentData = {
                name: rowData[1],
                mssv: rowData[2],
                nganhkhoa: rowData[3],
                activities: [],
            };

            for (let j = i; j < rows.length; j++) {
                const rowData = rows[j].split(',');
                if (rowData[2] === studentID) {
                    const activity = {
                        name: rowData[4],
                        donvi: rowData[5],
                        diem: rowData[6],
                    };
                    studentData.activities.push(activity);
                }
            }
            return studentData;
        }
    }
    return null;
}

function displayStudentInfo(studentData) {
    resetStudentInfo(); // Reset the student info section
    document.getElementById("studentName").innerHTML = `Họ tên: ${studentData.name}`;
    document.getElementById("studentMSSV").innerHTML = `MSSV: ${studentData.mssv}`;
    document.getElementById("studentNganhKhoa").innerHTML = `Ngành học - Khóa: ${studentData.nganhkhoa}`;

    const studentActivitiesDiv = document.querySelector(".student-activities");
    const table = document.createElement("table");
    table.classList.add("activity-table");

    const headerRow = table.insertRow();
    const headers = ["STT", "Tên hoạt động", "Đơn vị phụ trách", "Điểm"];
    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    var index = 0;
    studentData.activities.forEach(activity => {
        index++;
        const row = table.insertRow();
        const cells = [index, activity.name, activity.donvi, activity.diem];
        cells.forEach(cellText => {
            const cell = row.insertCell();
            cell.textContent = cellText;
        });
    });

    studentActivitiesDiv.appendChild(table);
    document.getElementById("studentInfo").style.display = "block";
}

function displayNoActivityMessage() {
    resetStudentInfo(); // Reset the student info section
    const studentActivitiesDiv = document.querySelector(".student-activities");
    const errorMessage = "Bạn chưa tham gia hoạt động nào trong học kỳ này.";
    const errorMessageElement = document.createElement("p");
    errorMessageElement.textContent = errorMessage;
    errorMessageElement.style.textAlign = "center";
    studentActivitiesDiv.appendChild(errorMessageElement);
}

function resetStudentInfo() {
    document.getElementById("studentName").innerHTML = "";
    document.getElementById("studentMSSV").innerHTML = "";
    document.getElementById("studentNganhKhoa").innerHTML = "";
    document.querySelector(".student-activities").innerHTML = "";
    document.getElementById("studentInfo").style.display = "block";
}
