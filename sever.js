const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); // ให้เสิร์ฟไฟล์ HTML/CSS/JS

// โหลดข้อมูลจาก students.json
let students = [];
if (fs.existsSync('students.json')) {
    students = JSON.parse(fs.readFileSync('students.json'));
} else {
    fs.writeFileSync('students.json', JSON.stringify([]));
}

// API: ดึงข้อมูลรหัสนักศึกษาทั้งหมด
app.get('/students', (req, res) => {
    res.json(students);
});

// API: เพิ่มรหัสนักศึกษา
app.post('/students', (req, res) => {
    const { id } = req.body;
    if (!id || id.length !== 8) {
        return res.status(400).json({ message: 'รหัสไม่ถูกต้อง ต้องมี 8 หลัก' });
    }
    if (students.includes(id)) {
        return res.status(400).json({ message: 'รหัสนี้มีอยู่แล้ว' });
    }
    students.push(id);
    fs.writeFileSync('students.json', JSON.stringify(students));
    res.json({ message: `เพิ่มรหัส ${id} สำเร็จ` });
});

// API: ลบรหัสนักศึกษา
app.delete('/students/:id', (req, res) => {
    const id = req.params.id;
    const index = students.indexOf(id);
    if (index === -1) {
        return res.status(404).json({ message: 'ไม่พบรหัสนี้' });
    }
    students.splice(index, 1);
    fs.writeFileSync('students.json', JSON.stringify(students));
    res.json({ message: `ลบรหัส ${id} สำเร็จ` });
});

// เริ่มรัน server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
