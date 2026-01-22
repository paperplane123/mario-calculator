class MarioCalculator {
    constructor() {
        this.display = document.getElementById('display');
        this.buttonSound = document.getElementById('buttonSound');
        this.equalsSound = document.getElementById('equalsSound');
        this.currentInput = '0';
        this.operation = null;
        this.previousInput = null;
        this.shouldResetDisplay = false;
        
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        // 键盘支持
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });

        // 按钮点击声音
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.playSound(this.buttonSound);
            });
        });

        // 等号按钮特殊声音
        document.querySelector('.btn-equals').addEventListener('click', () => {
            this.playSound(this.equalsSound);
        });
    }

    handleKeyPress(e) {
        const key = e.key;
        
        if ('0123456789'.includes(key)) {
            this.appendToDisplay(key);
        } else if ('+-*/'.includes(key)) {
            this.appendToDisplay(key === '*' ? '*' : key);
        } else if (key === '.') {
            this.appendToDisplay('.');
        } else if (key === 'Enter' || key === '=') {
            this.calculate();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.clearDisplay();
        } else if (key === 'Backspace') {
            this.deleteLast();
        } else if (key === '%') {
            this.appendToDisplay('%');
        }
    }

    appendToDisplay(value) {
        if (this.shouldResetDisplay) {
            this.currentInput = '';
            this.shouldResetDisplay = false;
        }

        if (value === '.') {
            if (!this.currentInput.includes('.')) {
                this.currentInput += value;
            }
        } else if ('+-*/%'.includes(value)) {
            if (this.currentInput !== '' && !'+-*/%'.includes(this.currentInput.slice(-1))) {
                this.currentInput += value;
            }
        } else {
            if (this.currentInput === '0' && value !== '.') {
                this.currentInput = value;
            } else {
                this.currentInput += value;
            }
        }

        this.updateDisplay();
    }

    clearDisplay() {
        this.currentInput = '0';
        this.operation = null;
        this.previousInput = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    deleteLast() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }

    calculate() {
        try {
            let expression = this.currentInput;
            
            // 处理百分比
            expression = expression.replace(/(\d+)%/g, (match, num) => {
                return `(${num}/100)`;
            });

            // 替换×为*
            expression = expression.replace(/×/g, '*');

            // 安全计算
            const result = this.safeEval(expression);
            
            if (result !== null && result !== undefined && !isNaN(result)) {
                this.currentInput = this.formatResult(result);
                this.shouldResetDisplay = true;
                this.updateDisplay();
                
                // 成功计算播放特殊音效
                this.playSound(this.equalsSound);
            } else {
                throw new Error('无效计算');
            }
        } catch (error) {
            this.currentInput = '错误';
            this.shouldResetDisplay = true;
            this.updateDisplay();
            
            // 错误时播放清除音效
            setTimeout(() => {
                this.playSound(this.buttonSound);
                setTimeout(() => this.clearDisplay(), 500);
            }, 1000);
        }
    }

    safeEval(expression) {
        // 使用Function构造函数进行安全计算
        try {
            return Function('"use strict"; return (' + expression + ')')();
        } catch {
            return null;
        }
    }

    formatResult(result) {
        // 格式化结果，避免过长的小数
        const num = Number(result);
        if (Number.isInteger(num)) {
            return num.toString();
        } else {
            return num.toFixed(8).replace(/\.?0+$/, '');
        }
    }

    updateDisplay() {
        this.display.value = this.currentInput;
        
        // 添加显示动画
        this.display.style.transform = 'scale(1.02)';
        setTimeout(() => {
            this.display.style.transform = 'scale(1)';
        }, 50);
    }

    playSound(audioElement) {
        if (audioElement) {
            audioElement.currentTime = 0;
            audioElement.play().catch(error => {
                console.log('音频播放失败:', error);
            });
        }
    }
}

// 全局计算器实例
let globalCalculator = null;

// 页面加载完成后初始化计算器
document.addEventListener('DOMContentLoaded', () => {
    globalCalculator = new MarioCalculator();
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 全局函数供HTML按钮调用
function appendToDisplay(value) {
    if (globalCalculator) {
        globalCalculator.appendToDisplay(value);
    }
}

function clearDisplay() {
    if (globalCalculator) {
        globalCalculator.clearDisplay();
    }
}

function deleteLast() {
    if (globalCalculator) {
        globalCalculator.deleteLast();
    }
}

function calculate() {
    if (globalCalculator) {
        globalCalculator.calculate();
    }
}