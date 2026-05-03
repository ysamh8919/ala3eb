// ==================== Bluetooth Multiplayer ====================
const BluetoothManager = {
    device: null,
    server: null,
    service: null,
    isHost: false,
    roomCode: null,
    connectedPlayers: [],

    // إعدادات الخدمة
    SERVICE_UUID: '0000casino-0000-1000-8000-00805f9b34fb',
    CHARACTERISTIC_UUID: '0000game-0000-1000-8000-00805f9b34fb',

    // ============ إنشاء غرفة (Host) ============
    async createRoom() {
        try {
            this.isHost = true;
            this.roomCode = this.generateRoomCode();
            
            // إنشاء إعلان BLE
            const advertisement = {
                serviceUUIDs: [this.SERVICE_UUID],
                manufacturerData: [{
                    id: 0x9999,
                    data: new TextEncoder().encode(this.roomCode)
                }]
            };

            console.log('📶 جاري إنشاء غرفة...');
            console.log('🔑 كود الغرفة:', this.roomCode);
            
            App.showToast(`📶 غرفة جاهزة! الكود: ${this.roomCode}`);
            this.updateUI('host', this.roomCode);
            return this.roomCode;
        } catch (error) {
            console.error('❌ فشل إنشاء الغرفة:', error);
            App.showToast('❌ فشل إنشاء الغرفة. تأكد من تفعيل البلوتوث.');
            return null;
        }
    },

    // ============ الانضمام إلى غرفة (Client) ============
    async joinRoom(roomCode) {
        try {
            this.isHost = false;
            this.roomCode = roomCode;
            
            console.log('🔍 جاري البحث عن غرفة:', roomCode);
            
            const device = await navigator.bluetooth.requestDevice({
                filters: [{
                    manufacturerData: [{
                        companyIdentifier: 0x9999,
                        dataPrefix: new TextEncoder().encode(roomCode)
                    }]
                }],
                optionalServices: [this.SERVICE_UUID]
            });

            this.device = device;
            console.log('✅ تم العثور على الجهاز:', device.name);
            
            const server = await device.gatt.connect();
            this.server = server;
            
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            this.service = service;
            
            App.showToast(`📶 تم الاتصال بالغرفة: ${roomCode}`);
            this.updateUI('client', roomCode);
            this.startListening();
            return true;
        } catch (error) {
            console.error('❌ فشل الانضمام:', error);
            App.showToast('❌ لم يتم العثور على الغرفة');
            return false;
        }
    },

    // ============ إرسال رسالة ============
    async sendMessage(data) {
        if (!this.service || !this.isHost) return;
        
        try {
            const message = JSON.stringify(data);
            console.log('📤 إرسال:', message);
            
            // في الواقع هتحتاج WebSocket أو P2P للمراسلة الحقيقية
            // هذا محاكاة للتجربة
            this.onMessageReceived(data);
        } catch (error) {
            console.error('❌ فشل الإرسال:', error);
        }
    },

    // ============ استقبال الرسائل ============
    startListening() {
        if (this.isHost) return;
        
        // محاكاة استقبال البيانات
        console.log('👂 جاري الاستماع للرسائل...');
        
        // في الواقع: بنستخدم characteristic.addEventListener
        setInterval(() => {
            // محاكاة وصول رسالة من الهوست
            const fakeData = this.generateFakeGameData();
            this.onMessageReceived(fakeData);
        }, 5000);
    },

    // ============ معالجة الرسائل المستلمة ============
    onMessageReceived(data) {
        console.log('📥 رسالة مستلمة:', data);
        
        switch(data.type) {
            case 'game_start':
                App.showToast('🎮 اللعبة بدأت!');
                break;
            case 'game_result':
                App.showToast(`🏆 النتيجة: ${data.result}`);
                break;
            case 'player_joined':
                this.connectedPlayers.push(data.playerName);
                this.updatePlayersList();
                App.showToast(`👋 ${data.playerName} انضم!`);
                break;
            case 'bet_placed':
                App.showToast(`💰 ${data.playerName}: راهن ${data.amount} 🪙`);
                break;
            case 'chat':
                App.showToast(`💬 ${data.playerName}: ${data.message}`);
                break;
            default:
                console.log('رسالة غير معروفة:', data);
        }
    },

    // ============ مغادرة الغرفة ============
    async leaveRoom() {
        if (this.device && this.device.gatt.connected) {
            await this.device.gatt.disconnect();
        }
        this.device = null;
        this.server = null;
        this.service = null;
        this.isHost = false;
        this.roomCode = null;
        this.connectedPlayers = [];
        
        App.showToast('👋 تم مغادرة الغرفة');
        this.updateUI('idle');
    },

    // ============ أدوات مساعدة ============
    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    },

    generateFakeGameData() {
        const types = ['bet_placed', 'chat', 'game_result'];
        const type = types[Math.floor(Math.random() * types.length)];
        return {
            type: type,
            playerName: 'Player_' + Math.floor(Math.random() * 100),
            amount: Math.floor(Math.random() * 500) + 10,
            message: 'Good luck! 🍀',
            result: Math.random() > 0.5 ? 'ربح' : 'خسارة'
        };
    },

    // ============ تحديث واجهة المستخدم ============
    updateUI(state, roomCode = '') {
        const existingModal = document.getElementById('bluetoothModal');
        if (existingModal) existingModal.remove();

        if (state === 'host' || state === 'client') {
            const modal = document.createElement('div');
            modal.id = 'bluetoothModal';
            modal.innerHTML = `
                <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:999">
                    <div style="background:#1a1a1a;padding:24px;border-radius:16px;border:2px solid #d4af37;min-width:300px;text-align:center">
                        <h3 style="color:#d4af37">📶 غرفة بلوتوث</h3>
                        <div style="background:#000;padding:20px;border-radius:12px;margin:16px 0">
                            <p style="color:#999;font-size:12px">كود الغرفة</p>
                            <p style="font-size:36px;font-weight:900;color:#d4af37;letter-spacing:6px">${roomCode}</p>
                        </div>
                        <p style="color:#999;font-size:13px">${state === 'host' ? 'أنت المضيف 🎮' : 'متصل بالغرفة 🎮'}</p>
                        <div id="bluetoothPlayers" style="margin:12px 0;color:#999;font-size:13px">
                            ${state === 'host' ? 'في انتظار لاعبين...' : 'متصل بالمضيف...'}
                        </div>
                        <button onclick="BluetoothManager.leaveRoom()" style="background:#c0392b;color:#fff;border:none;padding:12px 24px;border-radius:30px;cursor:pointer;font-weight:700">🔌 مغادرة</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
    },

    updatePlayersList() {
        const playersDiv = document.getElementById('bluetoothPlayers');
        if (playersDiv) {
            playersDiv.innerHTML = this.connectedPlayers.map(p => `👤 ${p}`).join('<br>') || 'في انتظار لاعبين...';
        }
    },

    // ============ تشغيل اللعبة عبر البلوتوث ============
    startBluetoothGame(gameType) {
        if (!this.isHost) return;
        
        this.sendMessage({
            type: 'game_start',
            game: gameType,
            timestamp: Date.now()
        });
        
        App.showToast(`🎮 بدأت لعبة ${gameType} مع ${this.connectedPlayers.length} لاعبين`);
    }
};