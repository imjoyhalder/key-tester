import test from 'node:test'
import assert from 'node:assert/strict'
import { useKeyboardStore } from '../stores/keyboard-store.ts'

const store = () => useKeyboardStore.getState()
test('duplicate keydown and keyup do not inflate counts', () => {
  store().clearAll()
  store().pressKey('KeyA', 'A', Date.now())
  store().pressKey('KeyA', 'A', Date.now())
  assert.equal(store().keys.KeyA.pressCount, 1)
  store().releaseKey('KeyA', performance.now())
  store().releaseKey('KeyA', performance.now())
  assert.equal(store().testedCount, 1)
  assert.equal(store().allLatencies.length, 1)
})
test('held combinations are tracked and reset clears them', () => {
  store().clearAll()
  store().pressKey('KeyA', 'A', Date.now())
  store().pressKey('KeyS', 'S', Date.now())
  assert.equal(store().currentlyPressed.size, 2)
  assert.equal(store().maxRollover, 2)
  store().clearAll()
  store().releaseKey('KeyA', performance.now())
  assert.equal(store().testedCount, 0)
  assert.equal(store().currentlyPressed.size, 0)
  assert.equal(store().inputHistory.length, 0)
})
test('retesting an already registered key does not count it twice', () => {
  store().clearAll()
  for (let i=0; i<3; i++) {
    store().pressKey('Space', 'Space', Date.now())
    store().releaseKey('Space', performance.now())
  }
  assert.equal(store().testedCount, 1)
  assert.equal(store().keys.Space.pressCount, 3)
})
