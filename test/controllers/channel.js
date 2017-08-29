const sinon = require('sinon');
const channelController = require('../../src/controllers/channel.js');
const Channel = require('../../src/models/Channel.js');

describe('Channel Controller', () => {
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
      params: {},
      body: {},
      query: {},
    };
  });

  it('Successfully get a channel', async function () {
    const resSpy = sinon.spy(res, 'status');

    const channelFindStub = sinon.stub(Channel, 'findById').callsFake(async function () { return {} });

    try {
      await channelController.getChannel(req, res);
  
      sinon.assert.calledWith(resSpy, 200);
      channelFindStub.restore();
      return;
    } catch (error) {
      throw error;
    }
  });

  it('Failed to get channel', async function () {
    const resSpy = sinon.spy(res, 'status');

    const channelFindStub = sinon.stub(Channel, 'findById').callsFake(async function () { return null });

    try {
      await channelController.getChannel(req, res);
  
      sinon.assert.calledWith(resSpy, 404);
      channelFindStub.restore();
      return;
    } catch (error) {
      throw error;
    }
  });

  it('Successfully get a random channel', async function () {
    const resSpy = sinon.spy(res, 'status');
    const fakeReturnFromFind = {
      skip: () => {
        return {
          limit: async function() {
            return [{}]
          }
        };
      }
    };

    const channelCountStub = sinon.stub(Channel, 'count').callsFake(async function () { return 1 });
    const channelFindStub = sinon.stub(Channel, 'find').callsFake(function () { return fakeReturnFromFind });

    try {
      req.query.random = true;
      await channelController.getChannel(req, res);
  
      sinon.assert.calledWith(resSpy, 200);
      channelCountStub.restore();
      channelFindStub.restore();
      return;
    } catch (error) {
      throw error;
    }
  });

  it('Successfully add a new channel', async function () {
    const resSpy = sinon.spy(res, 'status');

    const channelUpdateStub = sinon.stub(Channel, 'update').callsFake(async function () { return });

    try {
      req.body._id = 'aaa';
      await channelController.addChannel(req, res);
  
      sinon.assert.calledWith(resSpy, 200);
      channelUpdateStub.restore();
      return;
    } catch (error) {
      throw error;
    }
  });

  it('Get error while saving a new channel', async function () {
    const resSpy = sinon.spy(res, 'status');

    const channelUpdateStub = sinon.stub(Channel, 'update').throws();

    try {
      req.body._id = 'aaa';
      await channelController.addChannel(req, res);
  
      sinon.assert.calledWith(resSpy, 500);
      channelUpdateStub.restore();
      return;
    } catch (error) {
      throw error;
    }
  });

  it('Saving a new channel without _id', async function () {
    const resSpy = sinon.spy(res, 'status');

    const channelUpdateStub = sinon.stub(Channel, 'update').throws();

    try {
      await channelController.addChannel(req, res);
  
      sinon.assert.calledWith(resSpy, 500);
      channelUpdateStub.restore();
      return;
    } catch (error) {
      throw error;
    }
  });
});
