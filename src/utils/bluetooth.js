export const BT_DEVICES = [
  { id: 'bt-1', name: 'Device 1' },
  { id: 'bt-2', name: 'Device 2' },
]

export const connectBT = async (deviceId) => {
  return { connected: true, deviceId }
}
