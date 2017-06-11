const { expect } = require('chai');
const sinon = require('sinon');
require('sinon-mongoose');
const Player = require('../../src/models/Player');

/* I must to say it's boring test, just to check the Mongoose library works fine */
describe('Player Model', () => {
  let playerSample;
  let playerSampleTwo;

  beforeEach(() => {
    playerSample = {
      _id: 'aaabbbccc',
      name: 'Lebron James',
      type: 'basketball',
      age: 30,
    };
    playerSampleTwo = {
      _id: 'aaabbbccc',
      name: 'Lebron James',
      type: 'basketball',
      age: 30,
    };
  });

  afterEach(() => {});

  it('Should find all players', (done) => {
    const PlayerMock = sinon.mock(Player);

    PlayerMock
      .expects('find')
      .withArgs({})
      .yields(null, [playerSample, playerSampleTwo]);

    Player.find({}, (err, result) => {
      PlayerMock.verify();
      PlayerMock.restore();
      expect(result.length).to.equal(2);
      done();
    });
  });

  it('Should find exact player by Id', (done) => {
    const PlayerMock = sinon.mock(Player);

    PlayerMock
      .expects('findById')
      .withArgs('aaabbbccc')
      .yields(null, playerSample);

    Player.findById('aaabbbccc', (err, result) => {
      PlayerMock.verify();
      PlayerMock.restore();
      expect(result._id).to.equal('aaabbbccc');
      done();
    });
  });

  it('Should save without error', (done) => {
    const PlayerMock = sinon.mock(new Player(playerSample));
    const player = PlayerMock.object;

    PlayerMock
      .expects('save')
      .yields(null, playerSample);

    player.save((err, result) => {
      PlayerMock.verify();
      PlayerMock.restore();
      expect(result._id).to.equal('aaabbbccc');
      done();
    });
  });

  it('Should update player without error', (done) => {
    const PlayerMock = sinon.mock(Player);

    PlayerMock
      .expects('updateOne')
      .withArgs({ _id: 'aaabbbccc' })
      .yields(null, 'success');

    Player.updateOne({ _id: 'aaabbbccc' }, (err, result) => {
      PlayerMock.verify();
      PlayerMock.restore();
      expect(result).to.equal('success');
      done();
    });
  });

  it('Should delete player without error', (done) => {
    const PlayerMock = sinon.mock(Player);

    PlayerMock
      .expects('deleteOne')
      .withArgs({ _id: 'aaabbbccc' })
      .yields(null, 'success');

    Player.deleteOne({ _id: 'aaabbbccc' }, (err, result) => {
      PlayerMock.verify();
      PlayerMock.restore();
      expect(result).to.equal('success');
      done();
    });
  });
});
