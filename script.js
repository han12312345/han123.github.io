const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const MAX_CIRCLE_RADIUS = 100; // 定义圆圈的最大半径

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const balls = [];
const circle = { x: canvas.width / 2, y: canvas.height / 2, radius: 30, length: 0 }; // 初始圆圈半径减小

class Ball {
    constructor(x, y, dx, dy, radius, color) {
        this.x = x;
        this.y = y;
        this.dx = dx * 4;
        this.dy = dy * 4;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }

    changeColor() {
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }
}

function checkCollision() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            let dx = balls[i].x - balls[j].x;
            let dy = balls[i].y - balls[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < balls[i].radius + balls[j].radius) {
                balls[i].changeColor();
                balls[j].changeColor();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新并渲染小球
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        ball.update();

        // 检查小球是否与圆圈相交
        let dx = ball.x - circle.x;
        let dy = ball.y - circle.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let radiusSum = circle.radius + circle.length; // 只需要圆圈的半径和长度
        if (distance <= radiusSum) {
            balls.splice(i, 1); // 移除小球
            // 增加圆圈的长度，但不超过最大半径
            let newLength = circle.length + 5; // 增加圆圈长度的预设值
            if (circle.radius + newLength <= MAX_CIRCLE_RADIUS) {
                circle.length = newLength;
            }
        }
    }

    // 绘制圆圈
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius + circle.length, 0, 2 * Math.PI);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();

    // 在左上角绘制计数器
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`剩余小球数量: ${balls.length}`, 10, 30);

    // 如果所有小球都被吃掉，显示成功消息
    if (balls.length === 0) {
        ctx.fillStyle = 'green';
        ctx.font = '40px Arial';
        ctx.fillText('成功！所有小球都被吃掉！', canvas.width / 2 - 200, canvas.height / 2);
    }

    checkCollision();
    requestAnimationFrame(animate);
}


function init() {
    for (let i = 0; i < 20; i++) {
        let radius = Math.random() * 20 + 5;
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = Math.random() * (canvas.height - radius * 2) + radius;
        let dx = (Math.random() - 0.5) * 2;
        let dy = (Math.random() - 0.5) * 2;
        let color = `hsl(${Math.random() * 360}, 100%, 50%)`; // 初始颜色随机
        balls.push(new Ball(x, y, dx, dy, radius, color));
    }
    animate();
}

// 添加拖动事件
let isDragging = false;

canvas.addEventListener('mousedown', (e) => {
    const dx = e.clientX - circle.x;
    const dy = e.clientY - circle.y;
    if (dx * dx + dy * dy < circle.radius * circle.radius) {
        isDragging = true;
    }
});


canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        circle.x = e.clientX;
        circle.y = e.clientY;
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

init();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});