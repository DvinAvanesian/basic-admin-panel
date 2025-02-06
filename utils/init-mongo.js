/* eslint-disable no-undef */
// mongodb init script for docker compose

db = db.getSiblingDB('BasicPanelDB')
db.createUser({
  user: 'basic_user',
  pwd: 'password123',
  roles: [{ role: 'readWrite', db: 'BasicPanelDB' }]
})
