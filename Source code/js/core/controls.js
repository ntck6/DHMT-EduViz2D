// Bảng điều khiển dùng control có sẵn của HTML5, mọi bài học dùng chung.
export function createControls(root) {
  let buttonRow = null;

  function add(el) {
    root.append(el);
    return el;
  }

  return {
    clear() {
      root.replaceChildren();
      buttonRow = null;
    },

    heading(text) {
      const el = document.createElement('h3');
      el.textContent = text;
      add(el);
      buttonRow = null;
    },

    slider({ label, min, max, step, value, unit = '', onInput }) {
      const el = document.createElement('label');
      el.className = 'ctl-slider';

      const caption = document.createElement('span');
      const output = document.createElement('output');
      output.textContent = `${value} ${unit}`.trim();
      caption.append(label, output);

      const input = document.createElement('input');
      input.type = 'range';
      Object.assign(input, { min, max, step, value });
      input.addEventListener('input', () => {
        output.textContent = `${input.value} ${unit}`.trim();
        onInput(Number(input.value));
      });

      el.append(caption, input);
      add(el);
    },

    button(label, onClick) {
      if (!buttonRow) {
        buttonRow = add(document.createElement('div'));
        buttonRow.className = 'ctl-buttons';
      }
      const el = document.createElement('button');
      el.type = 'button';
      el.textContent = label;
      el.addEventListener('click', onClick);
      buttonRow.append(el);
      return el;
    },

    checkbox(label, checked, onChange) {
      const el = document.createElement('label');
      el.className = 'ctl-check';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = checked;
      input.addEventListener('change', () => onChange(input.checked));
      el.append(input, ` ${label}`);
      add(el);
    },

    // Trả về hàm để cập nhật giá trị hiển thị.
    readout(label) {
      const el = document.createElement('div');
      el.className = 'ctl-readout';
      const output = document.createElement('output');
      el.append(label, output);
      add(el);
      return (text) => {
        output.textContent = text;
      };
    },
  };
}
