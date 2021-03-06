import { browser, by, element } from 'protractor';

export class GridPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('cb-root h1')).getText();
  }
}
