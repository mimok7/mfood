// @ts-nocheck
'use client'

type Cat = { id: string; name: string; position: number }

export default function CategoryTabs({ categories }: { categories: Cat[] }) {
  const tabs = [{ id: 'all', name: '전체' }, ...categories]

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`px-3 py-1 rounded-full border text-sm ${'all' === t.id ? 'bg-black text-white border-black' : 'hover:bg-gray-100'}`}
        >
          {t.name}
        </button>
      ))}
    </div>
  )
}