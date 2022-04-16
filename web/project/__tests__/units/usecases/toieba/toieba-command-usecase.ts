import crypto from 'crypto';
import { IMToiebaRepository } from '../../../../domains/infrastructures/in-memory/im-toieba-repository';
import { ToiebaCommandUsecase } from '../../../../domains/usecases/toieba-command-usecase';

describe('create', () => {
  const themeMinLengthText = 'a';
  const themeMaxLengthText = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  const themeUnderMinLengthText = themeMinLengthText.slice(
    0,
    themeMinLengthText.length - 1
  );
  const themeOverMaxLengthText = themeMaxLengthText + 'a';
  const labelMinLengthText = 'a';
  const labelMaxLengthText =
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  const labelUnderMinLengthText = labelMinLengthText.slice(
    0,
    themeMinLengthText.length - 1
  );
  const labelOverMaxLengthText = labelMaxLengthText + 'a';

  let toiebaCommandUsecase: ToiebaCommandUsecase;
  let store: any = {};
  beforeEach(() => {
    toiebaCommandUsecase = new ToiebaCommandUsecase(
      new IMToiebaRepository(store)
    );
  });

  describe('正常系', () => {
    it.each([themeMinLengthText, themeMaxLengthText])(
      'テーマが設定される',
      async (theme) => {
        const res = await toiebaCommandUsecase.create({
          theme,
          choices: [
            { index: 1, label: 'label1' },
            { index: 2, label: 'label2' },
          ],
          creatorId: crypto.randomUUID(),
        });

        const registeredToieba = store[res.toiebaId];
        expect(registeredToieba.theme).toBe(theme);
      }
    );

    it.each([2, 10])('選択肢が設定される', async (choiceNumber) => {
      const res = await toiebaCommandUsecase.create({
        theme: 'theme',
        choices: Array(choiceNumber)
          .fill(0)
          .map((_, index) => ({ index, label: `label${index}` })),
        creatorId: crypto.randomUUID(),
      });

      const registeredToieba = store[res.toiebaId];
      expect(registeredToieba.choices.length).toBe(choiceNumber);
    });

    it.each([labelMinLengthText, labelMaxLengthText])(
      '選択肢のラベルが設定される',
      async (choiceLabel) => {
        const res = await toiebaCommandUsecase.create({
          theme: 'theme',
          choices: [
            { index: 1, label: choiceLabel },
            { index: 2, label: 'label2' },
          ],
          creatorId: crypto.randomUUID(),
        });

        const registeredToieba = store[res.toiebaId];
        expect(registeredToieba.choices[0].label).toBe(choiceLabel);
      }
    );
  });

  describe('異常系', () => {
    it.each([
      [themeUnderMinLengthText, 'テーマは1文字以上である必要があります。'],
      [themeOverMaxLengthText, 'テーマは36文字以下である必要があります。'],
      [undefined, 'テーマは必須です。'],
    ])('テーマのバリデーションエラー', async (theme: any, errorMessage) => {
      await expect(
        toiebaCommandUsecase.create({
          theme,
          choices: [
            { index: 1, label: 'label1' },
            { index: 2, label: 'label2' },
          ],
          creatorId: crypto.randomUUID(),
        })
      ).rejects.toThrow(errorMessage);
    });

    it.each([
      [1, '選択肢は2個以上である必要があります。'],
      [11, '選択肢は10個以下である必要があります。'],
      [undefined, '選択肢は2個以上である必要があります。'],
    ])('選択肢数のエラー', async (choiceNum: any, errorMessage) => {
      await expect(
        toiebaCommandUsecase.create({
          theme: 'theme',
          choices:
            choiceNum == undefined
              ? (undefined as any)
              : new Array(choiceNum)
                  .fill(undefined)
                  .map((_, index) => ({ index, label: `label${index}` })),
          creatorId: crypto.randomUUID(),
        })
      ).rejects.toThrow(errorMessage);
    });

    it.each([
      [
        labelUnderMinLengthText,
        '選択肢ラベルは1文字以上である必要があります。',
      ],
      [
        labelOverMaxLengthText,
        '選択肢ラベルは64文字以下である必要があります。',
      ],
      [undefined, '選択肢ラベルは必須です。'],
    ])(
      '選択肢ラベルのバリデーションエラー',
      async (label: any, errorMessage) => {
        await expect(
          toiebaCommandUsecase.create({
            theme: 'theme',
            choices: [
              { index: 1, label },
              { index: 2, label: 'label2' },
            ],
            creatorId: crypto.randomUUID(),
          })
        ).rejects.toThrow(errorMessage);
      }
    );

    it('選択肢の重複エラー', async () => {
      await expect(
        toiebaCommandUsecase.create({
          theme: 'theme',
          choices: [
            { index: 1, label: 'label' },
            { index: 2, label: 'label' },
          ],
          creatorId: crypto.randomUUID(),
        })
      ).rejects.toThrow('それぞれの選択肢は重複していない必要があります。');
    });
  });
});
