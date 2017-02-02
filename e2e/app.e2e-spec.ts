import { A2aPage } from './app.po';

describe('a2a App', function() {
  let page: A2aPage;

  beforeEach(() => {
    page = new A2aPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
