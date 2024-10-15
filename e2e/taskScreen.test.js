import { TEXT_OVER_3_LINES }  from '../constants/constants'
const jestExpect = require('expect').default;

const validText = 'first task'

describe('Example', () => {

  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should delete completed tasks from screen', async () => {
    await element(by.id("AddTask.Plus_button")).multiTap(3)

    const attributesBefore = await element(by.id("TaskItem.Active")).getAttributes();
    jestExpect(attributesBefore.elements.length).toBe(3);

    await element(by.id("TaskItem.Active")).atIndex(0).tap();
    const attributesAfter = await element(by.id("TaskItem.Active")).getAttributes();
    jestExpect(attributesAfter.elements.length).toBe(2);
  });

  it('should be able to add valid text in todo', async () => {
    await element(by.id("DescribeTask.Input")).typeText(validText)
    await element(by.id("AddTask.Plus_button")).tap()

    const attributes = await element(by.id("TaskItem.Active")).getAttributes();
    jestExpect(attributes.label).toBe(validText);
  });

  for (let invalidText of [TEXT_OVER_3_LINES]) {
    it(`should not be able to add invalid text in todo`, async () => {
      await element(by.id("DescribeTask.Input")).replaceText(invalidText)
      await element(by.id("AddTask.Plus_button")).tap()

      const attributesAfter = await element(by.id("TaskItem.Active")).getAttributes();
      jestExpect(attributesAfter.label).not.toBe(invalidText);
    });
  }

  it('should show same tasks after app reload', async () => {
    await element(by.id("DescribeTask.Input")).typeText(validText)
    await element(by.id("AddTask.Plus_button")).tap()

    await device.reloadReactNative();

    const attributes = await element(by.id("TaskItem.Active")).getAttributes();
    jestExpect(attributes.label).toBe(validText);
  });
});
