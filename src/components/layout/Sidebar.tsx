// src/components/layout/Sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CheckSquare,
  Building2,
  Users,
  Briefcase,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"
import { signOut } from "next-auth/react"

const menuItems = [
  { name: "Início", href: "/", icon: LayoutDashboard },
  { name: "Tarefas", href: "/tarefas", icon: CheckSquare },
  { name: "Empresas", href: "/empresas", icon: Building2 },
  { name: "Pessoas", href: "/pessoas", icon: Users },
  { name: "Negócios", href: "/negocios", icon: Briefcase },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">CRM</h1>
          <p className="text-xs text-gray-500">Gestão Comercial</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  )
}