import {create} from 'zustand'
import {persist} from 'zustand/middleware'

interface useStoreDashboardStore{
    section: string,
    sectionActive: (section: string) => void
}

export const useStoreDashboard = create<useStoreDashboardStore>()(
    persist(
        (set) => ({
            section: 'dashboard',
            sectionActive: (section) => set({section: section})
        }),
        {
            name: 'sidebar-storage'
        }
    )
)