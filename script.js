const firebaseConfig = {
  apiKey: "AIzaSyBrHk4qr4_zqvzAv6VLoSZbvuaU9XaQtdE",
  authDomain: "coffee-spark-ai-barista-79422.firebaseapp.com",
  databaseURL: "https://coffee-spark-ai-barista-79422-default-rtdb.firebaseio.com",
  projectId: "coffee-spark-ai-barista-79422",
  storageBucket: "coffee-spark-ai-barista-79422.firebasestorage.app",
  messagingSenderId: "190243975356",
  appId: "1:190243975356:web:367e2433484f00c2f4a0b9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const grid = document.getElementById('grid-container');
let scale = 0.5;

// ডাটা লোড করা
db.ref('pixels').on('value', (snapshot) => {
    if(!grid) return;
    grid.innerHTML = '';
    let count = 0;
    snapshot.forEach((child) => {
        const val = child.val();
        if(val.status === 'approved') {
            const el = document.createElement('a');
            el.className = 'pixel-slot';
            el.href = val.link;
            el.target = "_blank";
            el.style.left = val.x + 'px';
            el.style.top = val.y + 'px';
            el.style.backgroundImage = `url(${val.logo})`;
            grid.appendChild(el);
            count++;
        }
    });
    if(document.getElementById('sold-count')) document.getElementById('sold-count').innerText = count;
});

// ক্লিক হ্যান্ডেলার
if(grid) {
    grid.addEventListener('dblclick', (e) => {
        const rect = grid.getBoundingClientRect();
        const x = Math.floor(((e.clientX - rect.left) / scale) / 50) * 50;
        const y = Math.floor(((e.clientY - rect.top) / scale) / 50) * 50;
        window.selectedSpot = { x, y, id: `R${y/50 + 1}_C${x/50 + 1}` };
        document.getElementById('spotIDDisplay').innerText = "Spot: #" + window.selectedSpot.id;
        document.getElementById('selectionModal').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    });
}

function submitRequest() {
    const link = document.getElementById('custLink').value;
    const logo = document.getElementById('custLogo').value;
    if(!link || !logo) return alert("Please fill all fields!");

    db.ref('pixels/' + window.selectedSpot.id).set({
        ...window.selectedSpot, link, logo, status: 'pending'
    }).then(() => {
        window.open(`https://wa.me/8801576940717?text=Paid for Spot #${window.selectedSpot.id}`);
        closeModals();
    });
}

function closeModals() {
    document.getElementById('selectionModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// জুম সিস্টেম
let v = document.getElementById('viewport');
if(v) {
    v.addEventListener('wheel', e => {
        e.preventDefault();
        scale = Math.min(Math.max(0.1, scale + (e.deltaY > 0 ? -0.1 : 0.1)), 2);
        grid.style.transform = `scale(${scale})`;
    }, {passive: false});
    grid.style.transform = `scale(${scale})`;
}