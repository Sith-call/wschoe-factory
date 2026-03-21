import React from 'react'
import { TreeType } from './types'

interface TreeProps {
  type: TreeType
  isNew?: boolean
}

export default function Tree({ type, isNew }: TreeProps) {
  const animClass = isNew ? 'animate-tree-pop' : ''

  return (
    <div
      className={`flex flex-col items-center justify-end ${animClass}`}
      style={{ width: 40, height: 50 }}
    >
      {type === 'sapling' && <SaplingTree />}
      {type === 'pine' && <PineTree />}
      {type === 'cherry' && <CherryTree />}
      {type === 'maple' && <MapleTree />}
      {type === 'oak' && <OakTree />}
    </div>
  )
}

function SaplingTree() {
  return (
    <>
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderBottom: '18px solid #22c55e',
        }}
      />
      <div style={{ width: 4, height: 10, backgroundColor: '#92400e' }} />
    </>
  )
}

function PineTree() {
  return (
    <>
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: '12px solid #15803d',
          marginBottom: -4,
        }}
      />
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '11px solid transparent',
          borderRight: '11px solid transparent',
          borderBottom: '14px solid #16a34a',
          marginBottom: -4,
        }}
      />
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderBottom: '14px solid #22c55e',
        }}
      />
      <div style={{ width: 5, height: 8, backgroundColor: '#78350f' }} />
    </>
  )
}

function CherryTree() {
  return (
    <>
      <div
        style={{
          width: 26,
          height: 22,
          borderRadius: '50%',
          backgroundColor: '#f9a8d4',
          boxShadow: 'inset -3px -3px 0 #f472b6',
        }}
      />
      <div style={{ width: 5, height: 10, backgroundColor: '#92400e' }} />
    </>
  )
}

function MapleTree() {
  return (
    <>
      <div
        style={{
          width: 30,
          height: 20,
          borderRadius: '6px 6px 2px 2px',
          backgroundColor: '#f97316',
          boxShadow: 'inset -3px -3px 0 #ea580c',
        }}
      />
      <div style={{ width: 5, height: 10, backgroundColor: '#78350f' }} />
    </>
  )
}

function OakTree() {
  return (
    <>
      <div
        style={{
          width: 30,
          height: 26,
          borderRadius: '50%',
          backgroundColor: '#4ade80',
          boxShadow: 'inset -4px -4px 0 #22c55e',
        }}
      />
      <div style={{ width: 6, height: 10, backgroundColor: '#78350f' }} />
    </>
  )
}
