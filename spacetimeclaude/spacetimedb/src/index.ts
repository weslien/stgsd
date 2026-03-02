import spacetimedb from './schema';

export const init = spacetimedb.init(_ctx => {
  // Called when the module is initially published
});

export const onConnect = spacetimedb.clientConnected(_ctx => {
  // Called every time a new client connects
});

export const onDisconnect = spacetimedb.clientDisconnected(_ctx => {
  // Called every time a client disconnects
});
