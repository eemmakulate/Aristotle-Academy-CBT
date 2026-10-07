import React, { useState } from 'react';
import { Calculator, X } from 'lucide-react';

interface JAMBCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JAMBCalculator: React.FC<JAMBCalculatorProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleSquareRoot = () => {
    const val = parseFloat(display);
    if (val >= 0) {
      setDisplay(String(Math.sqrt(val)));
      setWaitingForOperand(true);
    } else {
      setDisplay('Error');
    }
  };

  const handlePercentage = () => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const handleToggleSign = () => {
    const val = parseFloat(display);
    setDisplay(String(val * -1));
  };

  const performOperation = (nextOp: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const currentValue = prevValue || 0;
      let newValue = currentValue;

      if (operation === '+') newValue = currentValue + inputValue;
      else if (operation === '-') newValue = currentValue - inputValue;
      else if (operation === '×') newValue = currentValue * inputValue;
      else if (operation === '÷') newValue = inputValue !== 0 ? currentValue / inputValue : 0;

      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOp === '=' ? null : nextOp);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white rounded-2xl shadow-2xl border-2 border-blue-500 w-72 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header Bar */}
      <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200 font-mono">
            JAMB CBT Standard Calculator
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Screen Display */}
      <div className="p-4 bg-slate-900 border-b border-slate-800">
        <div className="text-right font-mono text-2xl font-bold text-emerald-400 truncate overflow-x-auto select-all">
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="p-3 grid grid-cols-4 gap-2 text-xs font-bold font-mono">
        <button onClick={handleClear} className="p-2.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-white cursor-pointer">C</button>
        <button onClick={handleSquareRoot} className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 cursor-pointer">√</button>
        <button onClick={handlePercentage} className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 cursor-pointer">%</button>
        <button onClick={() => performOperation('÷')} className="p-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white cursor-pointer">÷</button>

        <button onClick={() => handleDigit('7')} className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer">7</button>
        <button onClick={() => handleDigit('8')} className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer">8</button>
        <button onClick={() => handleDigit('9')} className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer">9</button>
        <button onClick={() => performOperation('×')} className="p-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white cursor-pointer">×</button>

        <button onClick={() => handleDigit('4')} className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer">4</button>
        <button onClick={() => handleDigit('5')} className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer">5</button>
        <button onClick={() => handleDigit('6')} className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer">6</button>
        <button onClick={() => performOperation('-')} className="p-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white cursor-pointer">-</button>

        <button onClick={() => handleDigit('1')} className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer">1</button>
        <button onClick={() => handleDigit('2')} className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer">2</button>
        <button onClick={() => handleDigit('3')} className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer">3</button>
        <button onClick={() => performOperation('+')} className="p-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white cursor-pointer">+</button>

        <button onClick={handleToggleSign} className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">±</button>
        <button onClick={() => handleDigit('0')} className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer">0</button>
        <button onClick={handleDecimal} className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">.</button>
        <button onClick={() => performOperation('=')} className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer">=</button>
      </div>
    </div>
  );
};
