const sinon = require('sinon');
const homeController = require('../../src/controllers/home.js');

describe('Home Controller', () => {
  let res;
  let req;

  beforeEach(() => {
    res = {
      status: () => (
        {
          send: () => {},
        }
      ),
    };
  });

  it('Should return success message', (done) => {
    const resSpy = sinon.spy(res, 'status');

    homeController.checkApp(req, res);

    sinon.assert.calledWith(resSpy, 200);

    resSpy.restore();
    done();
  });
});
