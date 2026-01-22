// 增强版音效系统
class MarioSoundSystem {
    constructor() {
        this.sounds = {
            button: this.createSound(523.25, 0.1),  // C5
            number: this.createSound(659.25, 0.1),  // E5
            operator: this.createSound(783.99, 0.1), // G5
            clear: this.createSound(392.00, 0.2),   // G4
            equals: this.createSound(1046.50, 0.3), // C6
            error: this.createSound(349.23, 0.5)    // F4
        };
    }

    createSound(frequency, duration) {
        return () => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    play(soundType) {
        if (this.sounds[soundType]) {
            this.sounds[soundType]();
        }
    }
}

// 全局音效实例
window.marioSounds = new MarioSoundSystem();

// 为所有按钮添加音效
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const classList = e.target.classList;
            
            if (classList.contains('btn-number')) {
                window.marioSounds.play('number');
            } else if (classList.contains('btn-operator')) {
                window.marioSounds.play('operator');
            } else if (classList.contains('btn-clear')) {
                window.marioSounds.play('clear');
            } else if (classList.contains('btn-equals')) {
                window.marioSounds.play('equals');
            } else {
                window.marioSounds.play('button');
            }
        });
    });
});