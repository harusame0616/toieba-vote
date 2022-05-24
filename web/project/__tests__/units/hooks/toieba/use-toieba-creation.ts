/**
 * @jest-environment jsdom
 */
import { act, renderHook, waitFor } from '@testing-library/react';
import useToiebaCreation from '../../../../hooks/toieba/use-toieba-creation';

let renderHookResult: { current: ReturnType<typeof useToiebaCreation> };

describe('setTheme', () => {
  describe('正常系', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useToiebaCreation());
      renderHookResult = result;
    });

    it('初期値が空', () => {
      expect(renderHookResult.current.theme).toBe('');
    });

    it.each(['a', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'])(
      '値が設定できる',
      async (theme) => {
        act(() => {
          renderHookResult.current.setTheme(theme);
        });

        expect(renderHookResult.current.theme).toBe(theme);
      }
    );
  });

  describe('異常系', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useToiebaCreation());
      renderHookResult = result;
    });

    it.each([
      ['', 'テーマは1文字以上で入力してください。'],
      [
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        'テーマは36文字以下で入力してください。',
      ],
    ])('文字数エラー', (theme, errorMessage) => {
      expect(() => renderHookResult.current.setTheme(theme)).toThrow(
        errorMessage
      );
    });
  });
});

describe('addChoice', () => {
  describe('正常系', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useToiebaCreation());
      renderHookResult = result;
    });

    it('初期値が空の配列', () => {
      expect(renderHookResult.current.choices).toEqual([]);
    });

    it.each([
      'a',
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    ])('選択肢が追加できる', (choiceLabel) => {
      act(() => renderHookResult.current.addChoice(choiceLabel));
      expect(renderHookResult.current.choices[0].label).toEqual(choiceLabel);
    });
  });

  describe('異常系', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useToiebaCreation());
      renderHookResult = result;
    });

    it.each([
      ['', '選択肢を入力してください。'],
      [
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        '選択肢は64文字以下で入力してください。',
      ],
    ])('選択肢ラベル文字数エラー', (choiceLabel, errorMessage) => {
      expect(() => renderHookResult.current.addChoice(choiceLabel)).toThrow(
        errorMessage
      );
    });

    it('選択肢ラベル重複', () => {
      act(() => {
        renderHookResult.current.addChoice('label');
      });

      expect(() => renderHookResult.current.addChoice('label')).toThrow(
        '選択肢が重複しています。'
      );
    });

    it('選択肢数オーバー', async () => {
      for (const index of Array(10)
        .fill(0)
        .map((_, index) => index)) {
        act(() => {
          renderHookResult.current.addChoice(`label${index}`);
        });
      }

      expect(() => renderHookResult.current.addChoice('overchoice')).toThrow(
        '選択肢は10個までです。'
      );
    });
  });
});

describe('swapChoiceOrder', () => {
  describe('正常系', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useToiebaCreation());
      renderHookResult = result;

      act(() => {
        renderHookResult.current.addChoice('label1');
      });
      act(() => {
        renderHookResult.current.addChoice('label2');
      });
      act(() => {
        renderHookResult.current.addChoice('label3');
      });
    });

    it('順番が変更できる', () => {
      act(() => {
        renderHookResult.current.swapChoiceOrder(0, 2);
      });
      expect(renderHookResult.current.choices[0].label).toBe('label3');
      expect(renderHookResult.current.choices[2].label).toBe('label1');
    });
  });

  describe('異常系', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useToiebaCreation());
      renderHookResult = result;

      act(() => {
        renderHookResult.current.addChoice('label1');
      });
      act(() => {
        renderHookResult.current.addChoice('label2');
      });
      act(() => {
        renderHookResult.current.addChoice('label3');
      });
    });
    it.each([
      [0, 3],
      [-1, 2],
    ])('範囲外', (from, to) => {
      expect(() => renderHookResult.current.swapChoiceOrder(from, to)).toThrow(
        '範囲外です。'
      );
    });
  });

  describe('deleteChoice', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useToiebaCreation());
      renderHookResult = result;
      act(() => {
        renderHookResult.current.addChoice('label1');
      });
      act(() => {
        renderHookResult.current.addChoice('label2');
      });
    });
    describe('正常系', () => {
      it.each([0, 1])('削除できる', (index) => {
        act(() => renderHookResult.current.deleteChoice(index));
        expect(renderHookResult.current.choices.length).toBe(1);
      });
    });
    describe('異常系', () => {
      it.each([-1, 2])('範囲外', (index) => {
        expect(() => renderHookResult.current.deleteChoice(index)).toThrow(
          '範囲外です。'
        );
      });
    });
  });
});
