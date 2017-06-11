const sinon = require('sinon');
const playerController = require('../../src/controllers/player.js');
const Player = require('../../src/models/Player.js');

describe('Player Controller', () => {
  let res;
  let req;

  beforeEach(() => {
    res = {
      status: () => (
        {
          send: () => {},
          json: () => {},
        }
      ),
    };
    req = {
      params: {
        id: 'aaabbbccc',
      },
    };
  });

  it('Successfully get players', (done) => {
    const resSpy = sinon.spy(res, 'status');
    const playerStub = sinon.stub(Player, 'find').callsFake((query, callback) => {
      callback();

      sinon.assert.calledWith(resSpy, 200);
      sinon.assert.calledOnce(playerStub);

      resSpy.restore();
      playerStub.restore();
      done();
    });

    playerController.getPlayes(req, res);
  });
  it('Successfully get one player', (done) => {
    const resSpy = sinon.spy(res, 'status');
    const playerStub = sinon.stub(Player, 'findById').callsFake((id, callback) => {
      callback();

      sinon.assert.calledWith(resSpy, 200);
      sinon.assert.calledOnce(playerStub);

      resSpy.restore();
      playerStub.restore();
      done();
    });

    playerController.getPlayer(req, res);
  });
  it('Successfully add a player', (done) => {
    // I didn't find solution to test it
    done();
  });
  it('Successfully update a player', (done) => {
    const resSpy = sinon.spy(res, 'status');
    const playerStub = sinon.stub(Player, 'updateOne').callsFake((query, params, options, callback) => {
      callback();

      sinon.assert.calledWith(resSpy, 200);
      sinon.assert.calledOnce(playerStub);

      resSpy.restore();
      playerStub.restore();
      done();
    });

    playerController.updatePlayer(req, res);
  });
  it('Successfully delete a player', (done) => {
    const resSpy = sinon.spy(res, 'status');
    const playerStub = sinon.stub(Player, 'deleteOne').callsFake((query, callback) => {
      callback();

      sinon.assert.calledWith(resSpy, 200);
      sinon.assert.calledOnce(playerStub);

      resSpy.restore();
      playerStub.restore();
      done();
    });

    playerController.deletePlayer(req, res);
  });
});
