import { GridPage } from './app.po';

describe('grid App', () => {
  let page: GridPage;

  beforeEach(() => {
    page = new GridPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to cb!!'))
      .then(done, done.fail);
  });
});
