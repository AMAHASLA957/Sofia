// Эффекты формы и анимация фона
if (window.innerWidth > 768) {
    const container = document.querySelector('.container');

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        // Движение градиентного фона
        document.body.style.backgroundPosition = `${x * 50}% ${y * 50}%`;

        // Наклон контейнера
        const rotateX = (y - 0.5) * 10;
        const rotateY = (x - 0.5) * 10;
        container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        container.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        container.style.transform = 'translateY(-8px)';
        container.classList.remove('active');
    });
}

// Сообщение об успешной отправке формы
const form = document.getElementById('requestForm');
const successMessage = document.querySelector('.success-message');

form.addEventListener('submit', function(e){
    e.preventDefault();
    successMessage.classList.add('show');
    form.reset();
    setTimeout(() => successMessage.classList.remove('show'), 3000);
});

// Canvas для звездного поля с мерцающими линиями
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';

const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const particles = [];
const particleCount = 60;
const maxDistance = 140;
const colors = ['#ff6f61', '#feb47b', '#ffb6c1', '#a18cd1', '#f6d365'];

for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.5,
        dAlpha: (Math.random() - 0.5) * 0.02
    });
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        p.alpha += p.dAlpha;
        if (p.alpha > 1) p.alpha = 1;
        if (p.alpha < 0.3) p.alpha = 0.3;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(p.color)},${p.alpha})`;
        ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < maxDistance) {
                const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                grad.addColorStop(0, `rgba(${hexToRgb(p1.color)},${p1.alpha})`);
                grad.addColorStop(1, `rgba(${hexToRgb(p2.color)},${p2.alpha})`);
                ctx.beginPath();
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1 * (1 - dist / maxDistance);
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }

    particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;
        if (p.y > height) p.y = 0;
        if (p.y < 0) p.y = height;
    });

    requestAnimationFrame(animate);
}
animate();

document.addEventListener('mousemove', (e) => {
    particles.forEach(p => {
        const dx = e.clientX - p.x;
        const dy = e.clientY - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
            p.x -= dx * 0.001;
            p.y -= dy * 0.001;
        }
    });
});

function hexToRgb(hex) {
    hex = hex.replace('#','');
    const bigint = parseInt(hex,16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
}




