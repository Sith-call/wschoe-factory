import React from 'react'
import { PlantedTree } from './types'
import Tree from './Tree'

interface ForestProps {
  trees: PlantedTree[]
  newestTreeId: string | null
}

export default function Forest({ trees, newestTreeId }: ForestProps) {
  if (trees.length === 0) {
    return (
      <div className="rounded-2xl bg-surface border border-forest-200 p-6 text-center">
        <p className="text-gray-400 font-sans text-sm">
          아직 나무가 없어요. 집중 세션을 완료하면 나무가 심어져요!
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-surface border border-forest-200 p-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {trees.map((t) => (
          <Tree key={t.id} type={t.type} isNew={t.id === newestTreeId} />
        ))}
      </div>
    </div>
  )
}
